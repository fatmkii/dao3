package com.cpttmm.app.ui

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.view.View
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.widget.Toast
import com.cpttmm.app.BuildConfig
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.cpttmm.app.R
import com.cpttmm.app.account.AccountLimitException
import com.cpttmm.app.account.BrowserTabRepository
import com.cpttmm.app.account.MobileAuthCoordinator
import com.cpttmm.app.account.PendingRevocationWorker
import com.cpttmm.app.account.SecureAccountRepository
import com.cpttmm.app.account.SsaidUnavailableException
import com.cpttmm.app.data.local.AccountEntity
import com.cpttmm.app.data.local.BrowserTabEntity
import com.cpttmm.app.diagnostics.DiagnosticEvent
import com.cpttmm.app.diagnostics.DiagnosticLogger
import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.navigation.DomainPolicy
import com.cpttmm.app.navigation.NavigationTarget
import com.cpttmm.app.network.MobileApiException
import com.cpttmm.app.network.MobileReleaseInfo
import com.cpttmm.app.network.RegistrationStatus
import com.cpttmm.app.preferences.GlobalPreferencesRepository
import com.cpttmm.app.webview.WebViewCapability
import com.cpttmm.app.webview.WebViewHost
import com.cpttmm.app.webview.WebViewPool
import com.cpttmm.app.webview.WebProfileCleaner
import com.cpttmm.app.session.RefreshPolicy
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.io.IOException
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

private val HotpotRed = Color(0xFF9D3529)
private val DeepBroth = Color(0xFF351C18)
private val Biscuit = Color(0xFFF2D3A2)
private val WarmCanvas = Color(0xFFFFF8EF)
private val WarmSurface = Color(0xFFFFFCF7)

private data class NativeThemePalette(
    val name: String?,
    val primaryColor: Color,
    val backgroundColor: Color,
)

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
                onThemeChanged = { name, primaryColor, backgroundColor ->
                    nativeTheme = NativeThemePalette(name, primaryColor, backgroundColor)
                },
            )
        }

        if (showAccountSheet) {
            AddAccountSheet(
                domain = domain,
                accountLimitReached = accountList.size >= 5,
                onDomainChange = { selected -> scope.launch { preferences.setDomain(selected) } },
                onDismiss = { showAccountSheet = false },
                onLogin = { binggan, password -> auth.login(binggan, password) },
                onRegister = { auth.register() },
                loadRegistrationStatus = { auth.registrationStatus(domain) },
                onCompleted = { showAccountSheet = false },
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AccountSwitcherSheet(
    accounts: List<AccountEntity>,
    activeAccount: AccountEntity,
    onSelect: (AccountEntity) -> Unit,
    onAdd: () -> Unit,
    onRemove: (AccountEntity) -> Unit,
    onDismiss: () -> Unit,
) {
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp).padding(bottom = 20.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Text("切换账号", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.SemiBold)
            accounts.forEach { account ->
                Card(
                    onClick = { onSelect(account) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = if (account.id == activeAccount.id) {
                            MaterialTheme.colorScheme.background
                        } else {
                            MaterialTheme.colorScheme.surface
                        },
                    ),
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(start = 16.dp, end = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(account.binggan, modifier = Modifier.weight(1f).padding(vertical = 16.dp))
                        TextButton(onClick = { onRemove(account) }) { Text("移除") }
                    }
                }
            }
            Button(
                onClick = onAdd,
                enabled = accounts.size < 5,
                modifier = Modifier.fillMaxWidth().height(52.dp),
            ) { Text(if (accounts.size < 5) "添加账号" else "已达到 5 个账号上限") }
        }
    }
}

