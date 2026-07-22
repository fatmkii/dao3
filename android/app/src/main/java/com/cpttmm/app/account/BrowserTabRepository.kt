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

    fun observe(accountId: String): Flow<List<BrowserTabEntity>> = dao.observeTabs(accountId)

    suspend fun ensureInitial(accountId: String): BrowserTabEntity = database.withTransaction {
        dao.tabs(accountId).firstOrNull() ?: newTab(accountId, "/").also { dao.upsertTab(it) }
    }

    suspend fun create(accountId: String, path: String = "/"): BrowserTabEntity =
        database.withTransaction {
            if (!WorkspacePolicy.canAddTab(dao.tabCount(accountId))) {
                throw TabLimitException()
            }
            newTab(accountId, path).also { dao.upsertTab(it) }
        }

    suspend fun markUsed(tab: BrowserTabEntity) {
        dao.upsertTab(tab.copy(lastUsedAtMillis = nowMillis()))
    }

    suspend fun updateTitle(tabId: String, title: String) {
        if (title.isNotBlank()) dao.updateTabTitle(tabId, title)
    }

    suspend fun save(tab: BrowserTabEntity, state: RestorableWebViewState) {
        dao.upsertTab(
            tab.copy(
                path = state.path,
                title = state.title.ifBlank { tab.title },
                scrollY = state.scrollY,
                lastUsedAtMillis = nowMillis(),
            ),
        )
    }

    suspend fun close(tab: BrowserTabEntity): BrowserTabEntity = database.withTransaction {
        dao.deleteTab(tab)
        dao.tabs(tab.accountId).firstOrNull()
            ?: newTab(tab.accountId, "/").also { dao.upsertTab(it) }
    }

    private fun newTab(accountId: String, path: String): BrowserTabEntity = BrowserTabEntity(
        id = UUID.randomUUID().toString(),
        accountId = accountId,
        path = path.takeIf { it.startsWith('/') } ?: "/",
        title = "小火锅",
        scrollY = 0,
        lastUsedAtMillis = nowMillis(),
    )
}

class TabLimitException : IllegalStateException("每个账号最多打开 10 个标签")
