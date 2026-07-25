package com.cpttmm.app.ui

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.cpttmm.app.account.AccountLimitException
import com.cpttmm.app.account.MobileSessionUnavailableException
import com.cpttmm.app.account.SsaidUnavailableException
import com.cpttmm.app.network.MobileApiException
import java.io.IOException

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

@Composable
internal fun InlineMessage(message: String) {
    Text(
        text = message,
        color = MaterialTheme.colorScheme.error,
        style = MaterialTheme.typography.bodyMedium,
        modifier =
            Modifier
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

internal fun accountErrorMessage(throwable: Throwable): String =
    when (throwable) {
        is MobileApiException -> throwable.message
        is MobileSessionUnavailableException -> throwable.message.orEmpty()
        is SsaidUnavailableException -> throwable.message.orEmpty()
        is AccountLimitException -> throwable.message.orEmpty()
        is IOException -> "无法连接服务器。请检查网络，或切换域名后重试。"
        else -> "账号操作没有完成，请稍后重试。"
    }
