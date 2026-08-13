package com.cpttmm.app.ui

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.view.View
import android.view.accessibility.AccessibilityManager
import android.webkit.WebChromeClient
import android.widget.Toast
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.imeAnimationTarget
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.ScaffoldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
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
import com.cpttmm.app.webview.WebBridgeMessage
import com.cpttmm.app.webview.WebAuthScript
import com.cpttmm.app.webview.WebFindResult
import com.cpttmm.app.webview.WebViewPool
import com.cpttmm.app.webview.WebHitTarget
import com.cpttmm.app.webview.WebImageSaveResult
import com.cpttmm.app.webview.PendingWebFileChooser
import com.cpttmm.app.webview.WebFileChooserRoute
import com.cpttmm.app.webview.webFileChooserRoute
import kotlinx.coroutines.launch
import org.json.JSONObject

private enum class WorkspaceBottomMode {
    COLLAPSED,
    TOOLS,
    FIND,
}

@Composable
internal fun ForumWorkspace(
    account: AccountEntity,
    accountList: List<AccountEntity>,
    domain: AppDomain,
    tabList: List<BrowserTabEntity>,
    activeTab: BrowserTabEntity,
    auth: MobileAuthCoordinator,
    accounts: SecureAccountRepository,
    tabs: BrowserTabRepository,
    preferences: GlobalPreferencesRepository,
    diagnostics: DiagnosticLogger,
    foregroundGeneration: Int,
    onWebViewHostChanged: (WebViewHost?) -> Unit,
    onWebViewPoolChanged: (WebViewPool<WebViewHost>?) -> Unit,
    onSelectTab: (BrowserTabEntity?) -> Unit,
    onAddAccount: () -> Unit,
    onRemoveAccount: (AccountEntity) -> Unit,
    onSessionExpired: (AccountEntity) -> Unit,
    onThemeChanged: (String, Color, Color) -> Unit,
) {
    var accessToken by remember(account.id, domain) { mutableStateOf<String?>(null) }
    var error by remember(account.id, domain) { mutableStateOf<String?>(null) }
    var retryGeneration by remember(account.id, domain) { mutableStateOf(0) }

    LaunchedEffect(account.id, domain, retryGeneration) {
        accessToken = null
        error = null
        runCatching { auth.accessTokenForWebView(account, domain) }
            .onSuccess { accessToken = it }
            .onFailure {
                if (it is MobileSessionUnavailableException) onSessionExpired(account)
                else error = accountErrorMessage(it)
            }
    }

    ActiveForumWorkspace(
        account = account,
        accountList = accountList,
        domain = domain,
        accessToken = accessToken,
        loadingError = error,
        onRetry = { retryGeneration += 1 },
        tabs = tabList,
        activeTab = activeTab,
        tabRepository = tabs,
        auth = auth,
        accounts = accounts,
        preferences = preferences,
        diagnostics = diagnostics,
        foregroundGeneration = foregroundGeneration,
        onWebViewHostChanged = onWebViewHostChanged,
        onWebViewPoolChanged = onWebViewPoolChanged,
        onAddAccount = onAddAccount,
        onRemoveAccount = onRemoveAccount,
        onSessionExpired = onSessionExpired,
        onThemeChanged = onThemeChanged,
        onSelectTab = onSelectTab,
        onError = {
            if (it is MobileSessionUnavailableException) onSessionExpired(account)
            else error = accountErrorMessage(it)
        },
    )
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ActiveForumWorkspace(
    account: AccountEntity,
    accountList: List<AccountEntity>,
    domain: AppDomain,
    accessToken: String?,
    loadingError: String?,
    onRetry: () -> Unit,
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
    onAddAccount: () -> Unit,
    onRemoveAccount: (AccountEntity) -> Unit,
    onSessionExpired: (AccountEntity) -> Unit,
    onThemeChanged: (String, Color, Color) -> Unit,
    onSelectTab: (BrowserTabEntity?) -> Unit,
    onError: (Throwable) -> Unit,
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val pendingFileChooser = remember { PendingWebFileChooser<Array<Uri>>() }
    val photoPickerLauncher =
        rememberLauncherForActivityResult(
            ActivityResultContracts.PickVisualMedia(),
        ) { uri ->
            pendingFileChooser.complete(uri?.let { arrayOf(it) })
        }
    val fileChooserLauncher =
        rememberLauncherForActivityResult(
            ActivityResultContracts.StartActivityForResult(),
        ) { result ->
            pendingFileChooser.complete(
                WebChromeClient.FileChooserParams.parseResult(result.resultCode, result.data),
            )
        }
    var showTabs by remember { mutableStateOf(false) }
    var showAccountSwitcher by remember { mutableStateOf(false) }
    var showSettings by remember { mutableStateOf(false) }
    var tabError by remember { mutableStateOf<String?>(null) }
    var toolsError by remember { mutableStateOf<String?>(null) }
    var settingsError by remember { mutableStateOf<String?>(null) }
    var currentOlo by remember(account.id) { mutableStateOf(0L) }
    var pendingLongPressTarget by remember { mutableStateOf<WebHitTarget?>(null) }
    var currentAccessToken by remember(account.id, domain) { mutableStateOf(accessToken) }
    var bottomBarVisible by remember(account.id, domain, activeTab.id) { mutableStateOf(true) }
    var bottomMode by remember(account.id, domain, activeTab.id) {
        mutableStateOf(WorkspaceBottomMode.COLLAPSED)
    }
    var findQuery by remember(account.id, domain, activeTab.id) { mutableStateOf("") }
    var findResult by remember(account.id, domain, activeTab.id) {
        mutableStateOf(WebFindResult(0, 0, true))
    }
    val density = LocalDensity.current
    val toolsPanelMaxHeight = LocalConfiguration.current.screenHeightDp.dp * 0.5f
    val bottomBarScrollBehavior =
        remember(account.id, domain, activeTab.id, density) {
            BottomBarScrollBehavior(
                hideThresholdPx = with(density) { 24.dp.roundToPx() },
                showThresholdPx = with(density) { 12.dp.roundToPx() },
            )
        }
    val touchExplorationEnabled = rememberTouchExplorationEnabled()
    val resetBottomBarForNavigation by rememberUpdatedState {
        bottomBarScrollBehavior.reset()
        bottomBarVisible = true
    }
    val pageErrors = remember(domain) { mutableStateMapOf<String, String?>() }
    val webViewPool = remember(domain) { WebViewPool<WebViewHost>() }

    LaunchedEffect(tabs) {
        webViewPool.retainTabs(tabs.mapTo(mutableSetOf()) { it.id })
    }
    DisposableEffect(webViewPool) {
        onWebViewPoolChanged(webViewPool)
        onDispose {
            pendingFileChooser.clear()
            onWebViewPoolChanged(null)
            webViewPool.destroyAll()
        }
    }

    if (accessToken == null) {
        WorkspaceMessage(
            title = if (loadingError == null) "锅底准备中···" else "小火锅暂时无法打开",
            message = loadingError ?: "正在检查登录状态，请稍候。",
            actionLabel = if (loadingError == null) null else "重试",
            onAction = onRetry,
            onSelectAccount = { onSelectTab(null) },
        )
        return
    }

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
            webViewPool.getOrCreate(activeTab.id, account.id) {
                lateinit var createdHost: WebViewHost
                createdHost =
                    WebViewHost(
                        context = context,
                        account = account,
                        accessToken = currentAccessToken ?: accessToken,
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
                                    preferences = preferences,
                                    diagnostics = diagnostics,
                                    host = createdHost,
                                    onAccessTokenRefreshed = { refreshedToken ->
                                        currentAccessToken = refreshedToken
                                        webViewPool.updateAccessToken(account.id, refreshedToken)
                                    },
                                    onAuthFailure = onError,
                                    onThemeChanged = onThemeChanged,
                                    onOloChanged = { currentOlo = it },
                                )
                            }
                        },
                        onSaveState = { state -> scope.launch { tabRepository.save(activeTab, state) } },
                        onPathChanged = { path ->
                            resetBottomBarForNavigation()
                            bottomMode = WorkspaceBottomMode.COLLAPSED
                            findQuery = ""
                            findResult = WebFindResult(0, 0, true)
                            scope.launch { tabRepository.updatePath(activeTab, path) }
                        },
                        onTitleChanged = { title ->
                            scope.launch { tabRepository.updateTitle(activeTab, title) }
                        },
                        onOpenNewTab = ::openInNewTab,
                        onLongPressTarget = { pendingLongPressTarget = it },
                        onMainFrameError = {
                            pageErrors[activeTab.id] = it
                            if (it != null) diagnostics.record(DiagnosticEvent.WEBVIEW_MAIN_FRAME_ERROR)
                        },
                        onShowFileChooser = { callback, parameters ->
                            pendingFileChooser.replace(callback::onReceiveValue)
                            val route =
                                webFileChooserRoute(
                                    acceptTypes = parameters.acceptTypes,
                                    isSingleOpenRequest = parameters.mode == WebChromeClient.FileChooserParams.MODE_OPEN,
                                )
                            runCatching {
                                when (route) {
                                    WebFileChooserRoute.PHOTO_PICKER ->
                                        photoPickerLauncher.launch(
                                            PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly),
                                        )
                                    WebFileChooserRoute.GENERIC_CHOOSER ->
                                        fileChooserLauncher.launch(parameters.createIntent())
                                }
                            }
                                .onFailure {
                                    pendingFileChooser.clear()
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

    LaunchedEffect(account.id, accessToken) {
        currentAccessToken = accessToken
        webViewPool.updateAccessToken(account.id, accessToken)
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
            webViewPool.updateAccessToken(account.id, refreshedToken)
            webViewPool.activate(activeTab.id, tabs.associate { it.id to it.lastUsedAtMillis })
        }.onFailure {
            if (it is MobileSessionUnavailableException) onSessionExpired(account)
            else onError(it)
        }
    }
    DisposableEffect(host) {
        onWebViewHostChanged(host)
        host.setOnFindResultListener { findResult = it }
        onDispose {
            host.setOnFindResultListener(null)
            onWebViewHostChanged(null)
            host.pause()
        }
    }
    DisposableEffect(host, bottomBarScrollBehavior, touchExplorationEnabled) {
        host.setOnVerticalScrollChangedListener { scrollY, oldScrollY, userInitiated ->
            if (touchExplorationEnabled) return@setOnVerticalScrollChangedListener
            when (
                bottomBarScrollBehavior.onScroll(
                    scrollY = scrollY,
                    oldScrollY = oldScrollY,
                    userInitiated = userInitiated,
                    bottomBarVisible = bottomBarVisible,
                )
            ) {
                BottomBarVisibilityChange.SHOW -> bottomBarVisible = true
                BottomBarVisibilityChange.HIDE -> bottomBarVisible = false
                null -> Unit
            }
        }
        onDispose { host.setOnVerticalScrollChangedListener(null) }
    }
    LaunchedEffect(touchExplorationEnabled) {
        if (touchExplorationEnabled) resetBottomBarForNavigation()
    }

    if (showSettings) {
        BackHandler { showSettings = false }
        AppSettingsScreen(
            domain = domain,
            error = settingsError,
            onBack = { showSettings = false },
            onDomainChange = { selected ->
                if (selected != domain) {
                    settingsError = null
                    scope.launch {
                        runCatching { auth.accessTokenForWebView(account, selected) }
                            .onSuccess { preferences.setDomain(selected) }
                            .onFailure {
                                if (it is MobileSessionUnavailableException) {
                                    onSessionExpired(account)
                                } else {
                                    settingsError = accountErrorMessage(it)
                                }
                            }
                    }
                }
            },
            onClearWebCache = {
                pageErrors[activeTab.id] = null
                host.clearResourceCacheAndReload()
                Toast.makeText(context, "网页缓存已清理。", Toast.LENGTH_SHORT).show()
            },
        )
        return
    }

    BackHandler {
        when {
            showTabs -> showTabs = false
            showAccountSwitcher -> showAccountSwitcher = false
            bottomMode == WorkspaceBottomMode.FIND -> {
                host.clearFindMatches()
                findQuery = ""
                bottomMode = WorkspaceBottomMode.TOOLS
            }
            bottomMode == WorkspaceBottomMode.TOOLS -> bottomMode = WorkspaceBottomMode.COLLAPSED
            !host.goBack() -> (context as? Activity)?.moveTaskToBack(true)
        }
    }

    fun withCurrentPage(action: (String) -> Unit) {
        val url = host.currentUrl()
        if (url == null) {
            Toast.makeText(context, "当前页面尚未加载完成。", Toast.LENGTH_SHORT).show()
        } else {
            action(url)
            bottomMode = WorkspaceBottomMode.COLLAPSED
        }
    }

    val shouldShowBottomBarForIme =
        bottomMode == WorkspaceBottomMode.FIND ||
            WindowInsets.imeAnimationTarget.getBottom(density) == 0
    Scaffold(
        contentWindowInsets =
            ScaffoldDefaults.contentWindowInsets.only(
                WindowInsetsSides.Horizontal + WindowInsetsSides.Top,
            ),
        bottomBar = {
            if (shouldShowBottomBarForIme) {
                AnimatedVisibility(
                    visible =
                        bottomMode != WorkspaceBottomMode.COLLAPSED ||
                            bottomBarVisible ||
                            touchExplorationEnabled,
                    enter =
                        expandVertically(
                            animationSpec = tween(durationMillis = 220),
                            expandFrom = Alignment.Bottom,
                        ),
                    exit =
                        shrinkVertically(
                            animationSpec = tween(durationMillis = 180),
                            shrinkTowards = Alignment.Bottom,
                        ),
                ) {
                    Column(
                        modifier =
                            Modifier
                                .fillMaxWidth()
                                .shadow(2.dp)
                                .background(MaterialTheme.colorScheme.surface)
                                .navigationBarsPadding()
                                .then(
                                    if (bottomMode == WorkspaceBottomMode.FIND) {
                                        Modifier.imePadding()
                                    } else {
                                        Modifier
                                    },
                                ),
                    ) {
                        if (bottomMode == WorkspaceBottomMode.TOOLS) {
                            WorkspaceToolsPanel(
                                currentBinggan = account.binggan,
                                currentOlo = currentOlo,
                                domain = domain,
                                auth = auth,
                                error = toolsError,
                                onSelectAccount = {
                                    bottomMode = WorkspaceBottomMode.COLLAPSED
                                    showAccountSwitcher = true
                                },
                                modifier = Modifier.heightIn(max = toolsPanelMaxHeight),
                            )
                            PageActionsRow(
                                onFind = { bottomMode = WorkspaceBottomMode.FIND },
                                onShare = {
                                    withCurrentPage { url ->
                                        val text = listOf(host.currentTitle(), url)
                                            .filter(String::isNotBlank)
                                            .joinToString("\n")
                                        val intent = Intent(Intent.ACTION_SEND).apply {
                                            type = "text/plain"
                                            putExtra(Intent.EXTRA_TEXT, text)
                                        }
                                        runCatching {
                                            context.startActivity(Intent.createChooser(intent, "分享页面"))
                                        }.onFailure {
                                            Toast.makeText(context, "没有可用的分享应用。", Toast.LENGTH_SHORT).show()
                                        }
                                    }
                                },
                                onOpenExternal = {
                                    withCurrentPage { url ->
                                        runCatching {
                                            context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                                        }.onFailure {
                                            Toast.makeText(context, "没有可用的浏览器。", Toast.LENGTH_SHORT).show()
                                        }
                                    }
                                },
                                onSettings = {
                                    bottomMode = WorkspaceBottomMode.COLLAPSED
                                    showSettings = true
                                },
                            )
                        }
                        if (bottomMode == WorkspaceBottomMode.FIND) {
                            FindInPageBar(
                                query = findQuery,
                                result = findResult,
                                onQueryChange = {
                                    findQuery = it
                                    findResult = WebFindResult(0, 0, it.isBlank())
                                    host.findAll(it)
                                },
                                onPrevious = { host.findNext(false) },
                                onNext = { host.findNext(true) },
                                onClose = {
                                    host.clearFindMatches()
                                    findQuery = ""
                                    bottomMode = WorkspaceBottomMode.COLLAPSED
                                },
                            )
                        } else {
                            WorkspaceNavigationRow(
                                accountAlias = account.alias,
                                tabCount = tabs.size,
                                onBack = { host.goBack() },
                                onForward = { host.goForward() },
                                onReload = { host.reload() },
                                onTabs = { showTabs = true },
                                onTools = {
                                    bottomMode =
                                        if (bottomMode == WorkspaceBottomMode.TOOLS) {
                                            WorkspaceBottomMode.COLLAPSED
                                        } else {
                                            WorkspaceBottomMode.TOOLS
                                        }
                                },
                            )
                        }
                    }
                }
            }
        },
    ) { padding ->
        Box(Modifier.fillMaxSize().padding(padding)) {
            ActiveTabView(
                tabId = activeTab.id,
                view = host.view,
                applyImePadding = bottomMode != WorkspaceBottomMode.FIND,
            )
            if (bottomMode == WorkspaceBottomMode.TOOLS) {
                Box(
                    Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.22f))
                        .clickable { bottomMode = WorkspaceBottomMode.COLLAPSED }
                        .semantics { contentDescription = "关闭页面工具" },
                )
            }
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
                                    if (it is MobileSessionUnavailableException) onSessionExpired(account)
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
            accountAliases = accountList.associate { it.id to it.alias },
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
                    if (tab.id == activeTab.id) {
                        onSelectTab(next ?: tabRepository.ensureForAccount(account.id))
                    }
                }
            },
            onDismiss = { showTabs = false },
        )
    }
    if (showAccountSwitcher) {
        AccountSwitcherSheet(
            accounts = accountList,
            activeAccount = account,
            onSelect = { selected ->
                if (selected.id == account.id) {
                    showAccountSwitcher = false
                } else {
                    val path = host.restorableState()?.path ?: activeTab.path
                    webViewPool.remove(activeTab.id, saveState = false)
                    scope.launch {
                        runCatching {
                            tabRepository.switchAccount(activeTab, selected.id, path)
                        }.onSuccess {
                            onSelectTab(it)
                            showAccountSwitcher = false
                        }.onFailure {
                            toolsError = it.message
                        }
                    }
                }
            },
            onAdd = {
                showAccountSwitcher = false
                onAddAccount()
            },
            onRemove = {
                showAccountSwitcher = false
                onRemoveAccount(it)
            },
            onAliasChange = { selected, alias ->
                scope.launch { accounts.updateAlias(selected.id, alias) }
            },
            onDismiss = { showAccountSwitcher = false },
        )
    }
    pendingLongPressTarget?.let { target ->
        AlertDialog(
            onDismissRequest = { pendingLongPressTarget = null },
            title = { Text(if (target.imageUrl != null) "图片操作" else "链接操作") },
            text = {
                Text(
                    when {
                        target.imageUrl != null && target.linkUrl != null ->
                            "可以保存图片，或在新标签中打开图片指向的链接。"
                        target.imageUrl != null -> "要将这张图片保存到下载目录吗？"
                        else -> "要在新标签中打开这个链接吗？"
                    },
                )
            },
            confirmButton = {
                Column(horizontalAlignment = Alignment.End) {
                    target.imageUrl?.let { imageUrl ->
                        TextButton(onClick = {
                            pendingLongPressTarget = null
                            when (host.saveImage(imageUrl)) {
                                WebImageSaveResult.STARTED ->
                                    Toast.makeText(context, "图片已开始下载。", Toast.LENGTH_SHORT).show()
                                WebImageSaveResult.UNSUPPORTED ->
                                    Toast.makeText(
                                        context,
                                        "暂不支持保存此类图片地址。",
                                        Toast.LENGTH_SHORT,
                                    ).show()
                                WebImageSaveResult.FAILED -> Unit
                            }
                        }) { Text("保存图片") }
                    }
                    target.linkUrl?.let { linkUrl ->
                        TextButton(onClick = {
                            pendingLongPressTarget = null
                            openInNewTab(linkUrl)
                        }) { Text("在新标签打开") }
                    }
                }
            },
            dismissButton = {
                TextButton(onClick = { pendingLongPressTarget = null }) { Text("取消") }
            },
        )
    }
}

