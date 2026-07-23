package com.cpttmm.app.session

import com.cpttmm.app.crypto.TokenCipher
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Test
import java.time.Instant

class EncryptedSessionMapperTest {
    @Test
    fun `maps both tokens through account bound cipher`() {
        val cipher = RecordingCipher()
        val mapper = EncryptedSessionMapper(cipher)
        val secrets = mapper.secrets(
            "account-1",
            MobileSessionData(
                binggan = "cookie",
                accessToken = "access-secret",
                accessExpiresAt = Instant.EPOCH,
                refreshToken = "refresh-secret",
                idleExpiresAt = Instant.EPOCH,
            ),
        )

        assertEquals("opaque-1", secrets.encryptedAccessToken)
        assertEquals("opaque-2", secrets.encryptedRefreshToken)
        assertEquals(
            listOf("account-1" to "access-secret", "account-1" to "refresh-secret"),
            cipher.encryptions,
        )
        assertFalse(secrets.toString().contains("access-secret"))
        assertFalse(secrets.toString().contains("refresh-secret"))
    }

    private class RecordingCipher : TokenCipher {
        val encryptions = mutableListOf<Pair<String, String>>()

        override fun encrypt(plaintext: String, accountId: String): String {
            encryptions += accountId to plaintext

            return "opaque-${encryptions.size}"
        }

        override fun decrypt(ciphertext: String, accountId: String): String = error("not used")
    }
}
