package com.cpttmm.app.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import com.cpttmm.app.R
import com.cpttmm.app.account.AccountAliasPolicy
import com.cpttmm.app.data.local.AccountEntity

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun AccountSwitcherSheet(
    accounts: List<AccountEntity>,
    activeAccount: AccountEntity,
    onSelect: (AccountEntity) -> Unit,
    onAdd: () -> Unit,
    onRemove: (AccountEntity) -> Unit,
    onAliasChange: (AccountEntity, String) -> Unit,
    onDismiss: () -> Unit,
) {
    var editingAccountId by remember { mutableStateOf<String?>(null) }
    var aliasInput by remember { mutableStateOf("") }
    val focusRequester = remember { FocusRequester() }
    val keyboardController = LocalSoftwareKeyboardController.current

    LaunchedEffect(editingAccountId) {
        if (editingAccountId != null) focusRequester.requestFocus()
    }

    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp).padding(bottom = 20.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Text("切换饼干", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.SemiBold)
            accounts.forEach { account ->
                Card(
                    onClick = { onSelect(account) },
                    modifier = Modifier.fillMaxWidth(),
                    colors =
                        CardDefaults.cardColors(
                            containerColor =
                                if (account.id == activeAccount.id) {
                                    MaterialTheme.colorScheme.background
                                } else {
                                    MaterialTheme.colorScheme.surface
                                },
                        ),
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(start = 8.dp, end = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            TextButton(
                                onClick = {
                                    if (editingAccountId == account.id) {
                                        editingAccountId = null
                                        keyboardController?.hide()
                                    } else {
                                        editingAccountId = account.id
                                        aliasInput = account.alias
                                    }
                                },
                                modifier =
                                    Modifier.height(48.dp).semantics {
                                        contentDescription = "别名 ${account.alias}，修改别名"
                                    },
                            ) {
                                Text(account.alias, maxLines = 1)
                            }
                            Text(
                                account.binggan,
                                modifier = Modifier.weight(1f).padding(vertical = 16.dp),
                                maxLines = 1,
                            )
                            TextButton(onClick = { onRemove(account) }) { Text("移除") }
                        }
                        if (editingAccountId == account.id) {
                            val aliasError = AccountAliasPolicy.validationError(aliasInput)
                            HorizontalDivider()
                            Row(
                                modifier =
                                    Modifier.fillMaxWidth()
                                        .padding(start = 12.dp, end = 8.dp, bottom = 8.dp),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Text(
                                    "修改别名",
                                    style = MaterialTheme.typography.labelMedium,
                                    maxLines = 1,
                                )
                                Spacer(Modifier.width(8.dp))
                                OutlinedTextField(
                                    value = aliasInput,
                                    onValueChange = { aliasInput = it },
                                    modifier =
                                        Modifier.weight(1f)
                                            .focusRequester(focusRequester)
                                            .testTag("alias-input-${account.id}"),
                                    singleLine = true,
                                    isError = aliasError != null,
                                    placeholder = { Text("最多5中文或10英文") },
                                    supportingText =
                                        if (aliasError == null) {
                                            null
                                        } else {
                                            { Text(aliasError) }
                                        },
                                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                                    keyboardActions =
                                        KeyboardActions(
                                            onDone = {
                                                if (aliasError == null) {
                                                    onAliasChange(account, aliasInput)
                                                    editingAccountId = null
                                                    keyboardController?.hide()
                                                }
                                            },
                                        ),
                                )
                                Spacer(Modifier.width(4.dp))
                                TextButton(
                                    onClick = {
                                        onAliasChange(account, aliasInput)
                                        editingAccountId = null
                                        keyboardController?.hide()
                                    },
                                    enabled = aliasError == null,
                                    modifier = Modifier.height(48.dp),
                                ) { Text("确定") }
                            }
                        }
                    }
                }
            }
            Button(
                onClick = onAdd,
                enabled = accounts.size < 5,
                modifier = Modifier.fillMaxWidth().height(52.dp),
            ) { Text(if (accounts.size < 5) "添加饼干" else "已达到 5 个饼干上限") }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun AccountHome(
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
                            "For Android",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                },
                colors =
                    TopAppBarDefaults.topAppBarColors(
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
private fun EmptyAccountScreen(
    modifier: Modifier,
    onAddAccount: () -> Unit,
) {
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
                    painter = painterResource(R.drawable.icon_cat),
                    contentDescription = "小火锅应用图标",
                    modifier = Modifier.padding(24.dp),
                )
            }
            Text(
                "把你的饼干放进来",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.SemiBold,
            )
            Text(
                "这里是私人论坛小火锅，欢迎来玩！\n" +
                    "QQ小火锅避难群：156840110\n" +
                    "使用前需要在下面领取或者导入饼干喔",
                modifier = Modifier.padding(8.dp),
                style = MaterialTheme.typography.bodyMedium,
            )
            Button(onClick = onAddAccount, modifier = Modifier.fillMaxWidth().height(52.dp)) {
                Text("添加饼干")
            }
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
        Text("选择饼干", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.SemiBold)
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
            Text(if (accounts.size < 5) "添加另一个饼干" else "已达到 5 个饼干上限")
        }
    }
}