@Composable
private fun WorkspaceNavigationRow(
    accountAlias: String,
    tabCount: Int,
    onBack: () -> Unit,
    onForward: () -> Unit,
    onReload: () -> Unit,
    onTabs: () -> Unit,
    onTools: () -> Unit,
) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(start = 10.dp, top = 4.dp, end = 10.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        NavigationIconButton("后退", R.drawable.chevron_left, onBack)
        NavigationIconButton("前进", R.drawable.chevron_right, onForward)
        NavigationIconButton("刷新当前页面", R.drawable.refresh, onReload)
        Surface(
            onClick = onTabs,
            modifier =
                Modifier.size(width = 48.dp, height = 40.dp).semantics {
                    contentDescription = "标签，共 $tabCount 个"
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
                        tabCount.toString(),
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Medium,
                    )
                }
            }
        }
        Surface(
            onClick = onTools,
            modifier =
                Modifier.weight(1f).height(40.dp).semantics {
                    contentDescription = "当前饼干别名 $accountAlias，打开页面工具和设置"
                },
            shape = RoundedCornerShape(13.dp),
            color = Color.Transparent,
            contentColor = MaterialTheme.colorScheme.onSurface,
        ) {
            Box(
                modifier = Modifier.padding(horizontal = 14.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(accountAlias, maxLines = 1, fontWeight = FontWeight.Medium)
            }
        }
    }
}