@Composable
private fun CpttmmTheme(theme: NativeThemePalette, content: @Composable () -> Unit) {
    val baseColors = when (theme.name) {
        "dark" -> androidx.compose.material3.darkColorScheme(
            primary = Color(0xFF77D477),
            background = Color(0xFF101014),
            surface = Color(0xFF2C2C32),
        )
        "blue" -> androidx.compose.material3.lightColorScheme(
            primary = Color(0xFF4D7DD9),
            background = Color(0xFFF2F5FF),
            surface = Color(0xFFF5F7FF),
        )
        "green" -> androidx.compose.material3.lightColorScheme(
            primary = Color(0xFF3A9958),
            background = Color(0xFFEEFAEE),
            surface = Color(0xFFFAFFFA),
        )
        "sfw" -> androidx.compose.material3.lightColorScheme(
            primary = Color(0xFF333639),
            background = Color(0xFFF5F6F8),
            surface = Color.White,
        )
        "light" -> androidx.compose.material3.lightColorScheme(
            primary = Color(0xFF32A852),
            background = Color(0xFFF9F9F9),
            surface = Color.White,
        )
        else -> androidx.compose.material3.lightColorScheme(
            primary = HotpotRed,
            onPrimary = Color.White,
            secondary = Color(0xFF76552F),
            onSecondary = Color.White,
            background = WarmCanvas,
            onBackground = DeepBroth,
            surface = WarmSurface,
            onSurface = DeepBroth,
            error = Color(0xFFB3261E),
        )
    }
    val buttonTextColor = contrastingTextColor(theme.primaryColor)
    val colors = baseColors.copy(
        primary = theme.primaryColor,
        onPrimary = buttonTextColor,
        secondaryContainer = theme.primaryColor,
        onSecondaryContainer = buttonTextColor,
        surface = theme.backgroundColor,
    )
    MaterialTheme(colorScheme = colors, content = content)
}

private fun defaultNativeThemePalette(themeName: String?): NativeThemePalette = when (themeName) {
    "light" -> NativeThemePalette(themeName, Color(0xFF90D590), Color.White)
    "sfw" -> NativeThemePalette(themeName, Color(0xFFAAAAAA), Color.White)
    "dark" -> NativeThemePalette(themeName, Color(0xFF316C58), Color(0xFF18181C))
    "green" -> NativeThemePalette(themeName, Color(0xFF52B051), Color(0xFFFAFFFA))
    "blue" -> NativeThemePalette(themeName, Color(0xFF6495ED), Color(0xFFF5F7FF))
    else -> NativeThemePalette("green", Color(0xFF52B051), Color(0xFFFAFFFA))
}

private fun contrastingTextColor(background: Color): Color =
    if (background.luminance() > 0.5f) DeepBroth else Color.White

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AccountHome(
    accounts: List<AccountEntity>,
    onAddAccount: () -> Unit,
    onSelectAccount: (AccountEntity) -> Unit,
    onRemoveAccount: (AccountEntity) -> Unit,
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("小火锅", fontWeight = FontWeight.SemiBold)
                        Text(
                            "Android",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface,
                ),
            )
        },
    ) { padding ->
        if (accounts.isEmpty()) {
            EmptyAccountScreen(
                modifier = Modifier.padding(padding),
                onAddAccount = onAddAccount,
            )
        } else {
            AccountList(
                accounts = accounts,
                modifier = Modifier.padding(padding),
                onAddAccount = onAddAccount,
                onSelectAccount = onSelectAccount,
                onRemoveAccount = onRemoveAccount,
            )
        }
    }
}

