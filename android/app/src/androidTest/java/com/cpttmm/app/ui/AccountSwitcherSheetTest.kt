package com.cpttmm.app.ui

import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextReplacement
import com.cpttmm.app.data.local.AccountEntity
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test

class AccountSwitcherSheetTest {
    @get:Rule
    val composeRule = createComposeRule()

    @Test
    fun editsAliasInline() {
        val account = account()
        var savedAlias: String? = null

        composeRule.setContent {
            CpttmmTheme(defaultNativeThemePalette(null)) {
                AccountSwitcherSheet(
                    accounts = listOf(account),
                    activeAccount = account,
                    onSelect = {},
                    onAdd = {},
                    onRemove = {},
                    onAliasChange = { _, alias -> savedAlias = alias },
                    onDismiss = {},
                )
            }
        }

        composeRule.onNodeWithContentDescription("别名 饼干#1，修改别名").performClick()
        composeRule.onNodeWithText("修改别名").assertExists()
        composeRule.onNodeWithTag("alias-input-account-id").performTextReplacement("")
        composeRule.onNodeWithText("最多5中文或10英文").assertExists()
        composeRule.onNodeWithTag("alias-input-account-id").performTextReplacement("常用")
        composeRule.onNodeWithText("确定").performClick()

        assertEquals("常用", savedAlias)
        composeRule.onNodeWithText("修改别名").assertDoesNotExist()
    }

    private fun account() =
        AccountEntity(
            id = "account-id",
            binggan = "SecretCookie",
            alias = "饼干#1",
            profileName = "profile",
            cachedThemeName = null,
            accessExpiresAtMillis = Long.MAX_VALUE,
            idleExpiresAtMillis = Long.MAX_VALUE,
            lastUsedAtMillis = 0,
        )
}
