package com.cpttmm.app.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.cpttmm.app.BuildConfig
import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.network.RegistrationStatus
import kotlinx.coroutines.launch
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

private enum class AccountAction {
    LOGIN,
    REGISTER,
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun AddAccountSheet(
    domain: AppDomain,
    accountLimitReached: Boolean,
    reauthentication: Boolean = false,
    initialBinggan: String = "",
    initialMessage: String? = null,
    onDomainChange: (AppDomain) -> Unit,
    onDismiss: () -> Unit,
    onLogin: suspend (String, String?) -> String,
    onRegister: suspend () -> String,
    loadRegistrationStatus: suspend () -> RegistrationStatus,
    onCompleted: (String?) -> Unit,
) {
    val scope = rememberCoroutineScope()
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var action by remember { mutableStateOf(AccountAction.LOGIN) }
    var binggan by remember(initialBinggan) { mutableStateOf(initialBinggan) }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var submitting by remember { mutableStateOf(false) }
    var error by remember(initialMessage) { mutableStateOf(initialMessage) }
    var registrationStatus by remember(domain) { mutableStateOf<RegistrationStatus?>(null) }
    var registrationStatusLoading by remember(domain) { mutableStateOf(false) }
    var registrationStatusError by remember(domain) { mutableStateOf<String?>(null) }
    val accountActionBlocked =
        accountLimitReached && !(reauthentication && action == AccountAction.LOGIN)

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
        if (submitting || accountActionBlocked) return
        if (action == AccountAction.REGISTER && registrationStatus?.canRegister != true) return
        if (action == AccountAction.LOGIN && binggan.isBlank()) {
            error = "请输入完整饼干后再登录。"
            return
        }
        scope.launch {
            submitting = true
            error = null
            runCatching<String?> {
                if (action == AccountAction.LOGIN) {
                    onLogin(binggan.trim(), password.ifBlank { null })
                } else {
                    onRegister()
                }
            }.onSuccess { registeredAccountId ->
                onCompleted(registeredAccountId)
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
            Text(
                if (reauthentication) "重新登录饼干" else "添加饼干",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.SemiBold,
            )
            Spacer(Modifier.height(14.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                FilterChip(
                    selected = action == AccountAction.LOGIN,
                    onClick = {
                        action = AccountAction.LOGIN
                        error = null
                    },
                    label = { Text("导入已有饼干") },
                    enabled = !submitting,
                )
                FilterChip(
                    selected = action == AccountAction.REGISTER,
                    onClick = {
                        action = AccountAction.REGISTER
                        error = null
                    },
                    label = { Text("领取新饼干") },
                    enabled = !submitting && !accountLimitReached,
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
                        onValueChange = {
                            binggan = it
                            error = null
                        },
                        label = { Text("饼干") },
                        singleLine = true,
                        enabled = !submitting,
                        modifier = Modifier.fillMaxWidth(),
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                    )
                    OutlinedTextField(
                        value = password,
                        onValueChange = {
                            password = it
                            error = null
                        },
                        label = { Text("密码（可留空）") },
                        singleLine = true,
                        enabled = !submitting,
                        modifier = Modifier.fillMaxWidth(),
                        visualTransformation =
                            if (passwordVisible) {
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
                    when {
                        registrationStatusLoading -> {
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(10.dp),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                CircularProgressIndicator(Modifier.size(22.dp), strokeWidth = 2.dp)
                                Text("正在检查是否可以领取…")
                            }
                        }

                        registrationStatusError != null -> {
                            InlineMessage(registrationStatusError!!)
                        }

                        registrationStatus != null -> {
                            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                registrationStatusMessages(registrationStatus!!).forEach { message ->
                                    Text(
                                        message,
                                        color =
                                            if (registrationStatus!!.canRegister) {
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

                if (accountActionBlocked) {
                    InlineMessage("已达到 5 个饼干上限，请先移除一个饼干。")
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
                enabled =
                    !submitting && !accountActionBlocked &&
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
                            "导入并保存"
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

private fun formatRegistrationTime(
    instant: Instant,
    includeTime: Boolean = true,
): String {
    val pattern = if (includeTime) "yyyy年M月d日 HH:mm" else "yyyy年M月d日"
    return DateTimeFormatter
        .ofPattern(pattern)
        .withZone(ZoneId.systemDefault())
        .format(instant)
}
