package com.cpttmm.app.ui

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.view.View
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.widget.Toast
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.cpttmm.app.BuildConfig
import com.cpttmm.app.R
import com.cpttmm.app.account.BrowserTabRepository
import com.cpttmm.app.account.MobileAuthCoordinator
import com.cpttmm.app.account.MobileSessionUnavailableException
import com.cpttmm.app.account.SecureAccountRepository
import com.cpttmm.app.data.local.AccountEntity
import com.cpttmm.app.data.local.BrowserTabEntity
import com.cpttmm.app.diagnostics.DiagnosticEvent
import com.cpttmm.app.diagnostics.DiagnosticLogger
import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.navigation.DomainPolicy
import com.cpttmm.app.navigation.NavigationTarget
import com.cpttmm.app.preferences.GlobalPreferencesRepository
import com.cpttmm.app.session.RefreshPolicy
import com.cpttmm.app.webview.WebViewHost
import com.cpttmm.app.webview.WebViewPool
import kotlinx.coroutines.launch
import org.json.JSONObject

@Composable
internal fun ForumWorkspace(
    account: AccountEntity,
    domain: AppDomain,
    auth: MobileAuthCoordinator,
    accounts: SecureAccountRepository,
    tabs: BrowserTabRepository,
    preferences: GlobalPreferencesRepository,
    diagnostics: DiagnosticLogger,
    foregroundGeneration: Int,
    onWebViewHostChanged: (WebViewHost?) -> Unit,
    onWebViewPoolChanged: (WebViewPool<WebViewHost>?) -> Unit,
    onSelectAccount: () -> Unit,
    onSessionExpired: () -> Unit,
    onThemeChanged: (String, Color, Color) -> Unit,
) {
    val tabFlow = remember(tabs, account.id) { tabs.observe(account.id) }
    val tabList by tabFlow.collectAsState(initial = emptyList())
    var activeTabId by remember(account.id) { mutableStateOf<String?>(null) }
    var accessToken by remember(account.id, domain) { mutableStateOf<String?>(null) }
    var error by remember(account.id, domain) { mutableStateOf<String?>(null) }
    var retryGeneration by remember(account.id, domain) { mutableStateOf(0) }

    LaunchedEffect(account.id) {
        val initial = tabs.ensureInitial(account.id)
        if (activeTabId == null) activeTabId = initial.id
    }
    LaunchedEffect(tabList) {
        if (activeTabId == null && tabList.isNotEmpty()) {
            activeTabId = tabList.first().id
        }
    }

    LaunchedEffect(account.id, domain, retryGeneration) {
        accessToken = null
        error = null
        runCatching { auth.accessTokenForWebView(account, domain) }
            .onSuccess { accessToken = it }
            .onFailure {
                if (it is MobileSessionUnavailableException) onSessionExpired()
                else error = accountErrorMessage(it)
            }
    }

    when {
        error != null -> {
            WorkspaceMessage(
                title = "论坛暂时无法打开",
                message = error.orEmpty(),
                actionLabel = "重试",
                onAction = { retryGeneration += 1 },
                onSelectAccount = onSelectAccount,
            )
        }

        accessToken == null || tabList.isEmpty() || tabList.none { it.id == activeTabId } -> {
            WorkspaceMessage(
                title = "正在准备工作区",
                message = "正在检查登录状态，然后再恢复网页网络活动。",
                onSelectAccount = onSelectAccount,
            )
        }

        else -> {
            ActiveForumWorkspace(
                account = account,
                domain = domain,
                accessToken = accessToken!!,
                tabs = tabList,
                activeTab = tabList.first { it.id == activeTabId },
                tabRepository = tabs,
                auth = auth,
                accounts = accounts,
                preferences = preferences,
                diagnostics = diagnostics,
                foregroundGeneration = foregroundGeneration,
                onWebViewHostChanged = onWebViewHostChanged,
                onWebViewPoolChanged = onWebViewPoolChanged,
                onSelectAccount = onSelectAccount,
                onSessionExpired = onSessionExpired,
                onThemeChanged = onThemeChanged,
                onSelectTab = { activeTabId = it.id },
                onError = {
                    if (it is MobileSessionUnavailableException) onSessionExpired()
                    else error = accountErrorMessage(it)
                },
            )
        }
    }
}

