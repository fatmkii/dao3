package com.cpttmm.app.account

import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.cpttmm.app.crypto.TokenCipher
import com.cpttmm.app.data.local.AppDatabase
import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.network.MobileApi
import com.cpttmm.app.network.MobileReleaseInfo
import com.cpttmm.app.network.RegistrationStatus
import com.cpttmm.app.session.MobileSessionData
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import java.time.Instant

@RunWith(AndroidJUnit4::class)
class SecureAccountRepositoryTest {
    private lateinit var database: AppDatabase
    private lateinit var repository: SecureAccountRepository

    @Before
    fun setUp() {
        database = Room.inMemoryDatabaseBuilder(
            ApplicationProvider.getApplicationContext(),
            AppDatabase::class.java,
        ).build()
        repository = SecureAccountRepository(database, TestCipher(), nowMillis = { 123L })
    }

    @After
    fun tearDown() {
        database.close()
    }

    @Test
    fun storesOnlyEncryptedTokensAndEnforcesFiveAccountLimit() = runBlocking {
        withContext(Dispatchers.IO) {
            repeat(5) { repository.saveSession(session("cookie-$it")) }

            try {
                repository.saveSession(session("cookie-6"))
                fail("A sixth account must be rejected")
            } catch (_: AccountLimitException) {
                // Expected.
            }
            val first = database.accountDao().accountByBinggan("cookie-0")!!
            val secrets = database.accountDao().secrets(first.id)!!
            assertFalse(secrets.encryptedAccessToken.contains("access-cookie-0"))
            assertFalse(secrets.encryptedRefreshToken.contains("refresh-cookie-0"))
            assertEquals("access-cookie-0", repository.decryptedTokens(first.id)?.accessToken)

            repository.removeOffline(first)
            assertNull(database.accountDao().accountByBinggan("cookie-0"))
            assertNotNull(database.accountDao().pendingRevocations().single())
        }
    }

    @Test
    fun pendingRevocationIsDeletedOnlyAfterServerLogoutSucceeds() = runBlocking {
        withContext(Dispatchers.IO) {
            val accountId = repository.saveSession(session("cookie"))
            val account = database.accountDao().accountByBinggan("cookie")!!
            repository.removeOffline(account)
            val api = RecordingApi()
            val processor = PendingRevocationProcessor(
                database = database,
                cipher = TestCipher(),
                api = api,
                domain = { AppDomain.FALLBACK },
            )

            assertTrue(processor.process())
            assertEquals(listOf(AppDomain.FALLBACK to "refresh-cookie"), api.logouts)
            assertTrue(database.accountDao().pendingRevocations().isEmpty())
            assertNull(repository.decryptedTokens(accountId))
        }
    }

    @Test
    fun failedServerLogoutKeepsEncryptedRevocationQueued() = runBlocking {
        withContext(Dispatchers.IO) {
            val accountId = repository.saveSession(session("cookie"))
            repository.removeOffline(database.accountDao().accountByBinggan("cookie")!!)
            val processor = PendingRevocationProcessor(
                database = database,
                cipher = TestCipher(),
                api = RecordingApi(failLogout = true),
                domain = { AppDomain.PRIMARY },
            )

            assertFalse(processor.process())
            val queued = database.accountDao().pendingRevocations().single()
            assertEquals(accountId, queued.accountId)
            assertFalse(queued.encryptedRefreshToken.contains("refresh-cookie"))
        }
    }

    @Test
    fun invalidatingAnUncertainRefreshRemovesBothLocalTokens() = runBlocking {
        withContext(Dispatchers.IO) {
            val accountId = repository.saveSession(session("cookie"))

            repository.invalidateSession(accountId)

            assertNull(repository.decryptedTokens(accountId))
            assertNotNull(database.accountDao().accountByBinggan("cookie"))
        }
    }

    private fun session(binggan: String): MobileSessionData {
        return MobileSessionData(
            binggan = binggan,
            accessToken = "access-$binggan",
            accessExpiresAt = Instant.ofEpochMilli(1_000),
            refreshToken = "refresh-$binggan",
            idleExpiresAt = Instant.ofEpochMilli(2_000),
            absoluteExpiresAt = Instant.ofEpochMilli(3_000),
        )
    }

    private class TestCipher : TokenCipher {
        override fun encrypt(plaintext: String, accountId: String): String =
            plaintext.reversed() + ":" + accountId

        override fun decrypt(ciphertext: String, accountId: String): String =
            ciphertext.removeSuffix(":" + accountId).reversed()
    }

    private class RecordingApi(private val failLogout: Boolean = false) : MobileApi {
        val logouts = mutableListOf<Pair<AppDomain, String>>()

        override suspend fun login(
            domain: AppDomain,
            binggan: String,
            password: String?,
            installationId: String,
            deviceName: String,
            appVersion: String,
        ): MobileSessionData = error("not used")

        override suspend fun register(
            domain: AppDomain,
            registrationDeviceDigest: String,
            installationId: String,
            deviceName: String,
            appVersion: String,
        ): MobileSessionData = error("not used")

        override suspend fun registrationStatus(domain: AppDomain): RegistrationStatus = error("not used")

        override suspend fun refresh(domain: AppDomain, refreshToken: String): MobileSessionData =
            error("not used")

        override suspend fun logout(domain: AppDomain, refreshToken: String) {
            if (failLogout) error("offline")
            logouts += domain to refreshToken
        }

        override suspend fun version(domain: AppDomain): MobileReleaseInfo = error("not used")
    }
}