@Composable
private fun NavigationIconButton(
    description: String,
    icon: Int,
    onClick: () -> Unit,
    enabled: Boolean = true,
) {
    Surface(
        onClick = onClick,
        enabled = enabled,
        modifier =
            Modifier
                .size(width = 48.dp, height = 40.dp)
                .semantics { contentDescription = description },
        shape = RoundedCornerShape(11.dp),
        color = Color.Transparent,
        contentColor = MaterialTheme.colorScheme.onSurface,
    ) {
        Box(contentAlignment = Alignment.Center) {
            Icon(
                painter = painterResource(icon),
                contentDescription = null,
                modifier = Modifier.size(24.dp),
            )
        }
    }
}

@Composable
private fun PageActionsRow(
    onFind: () -> Unit,
    onShare: () -> Unit,
    onOpenExternal: () -> Unit,
    onSettings: () -> Unit,
) {
    Row(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(horizontal = 10.dp, vertical = 4.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        PageActionButton("页内查找", R.drawable.search, onFind)
        PageActionButton("分享", R.drawable.share, onShare)
        PageActionButton("浏览器打开", R.drawable.open_external, onOpenExternal)
        PageActionButton("设置", R.drawable.settings, onSettings)
    }
}

@Composable
private fun RowScope.PageActionButton(
    label: String,
    icon: Int,
    onClick: () -> Unit,
) {
    Surface(
        onClick = onClick,
        modifier = Modifier.weight(1f).height(52.dp).semantics { contentDescription = label },
        shape = RoundedCornerShape(11.dp),
        color = Color.Transparent,
        contentColor = MaterialTheme.colorScheme.onSurface,
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Icon(painterResource(icon), contentDescription = null, modifier = Modifier.size(22.dp))
            Text(label, maxLines = 1, style = MaterialTheme.typography.labelSmall)
        }
    }
}

