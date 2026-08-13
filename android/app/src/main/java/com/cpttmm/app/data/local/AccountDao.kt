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

    @Query("SELECT alias FROM accounts")
    suspend fun accountAliases(): List<String>

    @Query("SELECT * FROM accounts WHERE binggan = :binggan LIMIT 1")
    suspend fun accountByBinggan(binggan: String): AccountEntity?

    @Query("UPDATE accounts SET alias = :alias WHERE id = :accountId")
    suspend fun updateAlias(accountId: String, alias: String)

    @Query("SELECT * FROM account_secrets WHERE accountId = :accountId LIMIT 1")
    suspend fun secrets(accountId: String): AccountSecretEntity?

    @Query("DELETE FROM account_secrets WHERE accountId = :accountId")
    suspend fun deleteSecrets(accountId: String)

    @Query("SELECT * FROM pending_revocations ORDER BY createdAtMillis")
    suspend fun pendingRevocations(): List<PendingRevocationEntity>

    @Query("SELECT * FROM browser_tabs ORDER BY lastUsedAtMillis DESC")
    fun observeTabs(): Flow<List<BrowserTabEntity>>

    @Query("SELECT * FROM browser_tabs ORDER BY lastUsedAtMillis DESC")
    suspend fun tabs(): List<BrowserTabEntity>

    @Query("SELECT * FROM browser_tabs WHERE accountId = :accountId ORDER BY lastUsedAtMillis DESC LIMIT 1")
    suspend fun latestTab(accountId: String): BrowserTabEntity?

    @Query("SELECT COUNT(*) FROM browser_tabs")
    suspend fun tabCount(): Int

    @Query("UPDATE browser_tabs SET lastUsedAtMillis = :lastUsedAtMillis WHERE id = :tabId")
    suspend fun markTabUsed(tabId: String, lastUsedAtMillis: Long)

    @Query(
        """
        UPDATE browser_tabs
        SET path = :path, title = :title, scrollY = :scrollY, lastUsedAtMillis = :lastUsedAtMillis
        WHERE id = :tabId AND accountId = :accountId
        """,
    )
    suspend fun updateTabState(
        tabId: String,
        accountId: String,
        path: String,
        title: String,
        scrollY: Int,
        lastUsedAtMillis: Long,
    )

    @Query(
        "UPDATE browser_tabs SET title = :title WHERE id = :tabId AND accountId = :accountId AND title != :title",
    )
    suspend fun updateTabTitle(tabId: String, accountId: String, title: String)

    @Query(
        "UPDATE browser_tabs SET path = :path WHERE id = :tabId AND accountId = :accountId AND path != :path",
    )
    suspend fun updateTabPath(tabId: String, accountId: String, path: String)

    @Query(
        """
        UPDATE browser_tabs
        SET accountId = :accountId, path = :path, title = :title, scrollY = 0,
            lastUsedAtMillis = :lastUsedAtMillis
        WHERE id = :tabId
        """,
    )
    suspend fun switchTabAccount(
        tabId: String,
        accountId: String,
        path: String,
        title: String,
        lastUsedAtMillis: Long,
    )

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

    @Query("DELETE FROM browser_tabs WHERE accountId = :accountId")
    suspend fun deleteTabs(accountId: String)
}
