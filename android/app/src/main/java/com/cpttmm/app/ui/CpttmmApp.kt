package com.cpttmm.app.ui

import androidx.compose.foundation.layout.size
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import com.cpttmm.app.account.BrowserTabRepository
import com.cpttmm.app.account.MobileAuthCoordinator
import com.cpttmm.app.account.PendingRevocationWorker
import com.cpttmm.app.account.SavedAccount
import com.cpttmm.app.account.SecureAccountRepository
import com.cpttmm.app.data.local.AccountEntity
import com.cpttmm.app.diagnostics.DiagnosticLogger
import com.cpttmm.app.model.WorkspacePolicy
import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.preferences.AppThemePreferences
import com.cpttmm.app.preferences.GlobalPreferencesRepository
import com.cpttmm.app.webview.WebViewHost
import com.cpttmm.app.webview.WebViewPool
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.first

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CpttmmApp(
    auth: MobileAuthCoordinator,
    accounts: SecureAccountRepository,
    tabs: BrowserTabRepository,
    preferences: GlobalPreferencesRepository,
    diagnostics: DiagnosticLogger,
    initialThemePreferences: AppThemePreferences = AppThemePreferences(),
    isSystemDark: Boolean = false,
    foregroundGeneration: Int = 0,
    onWebViewHostChanged: (WebViewHost?) -> Unit = {},
    onWebViewPoolChanged: (WebViewPool<WebViewHost>?) -> Unit = {},
) {
    val accountFlow = remember(accounts) { accounts.observeAccounts() }
    val accountList by accountFlow.collectAsState(initial = emptyList())
    val domain by preferences.domain.collectAsState(initial = AppDomain.PRIMARY)
    val themePreferences by preferences.themePreferences.collectAsState(initial = initialThemePreferences)
    val keepTabsAfterClose by preferences.keepTabsAfterClose.collectAsState(initial = true)
    val tabFlow = remember(tabs) { tabs.observe() }
    val tabList by tabFlow.collectAsState(initial = emptyList())
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    var showAccountSheet by remember { mutableStateOf(false) }
    var accountToRemove by remember { mutableStateOf<AccountEntity?>(null) }
    var accountToReauthenticate by remember { mutableStateOf<AccountEntity?>(null) }
    var activeTabId by remember { mutableStateOf<String?>(null) }
    val activeTab = tabList.firstOrNull { it.id == activeTabId }
    val activeAccount = accountList.firstOrNull { it.id == activeTab?.accountId }
    val currentActiveTab by rememberUpdatedState(activeTab)
    val currentAccountList by rememberUpdatedState(accountList)
    val effectiveTheme = themePreferences.themeFor(isSystemDark)
    val displayedTheme =
        if (activeAccount == null || activeTab == null) {
            themePreferences.accountHomeTheme(isSystemDark)
        } else {
            effectiveTheme
        }
    var nativeTheme by remember {
        mutableStateOf(defaultNativeThemePalette(initialThemePreferences.accountHomeTheme(isSystemDark)))
    }

    LaunchedEffect(preferences, accounts, tabs) {
        if (!themePreferences.initialized) {
            val persistedTabs = tabs.observe().first()
            val persistedAccounts = accounts.observeAccounts().first()
            val recentAccountId = persistedTabs.firstOrNull()?.accountId
            val migratedTheme = persistedAccounts.firstOrNull { it.id == recentAccountId }?.cachedThemeName
            preferences.initializeThemePreferences(migratedTheme)
        }
    }

    LaunchedEffect(displayedTheme) {
        nativeTheme = defaultNativeThemePalette(displayedTheme)
    }

    CpttmmTheme(nativeTheme) {
        SyncSystemBars(nativeTheme)

        fun activateAccount(account: AccountEntity) {
            scope.launch {
                runCatching { tabs.ensureForAccount(account.id) }
                    .onSuccess { activeTabId = it.id }
            }
        }

        fun handleSavedAccount(saved: SavedAccount) {
            scope.launch {
                val selectedTab =
                    if (saved.isNew && tabList.size >= WorkspacePolicy.MAX_TABS && activeTab != null) {
                        tabs.switchAccount(activeTab, saved.accountId, "/")
                    } else {
                        tabs.ensureForAccount(saved.accountId)
                    }
                activeTabId = selectedTab.id
            }
        }

        fun handleSessionExpired(account: AccountEntity) {
            scope.launch {
                var next = tabs.deleteForAccount(account.id)
                if (next == null) {
                    currentAccountList.firstOrNull { it.id != account.id }?.let {
                        next = tabs.ensureForAccount(it.id)
                    }
                }
                if (currentActiveTab?.accountId == account.id) activeTabId = next?.id
                accountToReauthenticate = account
                showAccountSheet = true
            }
        }

        if (activeAccount == null || activeTab == null) {
            AccountHome(
                accounts = accountList,
                onAddAccount = { showAccountSheet = true },
                onSelectAccount = ::activateAccount,
                onRemoveAccount = { accountToRemove = it },
            )
        } else {
            ForumWorkspace(
                account = activeAccount,
                accountList = accountList,
                domain = domain,
                tabList = tabList,
                activeTab = activeTab,
                auth = auth,
                accounts = accounts,
                tabs = tabs,
                preferences = preferences,
                diagnostics = diagnostics,
                themePreferences = themePreferences,
                keepTabsAfterClose = keepTabsAfterClose,
                isSystemDark = isSystemDark,
                currentTheme = effectiveTheme,
                foregroundGeneration = foregroundGeneration,
                onWebViewHostChanged = onWebViewHostChanged,
                onWebViewPoolChanged = onWebViewPoolChanged,
                onSelectTab = { activeTabId = it?.id },
                onAddAccount = {
                    accountToReauthenticate = null
                    showAccountSheet = true
                },
                onRemoveAccount = { accountToRemove = it },
                onSessionExpired = ::handleSessionExpired,
                onThemeChanged = { theme, primaryColor, backgroundColor ->
                    nativeTheme = NativeThemePalette(theme.storageValue, primaryColor, backgroundColor)
                },
            )
        }

        if (showAccountSheet) {
            AddAccountSheet(
                domain = domain,
                accountLimitReached = accountList.size >= 5,
                reauthentication = accountToReauthenticate != null,
                initialBinggan = accountToReauthenticate?.binggan.orEmpty(),
                initialMessage = accountToReauthenticate?.let {
                    "${it.binggan} 的登录状态已过期，请重新登录。"
                },
                onDomainChange = { selected -> scope.launch { preferences.setDomain(selected) } },
                onDismiss = {
                    showAccountSheet = false
                    accountToReauthenticate = null
                },
                onLogin = { binggan, password -> auth.login(binggan, password) },
                onRegister = { auth.register() },
                loadRegistrationStatus = { auth.registrationStatus(domain) },
                onCompleted = { savedAccount ->
                    showAccountSheet = false
                    accountToReauthenticate = null
                    handleSavedAccount(savedAccount)
                },
            )
        }

        accountToRemove?.let { account ->
            AlertDialog(
                onDismissRequest = { accountToRemove = null },
                title = { Text("移除饼干？") },
                text = {
                    val tabCount = tabList.count { it.accountId == account.id }
                    Text(
                        "将立即关闭 ${account.binggan} 的 $tabCount 个标签并清除本地数据，" +
                            "联网后撤销这台设备的登录会话。",
                    )
                },
                confirmButton = {
                    TextButton(onClick = {
                        accountToRemove = null
                        scope.launch {
                            preferences.queueStorageCleanup(account.storageNamespace)
                            var next = tabs.deleteForAccount(account.id)
                            if (next == null) {
                                currentAccountList.firstOrNull { it.id != account.id }?.let {
                                    next = tabs.ensureForAccount(it.id)
                                }
                            }
                            if (currentActiveTab?.accountId == account.id) activeTabId = next?.id
                            accounts.removeOffline(account)
                            PendingRevocationWorker.enqueue(context)
                        }
                    }) { Text("移除") }
                },
                dismissButton = {
                    TextButton(onClick = { accountToRemove = null }) { Text("取消") }
                },
            )
        }
    }
}