@Composable
private fun FindInPageBar(
    query: String,
    result: WebFindResult,
    onQueryChange: (String) -> Unit,
    onPrevious: () -> Unit,
    onNext: () -> Unit,
    onClose: () -> Unit,
) {
    val focusRequester = remember { FocusRequester() }
    val keyboard = LocalSoftwareKeyboardController.current
    val inputState = rememberTextFieldState(query)
    LaunchedEffect(inputState.text) {
        val currentQuery = inputState.text.toString()
        if (currentQuery != query) onQueryChange(currentQuery)
    }
    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
        keyboard?.show()
    }
    Row(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 2.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        OutlinedTextField(
            state = inputState,
            modifier = Modifier.weight(1f).height(48.dp).focusRequester(focusRequester),
            placeholder = { Text("在页面中查找") },
            textStyle = MaterialTheme.typography.bodyLarge,
            lineLimits = TextFieldLineLimits.SingleLine,
            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
        )
        Text(
            if (!result.isDoneCounting) {
                "…"
            } else if (result.matchCount == 0) {
                "0/0"
            } else {
                "${result.activeMatchOrdinal + 1}/${result.matchCount}"
            },
            style = MaterialTheme.typography.bodyLarge,
        )
        val canNavigate = query.isNotBlank() && result.matchCount > 0
        NavigationIconButton(
            "上一个匹配项",
            R.drawable.chevron_left,
            enabled = canNavigate,
            onClick = onPrevious,
        )
        NavigationIconButton(
            "下一个匹配项",
            R.drawable.chevron_right,
            enabled = canNavigate,
            onClick = onNext,
        )
        TextButton(onClick = {
            keyboard?.hide()
            onClose()
        }) { Text("关闭") }
    }
}

