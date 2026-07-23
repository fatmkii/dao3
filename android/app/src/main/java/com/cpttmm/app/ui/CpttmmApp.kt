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
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import com.cpttmm.app.account.BrowserTabRepository
import com.cpttmm.app.account.MobileAuthCoordinator
import com.cpttmm.app.account.PendingRevocationWorker
import com.cpttmm.app.account.SecureAccountRepository
import com.cpttmm.app.data.local.AccountEntity
import com.cpttmm.app.diagnostics.DiagnosticLogger
import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.preferences.GlobalPreferencesRepository
import com.cpttmm.app.webview.WebProfileCleaner
import com.cpttmm.app.webview.WebViewCapability
import com.cpttmm.app.webview.WebViewHost
import com.cpttmm.app.webview.WebViewPool
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CpttmmApp(
    capability: WebViewCapability,
    auth: MobileAuthCoordinator,
    accounts: SecureAccountRepository,
    tabs: BrowserTabRepository,
    preferences: GlobalPreferencesRepository,
    diagnostics: DiagnosticLogger,
    foregroundGeneration: Int = 0,
    onWebViewHostChanged: (WebViewHost?) -> Unit = {},
    onWebViewPoolChanged: (WebViewPool<WebViewHost>?) -> Unit = {},
) {
    var nativeTheme by remember { mutableStateOf(defaultNativeThemePalette(null)) }
    CpttmmTheme(nativeTheme) {
        if (!capability.isSupported) {
            UnsupportedWebViewScreen(capability.missingFeatures)
            return@CpttmmTheme
        }

        val accountFlow = remember(accounts) { accounts.observeAccounts() }
        val accountList by accountFlow.collectAsState(initial = emptyList())
        val domain by preferences.domain.collectAsState(initial = AppDomain.PRIMARY)
        val scope = rememberCoroutineScope()
        val context = LocalContext.current
        var showAccountSheet by remember { mutableStateOf(false) }
        var showAccountSwitcher by remember { mutableStateOf(false) }
        var accountToRemove by remember { mutableStateOf<AccountEntity?>(null) }
        var accountToReauthenticate by remember { mutableStateOf<AccountEntity?>(null) }
        var activeAccountId by remember { mutableStateOf<String?>(null) }
        val activeAccount = accountList.firstOrNull { it.id == activeAccountId }

        LaunchedEffect(activeAccount?.id) {
            nativeTheme = defaultNativeThemePalette(activeAccount?.cachedThemeName)
        }

        if (activeAccount == null) {
            AccountHome(
                accounts = accountList,
                onAddAccount = { showAccountSheet = true },
                onSelectAccount = { activeAccountId = it.id },
                onRemoveAccount = { accountToRemove = it },
            )
        } else {
            ForumWorkspace(
                account = activeAccount,
                domain = domain,
                auth = auth,
                accounts = accounts,
                tabs = tabs,
                preferences = preferences,
                diagnostics = diagnostics,
                foregroundGeneration = foregroundGeneration,
                onWebViewHostChanged = onWebViewHostChanged,
                onWebViewPoolChanged = onWebViewPoolChanged,
                onSelectAccount = { showAccountSwitcher = true },
                onSessionExpired = {
                    accountToReauthenticate = activeAccount
                    activeAccountId = null
                    showAccountSwitcher = false
                    showAccountSheet = true
                },
                onThemeChanged = { name, primaryColor, backgroundColor ->
                    nativeTheme = NativeThemePalette(name, primaryColor, backgroundColor)
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
                onCompleted = { registeredAccountId ->
                    showAccountSheet = false
                    accountToReauthenticate = null
                    if (registeredAccountId != null) activeAccountId = registeredAccountId
                },
            )
        }

        if (showAccountSwitcher && activeAccount != null) {
            AccountSwitcherSheet(
                accounts = accountList,
                activeAccount = activeAccount,
                onSelect = {
                    activeAccountId = it.id
                    showAccountSwitcher = false
                },
                onAdd = {
                    showAccountSwitcher = false
                    accountToReauthenticate = null
                    showAccountSheet = true
                },
                onRemove = {
                    showAccountSwitcher = false
                    accountToRemove = it
                },
                onDismiss = { showAccountSwitcher = false },
            )
        }

        accountToRemove?.let { account ->
            AlertDialog(
                onDismissRequest = { accountToRemove = null },
                title = { Text("移除账号？") },
                text = { Text("将立即清除 ${account.binggan} 的本地工作区，并在联网后撤销这台设备的登录会话。") },
                confirmButton = {
                    TextButton(onClick = {
                        accountToRemove = null
                        WebProfileCleaner.clearAndDeleteWhenReleased(account.profileName)
                        scope.launch {
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
