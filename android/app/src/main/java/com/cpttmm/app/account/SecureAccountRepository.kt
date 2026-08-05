package com.cpttmm.app.account

import androidx.room.withTransaction
import com.cpttmm.app.crypto.TokenCipher
import com.cpttmm.app.data.local.AccountEntity
import com.cpttmm.app.data.local.AppDatabase
import com.cpttmm.app.data.local.PendingRevocationEntity
import com.cpttmm.app.model.WorkspacePolicy
import com.cpttmm.app.session.EncryptedSessionMapper
import com.cpttmm.app.session.MobileSessionData
import kotlinx.coroutines.flow.Flow
import java.util.UUID

class SecureAccountRepository(
    private val database: AppDatabase,
    private val cipher: TokenCipher,
    private val nowMillis: () -> Long = System::currentTimeMillis,
) {
    private val dao = database.accountDao()
    private val sessionMapper = EncryptedSessionMapper(cipher)

    fun observeAccounts(): Flow<List<AccountEntity>> = dao.observeAccounts()

    suspend fun saveSession(session: MobileSessionData): SavedAccount = database.withTransaction {
        val existing = dao.accountByBinggan(session.binggan)
        if (existing == null && !WorkspacePolicy.canAddAccount(dao.accountCount())) {
            throw AccountLimitException()
        }
        val accountId = existing?.id ?: UUID.randomUUID().toString()
        val storageNamespace = existing?.storageNamespace ?: "storage-${UUID.randomUUID()}"
        dao.upsertAccount(
            AccountEntity(
                id = accountId,
                binggan = session.binggan,
                alias = existing?.alias ?: AccountAliasPolicy.nextDefaultAlias(dao.accountAliases()),
                storageNamespace = storageNamespace,
                cachedThemeName = existing?.cachedThemeName,
                accessExpiresAtMillis = session.accessExpiresAt.toEpochMilli(),
                idleExpiresAtMillis = session.idleExpiresAt.toEpochMilli(),
                lastUsedAtMillis = nowMillis(),
            ),
        )
        dao.upsertSecrets(sessionMapper.secrets(accountId, session))

        SavedAccount(accountId = accountId, isNew = existing == null)
    }

    suspend fun decryptedTokens(accountId: String): AccountTokens? {
        val secrets = dao.secrets(accountId) ?: return null

        return AccountTokens(
            accessToken = cipher.decrypt(secrets.encryptedAccessToken, accountId),
            refreshToken = cipher.decrypt(secrets.encryptedRefreshToken, accountId),
        )
    }

    suspend fun updateCachedTheme(accountId: String, themeName: String) {
        dao.updateCachedTheme(accountId, themeName)
    }

    suspend fun updateAlias(accountId: String, alias: String) {
        dao.updateAlias(accountId, AccountAliasPolicy.requireValid(alias))
    }

    suspend fun invalidateSession(accountId: String) {
        dao.deleteSecrets(accountId)
    }

    suspend fun removeOffline(account: AccountEntity) = database.withTransaction {
        val secrets = dao.secrets(account.id)
        if (secrets != null) {
            dao.upsertPendingRevocation(
                PendingRevocationEntity(
                    id = UUID.randomUUID().toString(),
                    accountId = account.id,
                    encryptedRefreshToken = secrets.encryptedRefreshToken,
                    createdAtMillis = nowMillis(),
                ),
            )
        }
        dao.deleteAccount(account)
    }

    suspend fun removeLocal(account: AccountEntity) = database.withTransaction {
        dao.deleteAccount(account)
    }
}

data class AccountTokens(
    val accessToken: String,
    val refreshToken: String,
)

data class SavedAccount(
    val accountId: String,
    val isNew: Boolean,
)

class AccountLimitException : IllegalStateException("最多只能保存 5 个饼干")
