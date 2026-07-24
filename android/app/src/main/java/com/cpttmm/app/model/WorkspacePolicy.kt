package com.cpttmm.app.model

object WorkspacePolicy {
    const val MAX_ACCOUNTS = 5
    const val MAX_TABS = 10
    const val MAX_LIVE_WEB_VIEWS = 3

    fun canAddAccount(currentCount: Int): Boolean = currentCount < MAX_ACCOUNTS

    fun canAddTab(currentCount: Int): Boolean = currentCount < MAX_TABS
}