@Composable
private fun ActiveForumWorkspace(
    account: AccountEntity,
    domain: AppDomain,
    accessToken: String,
    tabs: List<BrowserTabEntity>,
    activeTab: BrowserTabEntity,
    tabRepository: BrowserTabRepository,
    auth: MobileAuthCoordinator,
    accounts: SecureAccountRepository,
    preferences: GlobalPreferencesRepository,
    diagnostics: DiagnosticLogger,
    foregroundGeneration: Int,
    onWebViewHostChanged: (WebViewHost?) -> Unit,
    onWebViewPoolChanged: (WebViewPool<WebViewHost>?) -> Unit,
    onSelectAccount: () -> Unit,
    onSessionExpired: () -> Unit,
    onThemeChanged: (String, Color, Color) -> Unit,
    onSelectTab: (BrowserTabEntity) -> Unit,
    onError: (Throwable) -> Unit,
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val pendingFileChooser =
        remember {
            mutableStateOf<ValueCallback<Array<Uri>>?>(null)
        }
    val fileChooserLauncher =
        rememberLauncherForActivityResult(
            ActivityResultContracts.StartActivityForResult(),
        ) { result ->
            pendingFileChooser.value?.onReceiveValue(
                WebChromeClient.FileChooserParams.parseResult(result.resultCode, result.data),
            )
            pendingFileChooser.value = null
        }
    var showTabs by remember { mutableStateOf(false) }
    var showSettings by remember { mutableStateOf(false) }
    var tabError by remember { mutableStateOf<String?>(null) }
    var settingsError by remember { mutableStateOf<String?>(null) }
    var pendingLongPressUrl by remember { mutableStateOf<String?>(null) }
    var currentAccessToken by remember(account.id, domain) { mutableStateOf(accessToken) }
    val pageErrors = remember(account.id, domain) { mutableStateMapOf<String, String?>() }
    val webViewPool = remember(account.id, domain) { WebViewPool<WebViewHost>() }

    fun openInNewTab(rawUrl: String) {
        when (val target = DomainPolicy.classify(rawUrl)) {
            NavigationTarget.Blocked -> {
                Unit
            }

            is NavigationTarget.External -> {
                context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(rawUrl)))
            }

            is NavigationTarget.Internal -> {
                scope.launch {
                    val path =
                        buildString {
                            append(target.uri.rawPath.ifBlank { "/" })
                            target.uri.rawQuery?.let { append('?').append(it) }
                            target.uri.rawFragment?.let { append('#').append(it) }
                        }
                    runCatching { tabRepository.create(account.id, path) }
                        .onSuccess {
                            tabError = null
                            onSelectTab(it)
                        }.onFailure {
                            tabError = it.message
                            showTabs = true
                        }
                }
            }
        }
    }

    val host =
        remember(account.id, domain, activeTab.id) {
            webViewPool.getOrCreate(activeTab.id) {
                lateinit var createdHost: WebViewHost
                createdHost =
                    WebViewHost(
                        context = context,
                        account = account,
                        accessToken = currentAccessToken,
                        onExternalNavigation = { url ->
                            context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                        },
                        onBridgeMessage = { message ->
                            scope.launch {
                                handleBridgeMessage(
                                    message = message,
                                    account = account,
                                    domain = domain,
                                    auth = auth,
                                    accounts = accounts,
                                    diagnostics = diagnostics,
                                    host = createdHost,
                                    onAccessTokenRefreshed = { refreshedToken ->
                                        currentAccessToken = refreshedToken
                                        webViewPool.updateAccessToken(refreshedToken)
                                    },
                                    onAuthFailure = onError,
                                    onThemeChanged = onThemeChanged,
                                )
                            }
                        },
                        onSaveState = { state -> scope.launch { tabRepository.save(activeTab, state) } },
                        onTitleChanged = { title ->
                            scope.launch { tabRepository.updateTitle(activeTab.id, title) }
                        },
                        onOpenNewTab = ::openInNewTab,
                        onLongPressLink = { pendingLongPressUrl = it },
                        onMainFrameError = {
                            pageErrors[activeTab.id] = it
                            if (it != null) diagnostics.record(DiagnosticEvent.WEBVIEW_MAIN_FRAME_ERROR)
                        },
                        onShowFileChooser = { callback, parameters ->
                            pendingFileChooser.value?.onReceiveValue(null)
                            pendingFileChooser.value = callback
                            runCatching { fileChooserLauncher.launch(parameters.createIntent()) }
                                .onFailure {
                                    pendingFileChooser.value?.onReceiveValue(null)
                                    pendingFileChooser.value = null
                                    diagnostics.record(DiagnosticEvent.FILE_CHOOSER_FAILED)
                                }.isSuccess
                        },
                        onDownloadFailure = {
                            diagnostics.record(DiagnosticEvent.DOWNLOAD_FAILED)
                            Toast.makeText(context, "下载未能开始，请稍后重试。", Toast.LENGTH_SHORT).show()
                        },
                    )
                createdHost.also { it.load(domain, activeTab.path, activeTab.scrollY) }
            }
        }

    LaunchedEffect(accessToken) {
        currentAccessToken = accessToken
        webViewPool.updateAccessToken(accessToken)
    }
    LaunchedEffect(host) {
        webViewPool.activate(activeTab.id, tabs.associate { it.id to it.lastUsedAtMillis })
    }
    LaunchedEffect(foregroundGeneration) {
        runCatching {
            auth.accessTokenForWebView(
                account = account,
                domain = domain,
                minimumRemainingMillis = RefreshPolicy.ON_FOREGROUND_MILLIS,
            )
        }.onSuccess { refreshedToken ->
            currentAccessToken = refreshedToken
            webViewPool.updateAccessToken(refreshedToken)
            webViewPool.activate(activeTab.id, tabs.associate { it.id to it.lastUsedAtMillis })
        }.onFailure {
            if (it is MobileSessionUnavailableException) onSessionExpired()
            else onError(it)
        }
    }
    DisposableEffect(host) {
        onWebViewHostChanged(host)
        onDispose {
            onWebViewHostChanged(null)
            host.pause()
        }
    }
    DisposableEffect(webViewPool) {
        onWebViewPoolChanged(webViewPool)
        onDispose {
            pendingFileChooser.value?.onReceiveValue(null)
            pendingFileChooser.value = null
            onWebViewPoolChanged(null)
            webViewPool.destroyAll()
        }
    }

    BackHandler {
        when {
            showTabs -> showTabs = false
            showSettings -> showSettings = false
            !host.goBack() -> (context as? Activity)?.moveTaskToBack(true)
        }
    }

    Scaffold(
        bottomBar = {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 2.dp,
            ) {
                Row(
                    modifier =
                        Modifier
                            .fillMaxWidth()
                            .navigationBarsPadding()
                            .padding(start = 10.dp, top = 4.dp, end = 10.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Surface(
                        onClick = { host.goBack() },
                        modifier =
                            Modifier
                                .size(width = 48.dp, height = 40.dp)
                                .semantics { contentDescription = "后退" },
                        shape = RoundedCornerShape(11.dp),
                        color = Color.Transparent,
                        contentColor = MaterialTheme.colorScheme.onSurface,
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                painter = painterResource(R.drawable.chevron_left),
                                contentDescription = null,
                                modifier = Modifier.size(24.dp),
                            )
                        }
                    }
                    Surface(
                        onClick = { host.goForward() },
                        modifier =
                            Modifier
                                .size(width = 48.dp, height = 40.dp)
                                .semantics { contentDescription = "前进" },
                        shape = RoundedCornerShape(11.dp),
                        color = Color.Transparent,
                        contentColor = MaterialTheme.colorScheme.onSurface,
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                painter = painterResource(R.drawable.chevron_right),
                                contentDescription = null,
                                modifier = Modifier.size(24.dp),
                            )
                        }
                    }
                    Surface(
                        onClick = { showTabs = true },
                        modifier =
                            Modifier.size(width = 48.dp, height = 40.dp).semantics {
                                contentDescription = "标签，共 ${tabs.size} 个"
                            },
                        shape = RoundedCornerShape(11.dp),
                        color = Color.Transparent,
                        contentColor = MaterialTheme.colorScheme.onSurface,
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Box(
                                modifier =
                                    Modifier.size(width = 28.dp, height = 30.dp).border(
                                        width = 2.dp,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        shape = RoundedCornerShape(6.dp),
                                    ),
                                contentAlignment = Alignment.Center,
                            ) {
                                Text(
                                    tabs.size.toString(),
                                    style = MaterialTheme.typography.labelLarge,
                                    fontWeight = FontWeight.Medium,
                                )
                            }
                        }
                    }
                    Surface(
                        onClick = { showSettings = true },
                        modifier =
                            Modifier.weight(1f).height(40.dp).semantics {
                                contentDescription = "当前饼干别名 ${account.alias}，打开设置"
                            },
                        shape = RoundedCornerShape(13.dp),
                        color = Color.Transparent,
                        contentColor = MaterialTheme.colorScheme.onSurface,
                    ) {
                        Box(
                            modifier = Modifier.padding(horizontal = 14.dp),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(account.alias, maxLines = 1, fontWeight = FontWeight.Medium)
                        }
                    }
                }
            }
        },
    ) { padding ->
        Box(Modifier.fillMaxSize().padding(padding)) {
            ActiveTabView(activeTab.id, host.view)
            pageErrors[activeTab.id]?.let {
                val alternative = if (domain == AppDomain.PRIMARY) AppDomain.FALLBACK else AppDomain.PRIMARY
                OfflineErrorPage(
                    alternativeHost = alternative.host.takeUnless { BuildConfig.DEBUG },
                    onRetry = {
                        pageErrors[activeTab.id] = null
                        host.reload()
                    },
                    onSwitchDomain = {
                        scope.launch {
                            runCatching { auth.accessTokenForWebView(account, alternative) }
                                .onSuccess { preferences.setDomain(alternative) }
                                .onFailure {
                                    if (it is MobileSessionUnavailableException) onSessionExpired()
                                    else pageErrors[activeTab.id] = accountErrorMessage(it)
                                }
                        }
                    },
                )
            }
        }
    }

    if (showTabs) {
        TabSheet(
            tabs = tabs,
            activeTab = activeTab,
            error = tabError,
            onSelect = {
                onSelectTab(it)
                scope.launch { tabRepository.markUsed(it) }
                showTabs = false
            },
            onCreate = {
                scope.launch {
                    runCatching { tabRepository.create(account.id) }
                        .onSuccess {
                            tabError = null
                            onSelectTab(it)
                            showTabs = false
                        }.onFailure { tabError = it.message }
                }
            },
            onClose = { tab ->
                scope.launch {
                    webViewPool.remove(tab.id, saveState = false)
                    pageErrors.remove(tab.id)
                    val next = tabRepository.close(tab)
                    if (tab.id == activeTab.id) onSelectTab(next)
                }
            },
            onDismiss = { showTabs = false },
        )
    }
    if (showSettings) {
        SettingsSheet(
            currentBinggan = account.binggan,
            domain = domain,
            auth = auth,
            error = settingsError,
            onDomainChange = { selected ->
                if (selected == domain) return@SettingsSheet
                settingsError = null
                scope.launch {
                    runCatching { auth.accessTokenForWebView(account, selected) }
                        .onSuccess {
                            preferences.setDomain(selected)
                            showSettings = false
                        }.onFailure {
                            if (it is MobileSessionUnavailableException) onSessionExpired()
                            else settingsError = accountErrorMessage(it)
                        }
                }
            },
            onSelectAccount = {
                showSettings = false
                onSelectAccount()
            },
            onDismiss = { showSettings = false },
        )
    }
    pendingLongPressUrl?.let { url ->
        AlertDialog(
            onDismissRequest = { pendingLongPressUrl = null },
            title = { Text("链接操作") },
            text = { Text("要在新标签中打开这个链接吗？") },
            confirmButton = {
                TextButton(onClick = {
                    pendingLongPressUrl = null
                    openInNewTab(url)
                }) { Text("在新标签打开") }
            },
            dismissButton = {
                TextButton(onClick = { pendingLongPressUrl = null }) { Text("取消") }
            },
        )
    }
}

