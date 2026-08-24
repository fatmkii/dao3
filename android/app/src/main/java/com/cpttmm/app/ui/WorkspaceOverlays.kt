package com.cpttmm.app.ui

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.Switch
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.cpttmm.app.BuildConfig
import com.cpttmm.app.R
import com.cpttmm.app.account.MobileAuthCoordinator
import com.cpttmm.app.data.local.BrowserTabEntity
import com.cpttmm.app.model.WorkspacePolicy
import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.network.MobileReleaseInfo
import com.cpttmm.app.preferences.AppTheme
import com.cpttmm.app.preferences.AppThemePreferences

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun TabSheet(
    tabs: List<BrowserTabEntity>,
    accountAliases: Map<String, String>,
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
            tabs.sortedBy { it.id == activeTab.id }.forEach { tab ->
                val isActive = tab.id == activeTab.id
                Card(
                    onClick = { onSelect(tab) },
                    modifier = Modifier.fillMaxWidth().semantics { selected = isActive },
                    border =
                        if (isActive) {
                            BorderStroke(
                                1.dp,
                                MaterialTheme.colorScheme.primary.copy(alpha = 0.35f),
                            )
                        } else {
                            null
                        },
                    colors =
                        CardDefaults.cardColors(
                            containerColor =
                                if (isActive) {
                                    MaterialTheme.colorScheme.background
                                } else {
                                    MaterialTheme.colorScheme.surface
                                },
                        ),
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(start = 8.dp, end = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        TextButton(
                            onClick = { onSelect(tab) },
                            modifier = Modifier.height(48.dp),
                        ) {
                            Text(
                                accountAliases[tab.accountId].orEmpty(),
                                maxLines = 1,
                            )
                        }
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
                enabled = tabs.size < WorkspacePolicy.MAX_TABS,
                modifier = Modifier.fillMaxWidth().height(52.dp),
            ) {
                Text(
                    if (tabs.size < WorkspacePolicy.MAX_TABS) {
                        "新建标签"
                    } else {
                        "已达到 ${WorkspacePolicy.MAX_TABS} 个标签上限"
                    },
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun WorkspaceToolsPanel(
    currentBinggan: String,
    currentOlo: Long,
    domain: AppDomain,
    auth: MobileAuthCoordinator,
    error: String?,
    onSelectAccount: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val context = LocalContext.current
    var release by remember(domain) { mutableStateOf<MobileReleaseInfo?>(null) }
    var releaseError by remember(domain) { mutableStateOf<String?>(null) }

    LaunchedEffect(domain) {
        runCatching { auth.releaseInfo(domain) }
            .onSuccess { release = it }
            .onFailure { releaseError = accountErrorMessage(it) }
    }

    Column(
        modifier =
            modifier
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        if (error != null) InlineMessage(error)
        Button(
            onClick = onSelectAccount,
            modifier = Modifier.fillMaxWidth().height(52.dp),
        ) { Text("切换饼干：$currentBinggan", maxLines = 1) }
        Text(
            "现有olo:$currentOlo",
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            style = MaterialTheme.typography.bodySmall,
        )
        HorizontalDivider()
        Text("当前版本 ${BuildConfig.VERSION_NAME} (${BuildConfig.VERSION_CODE})")
        when {
            release != null -> ReleaseDetails(release!!, context)
            releaseError != null -> InlineMessage(releaseError!!)
            else -> CircularProgressIndicator(Modifier.size(28.dp))
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun AppSettingsScreen(
    domain: AppDomain,
    error: String?,
    themePreferences: AppThemePreferences,
    keepTabsAfterClose: Boolean,
    pullUpRefreshEnabled: Boolean,
    onBack: () -> Unit,
    onDomainChange: (AppDomain) -> Unit,
    onClearWebCache: () -> Unit,
    onFollowSystemChange: (Boolean) -> Unit,
    onKeepTabsAfterCloseChange: (Boolean) -> Unit,
    onPullUpRefreshEnabledChange: (Boolean) -> Unit,
    onThemeForSystemModeChange: (Boolean, AppTheme) -> Unit,
) {
    var selectingDarkMode by remember { mutableStateOf<Boolean?>(null) }
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("设置") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(
                            painter = painterResource(R.drawable.chevron_left),
                            contentDescription = "返回",
                        )
                    }
                },
            )
        },
    ) { padding ->
        Column(
            modifier =
                Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 24.dp, vertical = 20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Text("通用设定", style = MaterialTheme.typography.titleMedium)
            Row(
                modifier =
                    Modifier.fillMaxWidth().clickable {
                        onFollowSystemChange(!themePreferences.followSystem)
                    },
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Text("跟随系统切换皮肤")
                Switch(
                    checked = themePreferences.followSystem,
                    onCheckedChange = onFollowSystemChange,
                )
            }
            if (themePreferences.followSystem) {
                ThemeSettingRow(
                    label = "亮色时皮肤：",
                    theme = themePreferences.lightTheme,
                    onClick = { selectingDarkMode = false },
                )
                ThemeSettingRow(
                    label = "暗色时皮肤：",
                    theme = themePreferences.darkTheme,
                    onClick = { selectingDarkMode = true },
                )
            }
            Row(
                modifier =
                    Modifier.fillMaxWidth().clickable {
                        onKeepTabsAfterCloseChange(!keepTabsAfterClose)
                    },
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Text("关闭APP后保持标签页")
                Switch(
                    checked = keepTabsAfterClose,
                    onCheckedChange = onKeepTabsAfterCloseChange,
                )
            }
            Row(
                modifier =
                    Modifier.fillMaxWidth().clickable {
                        onPullUpRefreshEnabledChange(!pullUpRefreshEnabled)
                    },
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Text("底部滑动页面触发刷新")
                Switch(
                    checked = pullUpRefreshEnabled,
                    onCheckedChange = onPullUpRefreshEnabledChange,
                )
            }
            HorizontalDivider()
            Text("访问域名", style = MaterialTheme.typography.titleMedium)
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                AppDomain.entries.forEach { candidate ->
                    FilterChip(
                        selected = candidate == domain,
                        onClick = { onDomainChange(candidate) },
                        label = { Text(candidate.host) },
                        enabled = !BuildConfig.DEBUG,
                    )
                }
            }
            Text(
                if (BuildConfig.DEBUG) {
                    "Debug 版固定访问 192.168.1.210，以上选项仅供查看。"
                } else {
                    "如果网络链接有问题请尝试更换网址；不会切换已登录的饼干。"
                },
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                style = MaterialTheme.typography.bodySmall,
            )
            if (error != null) InlineMessage(error)
            HorizontalDivider()
            Text("网页缓存", style = MaterialTheme.typography.titleMedium)
            FilledTonalButton(
                onClick = onClearWebCache,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                colors =
                    ButtonDefaults.filledTonalButtonColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant,
                        contentColor = MaterialTheme.colorScheme.onSurfaceVariant,
                    ),
            ) { Text("清理网页缓存") }
            Text(
                "清理后会重新加载当前页面，不会删除已导入饼干。",
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                style = MaterialTheme.typography.bodySmall,
            )
        }
    }

    selectingDarkMode?.let { darkMode ->
        ThemeSelectionDialog(
            title = if (darkMode) "暗色时皮肤" else "亮色时皮肤",
            selectedTheme = if (darkMode) themePreferences.darkTheme else themePreferences.lightTheme,
            onSelect = { theme ->
                onThemeForSystemModeChange(darkMode, theme)
                selectingDarkMode = null
            },
            onDismiss = { selectingDarkMode = null },
        )
    }
}

@Composable
private fun ThemeSettingRow(
    label: String,
    theme: AppTheme,
    onClick: () -> Unit,
) {
    Row(
        modifier = Modifier.fillMaxWidth().clickable(onClick = onClick),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Text(label, style = MaterialTheme.typography.bodyMedium)
        FilterChip(
            selected = false,
            onClick = onClick,
            label = { Text(theme.displayName) },
        )
    }
}

@Composable
private fun ThemeSelectionDialog(
    title: String,
    selectedTheme: AppTheme,
    onSelect: (AppTheme) -> Unit,
    onDismiss: () -> Unit,
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = {
            Column(Modifier.verticalScroll(rememberScrollState())) {
                AppTheme.entries.forEach { theme ->
                    Row(
                        modifier = Modifier.fillMaxWidth().clickable { onSelect(theme) },
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        RadioButton(
                            selected = theme == selectedTheme,
                            onClick = { onSelect(theme) },
                        )
                        Text(theme.displayName)
                    }
                }
            }
        },
        confirmButton = {},
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("取消") }
        },
    )
}

@Composable
private fun ReleaseDetails(
    release: MobileReleaseInfo,
    context: android.content.Context,
) {
    val hasUpdate = release.versionCode > BuildConfig.VERSION_CODE
    Text(
        if (hasUpdate) "发现新版本 ${release.versionName}" else "已是最新版本",
        fontWeight = FontWeight.SemiBold,
    )
    if (hasUpdate && release.apkUrl.startsWith("https://")) {
        Button(
            onClick = { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(release.apkUrl))) },
            modifier = Modifier.fillMaxWidth().height(52.dp),
        ) { Text("Cloudflare下载") }
    }
    if (hasUpdate &&
        release.backupApkUrl.startsWith("https://") &&
        release.backupApkUrl != release.apkUrl
    ) {
        TextButton(
            onClick = {
                context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(release.backupApkUrl)))
            },
            modifier = Modifier.fillMaxWidth().height(48.dp),
        ) { Text("备用下载") }
    }
}

@Composable
internal fun WorkspaceMessage(
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
                Text("返回饼干列表")
            }
        }
    }
}
