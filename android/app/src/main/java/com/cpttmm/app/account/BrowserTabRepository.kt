package com.cpttmm.app.account

import androidx.room.withTransaction
import com.cpttmm.app.data.local.AppDatabase
import com.cpttmm.app.data.local.BrowserTabEntity
import com.cpttmm.app.model.WorkspacePolicy
import com.cpttmm.app.webview.RestorableWebViewState
import kotlinx.coroutines.flow.Flow
import java.util.UUID

class BrowserTabRepository(
    private val database: AppDatabase,
    private val nowMillis: () -> Long = System::currentTimeMillis,
) {
    private val dao = database.accountDao()

    fun observe(): Flow<List<BrowserTabEntity>> = dao.observeTabs()

    suspend fun ensureForAccount(accountId: String): BrowserTabEntity = database.withTransaction {
        dao.latestTab(accountId) ?: createInTransaction(accountId, "/")
    }

    suspend fun create(accountId: String, path: String = "/"): BrowserTabEntity =
        database.withTransaction {
            createInTransaction(accountId, path)
        }

    suspend fun markUsed(tab: BrowserTabEntity) {
        dao.markTabUsed(tab.id, nowMillis())
    }

    suspend fun updateTitle(tab: BrowserTabEntity, title: String) {
        if (title.isNotBlank()) dao.updateTabTitle(tab.id, tab.accountId, title)
    }

    suspend fun updatePath(tab: BrowserTabEntity, path: String) {
        dao.updateTabPath(tab.id, tab.accountId, normalizedPath(path))
    }

    suspend fun save(tab: BrowserTabEntity, state: RestorableWebViewState) {
        dao.updateTabState(
            tabId = tab.id,
            accountId = tab.accountId,
            path = state.path,
            title = state.title.ifBlank { tab.title },
            scrollY = state.scrollY,
            lastUsedAtMillis = nowMillis(),
        )
    }

    suspend fun switchAccount(
        tab: BrowserTabEntity,
        accountId: String,
        path: String,
    ): BrowserTabEntity = database.withTransaction {
        val switched = tab.copy(
            accountId = accountId,
            path = normalizedPath(path),
            title = DEFAULT_TITLE,
            scrollY = 0,
            lastUsedAtMillis = nowMillis(),
        )
        dao.switchTabAccount(
            tabId = switched.id,
            accountId = switched.accountId,
            path = switched.path,
            title = switched.title,
            lastUsedAtMillis = switched.lastUsedAtMillis,
        )
        switched
    }

    suspend fun close(tab: BrowserTabEntity): BrowserTabEntity? = database.withTransaction {
        dao.deleteTab(tab)
        dao.tabs().firstOrNull()
    }

    suspend fun deleteForAccount(accountId: String): BrowserTabEntity? = database.withTransaction {
        dao.deleteTabs(accountId)
        dao.tabs().firstOrNull()
    }

    suspend fun clearAll() {
        dao.deleteAllTabs()
    }

    private fun newTab(accountId: String, path: String): BrowserTabEntity = BrowserTabEntity(
        id = UUID.randomUUID().toString(),
        accountId = accountId,
        path = normalizedPath(path),
        title = DEFAULT_TITLE,
        scrollY = 0,
        lastUsedAtMillis = nowMillis(),
    )

    private suspend fun createInTransaction(accountId: String, path: String): BrowserTabEntity {
        if (!WorkspacePolicy.canAddTab(dao.tabCount())) throw TabLimitException()
        return newTab(accountId, path).also { dao.upsertTab(it) }
    }

    private fun normalizedPath(path: String): String = path.takeIf { it.startsWith('/') } ?: "/"

    private companion object {
        const val DEFAULT_TITLE = "小火锅"
    }
}

class TabLimitException : IllegalStateException("最多打开 10 个标签")
