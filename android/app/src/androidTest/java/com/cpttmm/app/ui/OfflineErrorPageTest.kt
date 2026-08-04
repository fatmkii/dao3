package com.cpttmm.app.ui

import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test

class OfflineErrorPageTest {
    @get:Rule
    val composeRule = createComposeRule()

    @Test
    fun offersRetryAndExplicitDomainSwitch() {
        var action = ""
        composeRule.setContent {
            MaterialTheme {
                OfflineErrorPage(
                    alternativeHost = "cpttmm.love",
                    onRetry = { action = "retry" },
                    onSwitchDomain = { action = "switch" },
                )
            }
        }

        composeRule.onNodeWithText("网络连接中断").assertIsDisplayed()
        composeRule.onNodeWithText("重新加载").performClick()
        assertEquals("retry", action)
        composeRule.onNodeWithText("切换到 cpttmm.love").performClick()
        assertEquals("switch", action)
    }

    @Test
    fun canHideDomainSwitch() {
        composeRule.setContent {
            MaterialTheme {
                OfflineErrorPage(
                    alternativeHost = null,
                    onRetry = {},
                    onSwitchDomain = {},
                )
            }
        }

        composeRule.onNodeWithText("重新加载").assertIsDisplayed()
        assertTrue(composeRule.onAllNodesWithText("切换到 cpttmm.love").fetchSemanticsNodes().isEmpty())
    }

    @Test
    fun unsupportedWebViewBlocksAppAndOffersUpdate() {
        composeRule.setContent {
            MaterialTheme {
                UnsupportedWebViewScreen(listOf("WEB_MESSAGE_LISTENER"))
            }
        }

        composeRule.onNodeWithText("需要更新 Android System WebView").assertIsDisplayed()
        composeRule.onNodeWithText("WEB_MESSAGE_LISTENER").assertIsDisplayed()
        composeRule.onNodeWithText("更新 Android System WebView").assertIsDisplayed()
    }
}
