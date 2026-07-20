package com.cpttmm.app.ui

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.webkit.WebViewFeature
import com.cpttmm.app.MainActivity
import org.junit.Assume.assumeTrue
import org.junit.Rule
import org.junit.Test

class AccountFlowTest {
    @get:Rule
    val composeRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun addAccountSheetProgressivelyDisclosesLoginAndRegistration() {
        assumeTrue(WebViewFeature.isFeatureSupported(WebViewFeature.MULTI_PROFILE))
        val addAccountLabel = if (
            composeRule.onAllNodesWithText("添加账号").fetchSemanticsNodes().isNotEmpty()
        ) {
            "添加账号"
        } else {
            "添加另一个账号"
        }
        composeRule.onNodeWithText(addAccountLabel).performClick()
        composeRule.onNodeWithText("登录已有饼干").assertIsDisplayed()
        composeRule.onNodeWithText("饼干").assertIsDisplayed()

        composeRule.onNodeWithText("领取新饼干").performClick()
        composeRule.onNodeWithText("领取前请了解").assertIsDisplayed()
        composeRule.onNodeWithText("从这台设备领取").assertIsDisplayed()
    }
}
