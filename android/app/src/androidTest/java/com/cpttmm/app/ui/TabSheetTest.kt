package com.cpttmm.app.ui

import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import com.cpttmm.app.data.local.BrowserTabEntity
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test

class TabSheetTest {
    @get:Rule
    val composeRule = createComposeRule()

    @Test
    fun showsTheOwningAccountAliasForEveryTab() {
        val first = tab("first", "account-one", "/thread/1")
        val second = tab("second", "account-two", "/thread/2")

        composeRule.setContent {
            CpttmmTheme(defaultNativeThemePalette(null)) {
                TabSheet(
                    tabs = listOf(first, second),
                    accountAliases = mapOf(
                        "account-one" to "常用",
                        "account-two" to "备用",
                    ),
                    activeTab = first,
                    error = null,
                    onSelect = {},
                    onCreate = {},
                    onClose = {},
                    onDismiss = {},
                )
            }
        }

        composeRule.onNodeWithText("常用").assertExists()
        composeRule.onNodeWithText("备用").assertExists()
        composeRule.onNodeWithText("/thread/1").assertExists()
        composeRule.onNodeWithText("/thread/2").assertExists()
    }

    @Test
    fun showsTheActiveTabLast() {
        val active = tab("active", "account-one", "/active")
        val other = tab("other", "account-two", "/other")

        composeRule.setContent {
            CpttmmTheme(defaultNativeThemePalette(null)) {
                TabSheet(
                    tabs = listOf(active, other),
                    accountAliases = emptyMap(),
                    activeTab = active,
                    error = null,
                    onSelect = {},
                    onCreate = {},
                    onClose = {},
                    onDismiss = {},
                )
            }
        }

        val activeTop = composeRule.onNodeWithText("/active").fetchSemanticsNode().boundsInRoot.top
        val otherTop = composeRule.onNodeWithText("/other").fetchSemanticsNode().boundsInRoot.top
        assertTrue(activeTop > otherTop)
    }

    private fun tab(id: String, accountId: String, path: String) =
        BrowserTabEntity(
            id = id,
            accountId = accountId,
            path = path,
            title = "小火锅",
            scrollY = 0,
            lastUsedAtMillis = 0,
        )
}
