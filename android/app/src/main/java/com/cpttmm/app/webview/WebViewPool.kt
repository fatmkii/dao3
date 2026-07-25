package com.cpttmm.app.webview

import com.cpttmm.app.model.WorkspacePolicy

interface PooledWebViewHost {
    val accountId: String
    fun pause()
    fun resume()
    fun updateAccessToken(accessToken: String)
    fun destroy(saveState: Boolean = true)
}

class WebViewPool<T : PooledWebViewHost> {
    private val hosts = linkedMapOf<String, T>()
    private var activeTabId: String? = null

    fun getOrCreate(tabId: String, accountId: String, factory: () -> T): T {
        hosts[tabId]?.let { existing ->
            if (existing.accountId == accountId) return existing
            remove(tabId, saveState = false)
        }
        return factory().also { hosts[tabId] = it }
    }

    fun activate(tabId: String, lastUsedAtMillis: Map<String, Long>) {
        activeTabId = tabId
        hosts.filterKeys { it != tabId }.values.forEach(PooledWebViewHost::pause)
        hosts[tabId]?.resume()

        while (hosts.size > WorkspacePolicy.MAX_LIVE_WEB_VIEWS) {
            val sleepingTabId = hosts.keys
                .filterNot { it == tabId }
                .minByOrNull { lastUsedAtMillis[it] ?: Long.MIN_VALUE }
                ?: break
            hosts.remove(sleepingTabId)?.destroy()
        }
    }

    fun updateAccessToken(accountId: String, accessToken: String) {
        hosts.values
            .filter { it.accountId == accountId }
            .forEach { it.updateAccessToken(accessToken) }
    }

    fun remove(tabId: String, saveState: Boolean) {
        hosts.remove(tabId)?.destroy(saveState)
        if (activeTabId == tabId) activeTabId = null
    }

    fun retainTabs(tabIds: Set<String>) {
        hosts.keys.filterNot(tabIds::contains).toList().forEach { tabId ->
            remove(tabId, saveState = false)
        }
    }

    fun trimToActive() {
        val retained = activeTabId
        hosts.keys.filterNot { it == retained }.toList().forEach { tabId ->
            hosts.remove(tabId)?.destroy()
        }
    }

    fun destroyAll() {
        hosts.values.forEach { it.destroy() }
        hosts.clear()
        activeTabId = null
    }
}
