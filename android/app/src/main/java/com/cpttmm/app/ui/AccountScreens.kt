package com.cpttmm.app.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.cpttmm.app.R
import com.cpttmm.app.data.local.AccountEntity

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun AccountSwitcherSheet(
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
