package com.cpttmm.app.ui

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import com.cpttmm.app.navigation.AppDomain
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test

class AppSettingsScreenTest {
    @get:Rule
    val composeRule = createComposeRule()

    @Test
    fun showsSettingsAndInvokesPageActions() {
        var action = ""
        composeRule.setContent {
            CpttmmTheme(defaultNativeThemePalette(null)) {
                AppSettingsScreen(
                    domain = AppDomain.PRIMARY,
                    error = null,
                    onBack = { action = "back" },
                    onDomainChange = {},
                    onClearWebCache = { action = "clear" },
                )
            }
        }

        composeRule.onNodeWithText("设置").assertIsDisplayed()
        composeRule.onNodeWithText("访问域名").assertIsDisplayed()
        composeRule.onNodeWithText("清理网页缓存").performClick()
        assertEquals("clear", action)

        composeRule.onNodeWithContentDescription("返回").performClick()
        assertEquals("back", action)
    }
}
