package com.cpttmm.app.session

import com.cpttmm.app.crypto.TokenCipher
import com.cpttmm.app.data.local.AccountSecretEntity

class EncryptedSessionMapper(
    private val cipher: TokenCipher,
) {
    fun secrets(accountId: String, session: MobileSessionData): AccountSecretEntity {
        try {
            return AccountSecretEntity(
                accountId = accountId,
                encryptedAccessToken = cipher.encrypt(session.accessToken, accountId),
                encryptedRefreshToken = cipher.encrypt(session.refreshToken, accountId),
            )
        } catch (failure: Exception) {
            throw TokenEncryptionException(failure)
        }
    }
}

class TokenEncryptionException(cause: Throwable) : IllegalStateException("Token encryption failed", cause)
