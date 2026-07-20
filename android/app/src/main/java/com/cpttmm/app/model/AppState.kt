package com.cpttmm.app.model

data class AppState(
    val accounts: List<AccountWorkspace> = emptyList(),
    val activeAccountId: String? = null,
)

data class AccountWorkspace(
    val id: String,
    val binggan: String,
    val tabs: List<BrowserTab>,
    val activeTabId: String,
)

data class BrowserTab(
    val id: String,
    val path: String,
    val title: String,
    val scrollY: Int,
    val lastUsedAtMillis: Long,
    val isLive: Boolean,
)
