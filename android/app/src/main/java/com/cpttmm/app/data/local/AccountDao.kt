package com.cpttmm.app.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Query
import androidx.room.Upsert
import kotlinx.coroutines.flow.Flow

@Dao
interface AccountDao {
    @Query("SELECT * FROM accounts ORDER BY lastUsedAtMillis DESC")
    fun observeAccounts(): Flow<List<AccountEntity>>

    @Query("SELECT COUNT(*) FROM accounts")
    suspend fun accountCount(): Int

    @Query("SELECT * FROM accounts WHERE binggan = :binggan LIMIT 1")
    suspend fun accountByBinggan(binggan: String): AccountEntity?

    @Query("UPDATE accounts SET cachedThemeName = :themeName WHERE id = :accountId")
    suspend fun updateCachedTheme(accountId: String, themeName: String)

    @Query("SELECT * FROM account_secrets WHERE accountId = :accountId LIMIT 1")
    suspend fun secrets(accountId: String): AccountSecretEntity?

    @Query("DELETE FROM account_secrets WHERE accountId = :accountId")
    suspend fun deleteSecrets(accountId: String)

    @Query("SELECT * FROM pending_revocations ORDER BY createdAtMillis")
    suspend fun pendingRevocations(): List<PendingRevocationEntity>

    @Query("SELECT * FROM browser_tabs WHERE accountId = :accountId ORDER BY lastUsedAtMillis DESC")
    fun observeTabs(accountId: String): Flow<List<BrowserTabEntity>>

    @Query("SELECT * FROM browser_tabs WHERE accountId = :accountId ORDER BY lastUsedAtMillis DESC")
    suspend fun tabs(accountId: String): List<BrowserTabEntity>

    @Query("SELECT COUNT(*) FROM browser_tabs WHERE accountId = :accountId")
    suspend fun tabCount(accountId: String): Int

    @Query("UPDATE browser_tabs SET title = :title WHERE id = :tabId AND title != :title")
    suspend fun updateTabTitle(tabId: String, title: String)

    @Upsert
    suspend fun upsertAccount(account: AccountEntity)

    @Upsert
    suspend fun upsertSecrets(secrets: AccountSecretEntity)

    @Upsert
    suspend fun upsertTab(tab: BrowserTabEntity)

    @Upsert
    suspend fun upsertPendingRevocation(revocation: PendingRevocationEntity)

    @Delete
    suspend fun deleteAccount(account: AccountEntity)

    @Delete
    suspend fun deletePendingRevocation(revocation: PendingRevocationEntity)

    @Delete
    suspend fun deleteTab(tab: BrowserTabEntity)
}