@Composable
private fun EmptyAccountScreen(modifier: Modifier, onAddAccount: () -> Unit) {
    Box(
        modifier = modifier.fillMaxSize().padding(horizontal = 28.dp),
        contentAlignment = Alignment.Center,
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Surface(
                modifier = Modifier.size(112.dp),
                shape = RoundedCornerShape(32.dp),
                color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
            ) {
                Image(
                    painter = painterResource(R.drawable.ic_launcher),
                    contentDescription = "小火锅应用图标",
                    modifier = Modifier.padding(24.dp),
                )
            }
            Text(
                "把你的饼干装进口袋",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.SemiBold,
            )
            Text(
                "登录已有饼干，或在开放日从这台设备领取新的饼干。",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Button(onClick = onAddAccount, modifier = Modifier.fillMaxWidth().height(52.dp)) {
                Text("添加账号")
            }
            Text(
                "最多保存 5 个账号",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

@Composable
private fun AccountList(
    accounts: List<AccountEntity>,
    modifier: Modifier,
    onAddAccount: () -> Unit,
    onSelectAccount: (AccountEntity) -> Unit,
    onRemoveAccount: (AccountEntity) -> Unit,
) {
    Column(
        modifier = modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("选择账号", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.SemiBold)
        accounts.forEach { account ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                onClick = { onSelectAccount(account) },
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(start = 18.dp, end = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(
                        modifier = Modifier.weight(1f).padding(vertical = 18.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp),
                    ) {
                        Text(account.binggan, style = MaterialTheme.typography.titleMedium)
                        Text(
                            "点击进入论坛工作区",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    TextButton(
                        onClick = { onRemoveAccount(account) },
                        modifier = Modifier.height(48.dp),
                    ) { Text("移除") }
                }
            }
        }
        Button(
            onClick = onAddAccount,
            enabled = accounts.size < 5,
            modifier = Modifier.fillMaxWidth().height(52.dp),
        ) {
            Text(if (accounts.size < 5) "添加另一个账号" else "已达到 5 个账号上限")
        }
    }
}

@Composable
private fun ForumWorkspace(
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
            .onFailure { error = accountErrorMessage(it) }
    }

    when {
        error != null -> WorkspaceMessage(
            title = "论坛暂时无法打开",
            message = error.orEmpty(),
            actionLabel = "重试",
            onAction = { retryGeneration += 1 },
            onSelectAccount = onSelectAccount,
        )
        accessToken == null || tabList.isEmpty() || tabList.none { it.id == activeTabId } -> WorkspaceMessage(
            title = "正在准备工作区",
            message = "正在检查登录状态，然后再恢复网页网络活动。",
            onSelectAccount = onSelectAccount,
        )
        else -> ActiveForumWorkspace(
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
            onThemeChanged = onThemeChanged,
            onSelectTab = { activeTabId = it.id },
            onError = { error = accountErrorMessage(it) },
        )
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
    onThemeChanged: (String, Color, Color) -> Unit,
    onSelectTab: (BrowserTabEntity) -> Unit,
    onError: (Throwable) -> Unit,
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val pendingFileChooser = remember {
        mutableStateOf<ValueCallback<Array<Uri>>?>(null)
    }
    val fileChooserLauncher = rememberLauncherForActivityResult(
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
            NavigationTarget.Blocked -> Unit
            is NavigationTarget.External -> {
                context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(rawUrl)))
            }
            is NavigationTarget.Internal -> scope.launch {
                val path = buildString {
                    append(target.uri.rawPath.ifBlank { "/" })
                    target.uri.rawQuery?.let { append('?').append(it) }
                    target.uri.rawFragment?.let { append('#').append(it) }
                }
                runCatching { tabRepository.create(account.id, path) }
                    .onSuccess {
                        tabError = null
                        onSelectTab(it)
                    }
                    .onFailure {
                        tabError = it.message
                        showTabs = true
                    }
            }
        }
    }

    val host = remember(account.id, domain, activeTab.id) {
        webViewPool.getOrCreate(activeTab.id) {
            lateinit var createdHost: WebViewHost
            createdHost = WebViewHost(
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
                        }
                        .isSuccess
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
        }.onFailure(onError)
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
                    modifier = Modifier.fillMaxWidth().navigationBarsPadding()
                        .padding(horizontal = 10.dp, vertical = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Surface(
                        onClick = { host.goBack() },
                        modifier = Modifier.size(48.dp).semantics { contentDescription = "后退" },
                        shape = RoundedCornerShape(11.dp),
                        color = Color.Transparent,
                        contentColor = MaterialTheme.colorScheme.onSurface,
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                painter = painterResource(R.drawable.angle_left),
                                contentDescription = null,
                                modifier = Modifier.size(width = 12.dp, height = 24.dp),
                            )
                        }
                    }
                    Surface(
                        onClick = { host.goForward() },
                        modifier = Modifier.size(48.dp).semantics { contentDescription = "前进" },
                        shape = RoundedCornerShape(11.dp),
                        color = Color.Transparent,
                        contentColor = MaterialTheme.colorScheme.onSurface,
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                painter = painterResource(R.drawable.angle_right),
                                contentDescription = null,
                                modifier = Modifier.size(width = 12.dp, height = 24.dp),
                            )
                        }
                    }
                    Surface(
                        onClick = { showTabs = true },
                        modifier = Modifier.size(48.dp).semantics {
                            contentDescription = "标签，共 ${tabs.size} 个"
                        },
                        shape = RoundedCornerShape(11.dp),
                        color = Color.Transparent,
                        contentColor = MaterialTheme.colorScheme.onSurface,
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Box(
                                modifier = Modifier.size(width = 28.dp, height = 30.dp).border(
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
                        modifier = Modifier.weight(1f).height(48.dp).semantics {
                            contentDescription = "当前饼干 ${account.binggan}，打开设置"
                        },
                        shape = RoundedCornerShape(13.dp),
                        color = Color.Transparent,
                        contentColor = MaterialTheme.colorScheme.onSurface,
                    ) {
                        Box(
                            modifier = Modifier.padding(horizontal = 14.dp),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(account.binggan, maxLines = 1, fontWeight = FontWeight.Medium)
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
                                .onFailure { pageErrors[activeTab.id] = accountErrorMessage(it) }
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
                        }
                        .onFailure { tabError = it.message }
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
                        }
                        .onFailure { settingsError = accountErrorMessage(it) }
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
internal fun ActiveTabView(tabId: String, view: View) {
    key(tabId) {
        AndroidView(
            factory = { view },
            modifier = Modifier.fillMaxSize(),
        )
    }
}

@Composable
internal fun OfflineErrorPage(
    alternativeHost: String?,
    onRetry: () -> Unit,
    onSwitchDomain: () -> Unit,
) {
    Surface(Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
        Column(
            modifier = Modifier.fillMaxSize().padding(28.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text("网络连接中断", style = MaterialTheme.typography.headlineSmall)
            Spacer(Modifier.height(10.dp))
            Text("请检查网络后重试。", color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.height(18.dp))
            Button(onClick = onRetry) { Text("重新加载") }
            if (alternativeHost != null) {
                Spacer(Modifier.height(8.dp))
                TextButton(onClick = onSwitchDomain) { Text("切换到 $alternativeHost") }
            }
        }
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
    onAuthFailure: (Throwable) -> Unit,
    onThemeChanged: (String, Color, Color) -> Unit,
) {
    val json = runCatching { JSONObject(message) }.getOrNull() ?: return
    when (json.optString("type")) {
        "authExpired" -> runCatching {
            auth.refresh(account.id, domain)
            checkNotNull(accounts.decryptedTokens(account.id)?.accessToken)
        }.onSuccess(host::updateAccessToken)
            .onFailure {
                diagnostics.record(DiagnosticEvent.AUTH_REFRESH_FAILED)
                host.dispatchAuthRefreshFailed()
                onAuthFailure(it)
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

private fun parseCssColor(rawColor: String): Color? {
    val hex = rawColor.removePrefix("#")
    return runCatching {
        when (hex.length) {
            6 -> Color(
                red = hex.substring(0, 2).toInt(16),
                green = hex.substring(2, 4).toInt(16),
                blue = hex.substring(4, 6).toInt(16),
            )
            8 -> Color(
                red = hex.substring(0, 2).toInt(16),
                green = hex.substring(2, 4).toInt(16),
                blue = hex.substring(4, 6).toInt(16),
                alpha = hex.substring(6, 8).toInt(16),
            )
            else -> error("Unsupported CSS color")
        }
    }.getOrNull()
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun TabSheet(
    tabs: List<BrowserTabEntity>,
    activeTab: BrowserTabEntity,
    error: String?,
    onSelect: (BrowserTabEntity) -> Unit,
    onCreate: () -> Unit,
    onClose: (BrowserTabEntity) -> Unit,
    onDismiss: () -> Unit,
) {
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp).padding(bottom = 20.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Text("标签", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.SemiBold)
            tabs.forEach { tab ->
                Card(
                    onClick = { onSelect(tab) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = if (tab.id == activeTab.id) {
                            MaterialTheme.colorScheme.background
                        } else {
                            MaterialTheme.colorScheme.surface
                        },
                    ),
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(start = 16.dp, end = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Column(Modifier.weight(1f).padding(vertical = 12.dp)) {
                            Text(tab.title, maxLines = 1, fontWeight = FontWeight.Medium)
                            Text(
                                tab.path,
                                maxLines = 1,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                        TextButton(onClick = { onClose(tab) }, modifier = Modifier.height(48.dp)) {
                            Text("关闭")
                        }
                    }
                }
            }
            if (error != null) InlineMessage(error)
            Button(
                onClick = onCreate,
                enabled = tabs.size < 10,
                modifier = Modifier.fillMaxWidth().height(52.dp),
            ) {
                Text(if (tabs.size < 10) "新建标签" else "已达到 10 个标签上限")
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun SettingsSheet(
    currentBinggan: String,
    domain: AppDomain,
    auth: MobileAuthCoordinator,
    error: String?,
    onDomainChange: (AppDomain) -> Unit,
    onSelectAccount: () -> Unit,
    onDismiss: () -> Unit,
) {
    val context = LocalContext.current
    var release by remember(domain) { mutableStateOf<MobileReleaseInfo?>(null) }
    var releaseError by remember(domain) { mutableStateOf<String?>(null) }

    LaunchedEffect(domain) {
        runCatching { auth.releaseInfo(domain) }
            .onSuccess { release = it }
            .onFailure { releaseError = accountErrorMessage(it) }
    }

    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(
            modifier = Modifier.fillMaxWidth().verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp).padding(bottom = 24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            if (!BuildConfig.DEBUG) {
                Text("访问域名", style = MaterialTheme.typography.titleMedium)
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    AppDomain.entries.forEach { candidate ->
                        FilterChip(
                            selected = candidate == domain,
                            onClick = { onDomainChange(candidate) },
                            label = { Text(candidate.host) },
                        )
                    }
                }
                Text(
                    "切换前会先检查当前登录状态；应用不会自动重放失败请求。",
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    style = MaterialTheme.typography.bodySmall,
                )
            }
            if (error != null) InlineMessage(error)
            if (!BuildConfig.DEBUG) HorizontalDivider()
            Button(
                onClick = onSelectAccount,
                modifier = Modifier.fillMaxWidth().height(52.dp),
            ) { Text("切换饼干：$currentBinggan", maxLines = 1) }
            TextButton(
                onClick = {
                    context.startActivity(
                        Intent(Intent.ACTION_VIEW, Uri.parse("https://${domain.host}/privacy/android")),
                    )
                },
                modifier = Modifier.fillMaxWidth().height(48.dp),
            ) { Text("Android 隐私说明") }
            HorizontalDivider()
            Text("应用版本", style = MaterialTheme.typography.titleMedium)
            Text("当前版本 ${BuildConfig.VERSION_NAME} (${BuildConfig.VERSION_CODE})")
            when {
                release != null -> ReleaseDetails(release!!, context)
                releaseError != null -> InlineMessage(releaseError!!)
                else -> CircularProgressIndicator(Modifier.size(28.dp))
            }
        }
    }
}

@Composable
private fun ReleaseDetails(release: MobileReleaseInfo, context: android.content.Context) {
    val hasUpdate = release.versionCode > BuildConfig.VERSION_CODE
    Text(
        if (hasUpdate) "发现新版本 ${release.versionName}" else "已是最新版本",
        fontWeight = FontWeight.SemiBold,
    )
    if (release.notes.isNotBlank()) Text(release.notes)
    if (release.sha256.isNotBlank()) {
        Text("APK SHA-256\n${release.sha256}", style = MaterialTheme.typography.bodySmall)
    }
    if (hasUpdate && release.apkUrl.startsWith("https://")) {
        Button(
            onClick = { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(release.apkUrl))) },
            modifier = Modifier.fillMaxWidth().height(52.dp),
        ) { Text("从官网下载") }
    }
    if (hasUpdate && release.githubUrl.startsWith("https://")) {
        TextButton(
            onClick = { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(release.githubUrl))) },
            modifier = Modifier.fillMaxWidth().height(48.dp),
        ) { Text("打开 GitHub 镜像") }
    }
}

@Composable
private fun WorkspaceMessage(
    title: String,
    message: String,
    actionLabel: String? = null,
    onAction: () -> Unit = {},
    onSelectAccount: () -> Unit,
) {
    Box(Modifier.fillMaxSize().padding(28.dp), contentAlignment = Alignment.Center) {
        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Text(title, style = MaterialTheme.typography.headlineSmall)
            Text(message, color = MaterialTheme.colorScheme.onSurfaceVariant)
            if (actionLabel != null) {
                Button(onClick = onAction, modifier = Modifier.fillMaxWidth().height(52.dp)) {
                    Text(actionLabel)
                }
            } else {
                CircularProgressIndicator()
            }
            TextButton(onClick = onSelectAccount, modifier = Modifier.fillMaxWidth().height(48.dp)) {
                Text("返回账号列表")
            }
        }
    }
}

private enum class AccountAction {
    LOGIN,
    REGISTER,
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AddAccountSheet(
    domain: AppDomain,
    accountLimitReached: Boolean,
    onDomainChange: (AppDomain) -> Unit,
    onDismiss: () -> Unit,
    onLogin: suspend (String, String?) -> Unit,
    onRegister: suspend () -> Unit,
    loadRegistrationStatus: suspend () -> RegistrationStatus,
    onCompleted: () -> Unit,
) {
    val scope = rememberCoroutineScope()
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var action by remember { mutableStateOf(AccountAction.LOGIN) }
    var binggan by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var submitting by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var registrationStatus by remember(domain) { mutableStateOf<RegistrationStatus?>(null) }
    var registrationStatusLoading by remember(domain) { mutableStateOf(false) }
    var registrationStatusError by remember(domain) { mutableStateOf<String?>(null) }

    LaunchedEffect(action, domain) {
        if (action != AccountAction.REGISTER) return@LaunchedEffect
        registrationStatusLoading = true
        registrationStatusError = null
        runCatching { loadRegistrationStatus() }
            .onSuccess { registrationStatus = it }
            .onFailure { registrationStatusError = accountErrorMessage(it) }
        registrationStatusLoading = false
    }

    fun submit() {
        if (submitting || accountLimitReached) return
        if (action == AccountAction.REGISTER && registrationStatus?.canRegister != true) return
        if (action == AccountAction.LOGIN && binggan.isBlank()) {
            error = "请输入完整饼干后再登录。"
            return
        }
        scope.launch {
            submitting = true
            error = null
            runCatching {
                if (action == AccountAction.LOGIN) {
                    onLogin(binggan.trim(), password.ifBlank { null })
                } else {
                    onRegister()
                }
            }.onSuccess {
                onCompleted()
            }.onFailure { throwable ->
                error = accountErrorMessage(throwable)
            }
            submitting = false
        }
    }

    ModalBottomSheet(
        onDismissRequest = { if (!submitting) onDismiss() },
        sheetState = sheetState,
    ) {
        Column(
            modifier = Modifier.fillMaxWidth().fillMaxHeight(0.9f).padding(horizontal = 24.dp),
        ) {
            Text("添加账号", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(14.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                FilterChip(
                    selected = action == AccountAction.LOGIN,
                    onClick = { action = AccountAction.LOGIN; error = null },
                    label = { Text("登录已有饼干") },
                    enabled = !submitting,
                )
                FilterChip(
                    selected = action == AccountAction.REGISTER,
                    onClick = { action = AccountAction.REGISTER; error = null },
                    label = { Text("领取新饼干") },
                    enabled = !submitting,
                )
            }
            Spacer(Modifier.height(12.dp))
            Column(
                modifier = Modifier.weight(1f).verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                if (action == AccountAction.LOGIN) {
                    OutlinedTextField(
                        value = binggan,
                        onValueChange = { binggan = it; error = null },
                        label = { Text("饼干") },
                        supportingText = { Text("区分大小写，请输入完整内容") },
                        singleLine = true,
                        enabled = !submitting,
                        modifier = Modifier.fillMaxWidth(),
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                    )
                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it; error = null },
                        label = { Text("密码（如已设置）") },
                        singleLine = true,
                        enabled = !submitting,
                        modifier = Modifier.fillMaxWidth(),
                        visualTransformation = if (passwordVisible) {
                            VisualTransformation.None
                        } else {
                            PasswordVisualTransformation()
                        },
                        trailingIcon = {
                            TextButton(onClick = { passwordVisible = !passwordVisible }) {
                                Text(if (passwordVisible) "隐藏" else "显示")
                            }
                        },
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                        keyboardActions = KeyboardActions(onDone = { submit() }),
                    )
                } else {
                    Surface(
                        color = Biscuit.copy(alpha = 0.28f),
                        shape = RoundedCornerShape(18.dp),
                    ) {
                        Text(
                            "这里是私人论坛小火锅，欢迎来玩！\n" +
                                "QQ小火锅避难群：156840110\n" +
                                "使用前需要在下面领取或者导入饼干喔",
                            modifier = Modifier.padding(16.dp),
                            style = MaterialTheme.typography.bodyMedium,
                        )
                    }
                    when {
                        registrationStatusLoading -> Row(
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            CircularProgressIndicator(Modifier.size(22.dp), strokeWidth = 2.dp)
                            Text("正在检查是否可以领取…")
                        }
                        registrationStatusError != null -> InlineMessage(registrationStatusError!!)
                        registrationStatus != null -> {
                            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                registrationStatusMessages(registrationStatus!!).forEach { message ->
                                    Text(
                                        message,
                                        color = if (registrationStatus!!.canRegister) {
                                            MaterialTheme.colorScheme.primary
                                        } else {
                                            MaterialTheme.colorScheme.onSurfaceVariant
                                        },
                                    )
                                }
                            }
                        }
                    }
                }

                if (accountLimitReached) {
                    InlineMessage("已达到 5 个账号上限，请先移除一个账号。")
                } else if (error != null) {
                    InlineMessage(error!!)
                }

                if (!BuildConfig.DEBUG) {
                    HorizontalDivider()
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("访问域名", style = MaterialTheme.typography.labelLarge)
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            AppDomain.entries.forEach { candidate ->
                                FilterChip(
                                    selected = domain == candidate,
                                    onClick = { onDomainChange(candidate) },
                                    label = { Text(candidate.host) },
                                    enabled = !submitting,
                                )
                            }
                        }
                        Text(
                            "加载失败时可手动切换，应用不会自动重放请求。",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
                Spacer(Modifier.height(4.dp))
            }
            Spacer(Modifier.height(12.dp))
            Button(
                onClick = { submit() },
                enabled = !submitting && !accountLimitReached &&
                    (action == AccountAction.LOGIN || registrationStatus?.canRegister == true),
                modifier = Modifier.fillMaxWidth().height(52.dp),
            ) {
                if (submitting) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(22.dp),
                        color = MaterialTheme.colorScheme.onPrimary,
                        strokeWidth = 2.dp,
                    )
                    Spacer(Modifier.size(10.dp))
                    Text("正在连接…")
                } else {
                    Text(
                        if (action == AccountAction.LOGIN) {
                            "登录并保存"
                        } else if (registrationStatus?.canRegister == true) {
                            "领取饼干开放中！"
                        } else {
                            "领取饼干尚未开放"
                        },
                    )
                }
            }
            TextButton(
                onClick = onDismiss,
                enabled = !submitting,
                modifier = Modifier.fillMaxWidth().height(48.dp),
            ) {
                Text("取消")
            }
            Spacer(Modifier.height(12.dp))
        }
    }
}

private fun registrationStatusMessages(status: RegistrationStatus): List<String> {
    val messages = mutableListOf<String>()
    if (status.isOpen) {
        messages += "领取饼干开放中！"
    } else {
        messages += "领取饼干尚未开放"
        messages += "下次开放：${formatRegistrationTime(status.nextOpenAt, includeTime = false)}"
    }
    if (status.ipCooldownSeconds > 0) {
        messages += "下次可领取：${formatRegistrationTime(Instant.now().plusSeconds(status.ipCooldownSeconds))}"
    }
    return messages
}

private fun formatRegistrationTime(instant: Instant, includeTime: Boolean = true): String {
    val pattern = if (includeTime) "yyyy年M月d日 HH:mm" else "yyyy年M月d日"
    return DateTimeFormatter.ofPattern(pattern)
        .withZone(ZoneId.systemDefault())
        .format(instant)
}

@Composable
private fun InlineMessage(message: String) {
    Text(
        text = message,
        color = MaterialTheme.colorScheme.error,
        style = MaterialTheme.typography.bodyMedium,
        modifier = Modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.errorContainer, RoundedCornerShape(12.dp))
            .padding(14.dp),
    )
}

@Composable
internal fun UnsupportedWebViewScreen(missingFeatures: List<String>) {
    val context = LocalContext.current
    Box(
        modifier = Modifier.fillMaxSize().background(WarmCanvas).padding(28.dp),
        contentAlignment = Alignment.Center,
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Text("需要更新 Android System WebView", style = MaterialTheme.typography.headlineSmall)
            Text("当前 WebView 缺少安全运行所需能力，更新后再打开应用。")
            Text(missingFeatures.joinToString(separator = "\n"))
            Button(
                onClick = {
                    context.startActivity(
                        Intent(
                            Intent.ACTION_VIEW,
                            Uri.parse("https://play.google.com/store/apps/details?id=com.google.android.webview"),
                        ),
                    )
                },
                modifier = Modifier.fillMaxWidth().height(52.dp),
            ) { Text("更新 Android System WebView") }
        }
    }
}

private fun accountErrorMessage(throwable: Throwable): String {
    return when (throwable) {
        is MobileApiException -> throwable.message
        is SsaidUnavailableException -> throwable.message.orEmpty()
        is AccountLimitException -> throwable.message.orEmpty()
        is IOException -> "无法连接服务器。请检查网络，或切换域名后重试。"
        else -> "账号操作没有完成，请稍后重试。"
    }
}

private val APP_THEME_NAMES = setOf("light", "sfw", "dark", "green", "blue")