@Composable
internal fun ActiveTabView(
    tabId: String,
    view: View,
) {
    key(tabId) {
        AndroidView(
            factory = { view },
            modifier = Modifier.fillMaxSize(),
        )
    }
}

private suspend fun handleBridgeMessage(
    message: String,
    account: AccountEntity,
    domain: AppDomain,
    auth: MobileAuthCoordinator,
    accounts: SecureAccountRepository,
    diagnostics: DiagnosticLogger,
    host: WebViewHost,
    onAccessTokenRefreshed: (String) -> Unit,
    onAuthFailure: (Throwable) -> Unit,
    onThemeChanged: (String, Color, Color) -> Unit,
) {
    val json = runCatching { JSONObject(message) }.getOrNull() ?: return
    when (json.optString("type")) {
        "authExpired" -> {
            runCatching { auth.refresh(account.id, domain) }
                .onSuccess(onAccessTokenRefreshed)
                .onFailure {
                    diagnostics.record(DiagnosticEvent.AUTH_REFRESH_FAILED)
                    host.dispatchAuthRefreshFailed()
                    onAuthFailure(it)
                }
        }

        "themeChanged" -> {
            val payload = json.optJSONObject("payload")
            val themeName = payload?.optString("name").orEmpty()
            val primaryColor = parseCssColor(payload?.optString("primaryColor").orEmpty())
            val backgroundColor = parseCssColor(payload?.optString("backgroundColor").orEmpty())
            if (themeName in APP_THEME_NAMES) {
                accounts.updateCachedTheme(account.id, themeName)
                val defaults = defaultNativeThemePalette(themeName)
                onThemeChanged(
                    themeName,
                    primaryColor ?: defaults.primaryColor,
                    backgroundColor ?: defaults.backgroundColor,
                )
            }
        }
    }
}

private val APP_THEME_NAMES = setOf("light", "sfw", "dark", "green", "blue")