@Composable
private fun rememberTouchExplorationEnabled(): Boolean {
    val context = LocalContext.current
    val accessibilityManager =
        remember(context) { context.getSystemService(AccessibilityManager::class.java) }
    var enabled by remember(accessibilityManager) {
        mutableStateOf(accessibilityManager.isTouchExplorationEnabled)
    }

    DisposableEffect(accessibilityManager) {
        val listener = AccessibilityManager.TouchExplorationStateChangeListener { enabled = it }
        accessibilityManager.addTouchExplorationStateChangeListener(listener)
        onDispose {
            accessibilityManager.removeTouchExplorationStateChangeListener(listener)
        }
    }
    return enabled
}

@Composable
internal fun ActiveTabView(
    tabId: String,
    view: View,
    applyImePadding: Boolean = true,
) {
    key(tabId) {
        AndroidView(
            factory = { view },
            modifier =
                Modifier
                    .fillMaxSize()
                    .then(if (applyImePadding) Modifier.imePadding() else Modifier),
        )
    }
}

private suspend fun handleBridgeMessage(
    message: WebBridgeMessage,
    account: AccountEntity,
    domain: AppDomain,
    auth: MobileAuthCoordinator,
    accounts: SecureAccountRepository,
    preferences: GlobalPreferencesRepository,
    diagnostics: DiagnosticLogger,
    host: WebViewHost,
    onAccessTokenRefreshed: (String) -> Unit,
    onAuthFailure: (Throwable) -> Unit,
    onThemeChanged: (String, Color, Color) -> Unit,
    onOloChanged: (Long) -> Unit,
) {
    val json = runCatching { JSONObject(message.data) }.getOrNull() ?: return
    when (json.optString("type")) {
        "authBootstrapRequested" -> {
            val pendingNamespaces = preferences.pendingStorageNamespaces(message.sourceOrigin)
            message.reply(
                WebAuthScript.bootstrapMessage(
                    storageNamespace = account.storageNamespace,
                    binggan = account.binggan,
                    accessToken = host.accessToken(),
                    pendingStorageNamespaces = pendingNamespaces,
                ),
            )
        }

        "storageCleanupCompleted" -> {
            val namespacesJson = json.optJSONObject("payload")
                ?.optJSONArray("storageNamespaces") ?: return
            val namespaces = buildSet {
                for (index in 0 until namespacesJson.length()) {
                    namespacesJson.optString(index).takeIf(String::isNotBlank)?.let(::add)
                }
            }
            preferences.completeStorageCleanup(message.sourceOrigin, namespaces)
        }

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

        "oloChanged" -> {
            val amount = json.optJSONObject("payload")?.optLong("amount", -1L) ?: -1L
            if (amount >= 0L) onOloChanged(amount)
        }
    }
}

private val APP_THEME_NAMES = setOf("light", "sfw", "dark", "green", "blue")
