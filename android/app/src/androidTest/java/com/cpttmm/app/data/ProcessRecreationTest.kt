package com.cpttmm.app.data

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.cpttmm.app.account.BrowserTabRepository
import com.cpttmm.app.account.SecureAccountRepository
import com.cpttmm.app.crypto.TokenCipher
import com.cpttmm.app.data.local.AppDatabase
import com.cpttmm.app.session.MobileSessionData
import com.cpttmm.app.webview.RestorableWebViewState
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import java.time.Instant

@RunWith(AndroidJUnit4::class)
class ProcessRecreationTest {
    @Test
    fun accountAndTabStateSurviveDatabaseReopen() {
        runBlocking {
            val context = ApplicationProvider.getApplicationContext<Context>()
            val databaseName = "process-recreation-test.db"
            context.deleteDatabase(databaseName)

            val firstDatabase = database(context, databaseName)
            val accounts = SecureAccountRepository(firstDatabase, TestCipher())
            val accountId = accounts.saveSession(session())
            val tabs = BrowserTabRepository(firstDatabase, nowMillis = { 123L })
            val tab = tabs.ensureInitial(accountId)
            tabs.save(
                tab,
                RestorableWebViewState(
                    path = "/thread/42?page=2",
                    title = "恢复测试",
                    scrollY = 640,
                ),
            )
            tabs.updateTitle(tab.id, "实时标题")
            firstDatabase.close()

            val reopenedDatabase = database(context, databaseName)
            val reopenedAccounts = SecureAccountRepository(reopenedDatabase, TestCipher())
            val account = reopenedDatabase.accountDao().accountByBinggan("ProcessCookie")
            val restoredTab = reopenedDatabase.accountDao().tabs(accountId).single()

            assertEquals(accountId, account?.id)
            assertEquals("access-token", reopenedAccounts.decryptedTokens(accountId)?.accessToken)
            assertEquals("/thread/42?page=2", restoredTab.path)
            assertEquals("实时标题", restoredTab.title)
            assertEquals(640, restoredTab.scrollY)

            reopenedDatabase.close()
            context.deleteDatabase(databaseName)
        }
    }

    private fun database(context: Context, name: String): AppDatabase =
        Room.databaseBuilder(context, AppDatabase::class.java, name).build()

    private fun session() = MobileSessionData(
        binggan = "ProcessCookie",
        accessToken = "access-token",
        accessExpiresAt = Instant.ofEpochMilli(1_000),
        refreshToken = "refresh-token",
        idleExpiresAt = Instant.ofEpochMilli(2_000),
    )

    private class TestCipher : TokenCipher {
        override fun encrypt(plaintext: String, accountId: String): String = "$accountId:${plaintext.reversed()}"

        override fun decrypt(ciphertext: String, accountId: String): String =
            ciphertext.removePrefix("$accountId:").reversed()
    }
}
