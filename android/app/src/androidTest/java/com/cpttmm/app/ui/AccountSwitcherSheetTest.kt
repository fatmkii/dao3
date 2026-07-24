package com.cpttmm.app.ui

import androidx.compose.ui.semantics.SemanticsProperties
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextReplacement
import androidx.compose.ui.text.TextRange
import com.cpttmm.app.data.local.AccountEntity
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
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
        composeRule.onNodeWithText("添加饼干").assertDoesNotExist()
        val aliasInput = composeRule.onNodeWithTag("alias-input-account-id")
        assertEquals(
            TextRange(0, account.alias.length),
            aliasInput.fetchSemanticsNode().config[SemanticsProperties.TextSelectionRange],
        )
        aliasInput.performTextReplacement("")
        composeRule.onNodeWithText("最多5中文或10英文").assertExists()
        aliasInput.performTextReplacement("常用")
        composeRule.onNodeWithText("确定").performClick()

        assertEquals("常用", savedAlias)
        composeRule.onNodeWithText("修改别名").assertDoesNotExist()
        composeRule.onNodeWithText("添加饼干").assertExists()
    }

    @Test
    fun showsTheActiveAccountLast() {
        val active = account(id = "active", alias = "当前")
        val other = account(id = "other", alias = "其他")

        composeRule.setContent {
            CpttmmTheme(defaultNativeThemePalette(null)) {
                AccountSwitcherSheet(
                    accounts = listOf(active, other),
                    activeAccount = active,
                    onSelect = {},
                    onAdd = {},
                    onRemove = {},
                    onAliasChange = { _, _ -> },
                    onDismiss = {},
                )
            }
        }

        val activeTop = composeRule.onNodeWithText("当前").fetchSemanticsNode().boundsInRoot.top
        val otherTop = composeRule.onNodeWithText("其他").fetchSemanticsNode().boundsInRoot.top
        assertTrue(activeTop > otherTop)
    }

    private fun account(
        id: String = "account-id",
        alias: String = "饼干#1",
    ) =
        AccountEntity(
            id = id,
            binggan = "SecretCookie",
            alias = alias,
            profileName = "profile",
            cachedThemeName = null,
            accessExpiresAtMillis = Long.MAX_VALUE,
            idleExpiresAtMillis = Long.MAX_VALUE,
            lastUsedAtMillis = 0,
        )
}
