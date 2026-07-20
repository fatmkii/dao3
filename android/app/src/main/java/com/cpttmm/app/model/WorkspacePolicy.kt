package com.cpttmm.app.model

object WorkspacePolicy {
    const val MAX_ACCOUNTS = 5
    const val MAX_TABS_PER_ACCOUNT = 10
    const val MAX_LIVE_WEB_VIEWS = 3

    fun canAddAccount(currentCount: Int): Boolean = currentCount < MAX_ACCOUNTS

    fun canAddTab(currentCount: Int): Boolean = currentCount < MAX_TABS_PER_ACCOUNT

    fun tabsToSleep(tabs: List<BrowserTab>, activatingTabId: String): Set<String> {
        return tabs
            .asSequence()
            .filter { it.isLive && it.id != activatingTabId }
            .sortedByDescending { it.lastUsedAtMillis }
            .drop(MAX_LIVE_WEB_VIEWS - 1)
            .map { it.id }
            .toSet()
    }
}
