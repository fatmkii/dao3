package com.cpttmm.app.ui

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performScrollTo
import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.preferences.AppTheme
import com.cpttmm.app.preferences.AppThemePreferences
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
                    themePreferences = AppThemePreferences(),
                    keepTabsAfterClose = true,
                    pullUpRefreshEnabled = true,
                    onBack = { action = "back" },
                    onDomainChange = {},
                    onClearWebCache = { action = "clear" },
                    onFollowSystemChange = { action = "follow:$it" },
                    onKeepTabsAfterCloseChange = { action = "keep:$it" },
                    onPullUpRefreshEnabledChange = { action = "pull:$it" },
                    onThemeForSystemModeChange = { darkMode, theme ->
                        action = "theme:$darkMode:${theme.storageValue}"
                    },
                )
            }
        }

        composeRule.onNodeWithText("设置").assertIsDisplayed()
        composeRule.onNodeWithText("通用设定").assertIsDisplayed()
        composeRule.onNodeWithText("亮色时皮肤：").assertDoesNotExist()
        composeRule.onNodeWithText("跟随系统切换皮肤").performClick()
        assertEquals("follow:true", action)
        composeRule.onNodeWithText("关闭APP后保持标签页").assertIsDisplayed().performClick()
        assertEquals("keep:false", action)
        composeRule.onNodeWithText("底部滑动页面触发刷新").assertIsDisplayed().performClick()
        assertEquals("pull:false", action)
        composeRule.onNodeWithText("访问域名").assertIsDisplayed()
        composeRule.onNodeWithText("清理网页缓存").performClick()
        assertEquals("clear", action)

        composeRule.onNodeWithContentDescription("返回").performClick()
        assertEquals("back", action)
    }

    @Test
    fun selectsCompactLightAndDarkThemes() {
        var action = ""
        composeRule.setContent {
            CpttmmTheme(defaultNativeThemePalette(null)) {
                AppSettingsScreen(
                    domain = AppDomain.PRIMARY,
                    error = null,
                    themePreferences = AppThemePreferences(followSystem = true),
                    keepTabsAfterClose = false,
                    pullUpRefreshEnabled = true,
                    onBack = {},
                    onDomainChange = {},
                    onClearWebCache = {},
                    onFollowSystemChange = {},
                    onKeepTabsAfterCloseChange = {},
                    onPullUpRefreshEnabledChange = {},
                    onThemeForSystemModeChange = { darkMode, theme ->
                        action = "$darkMode:${theme.storageValue}"
                    },
                )
            }
        }

        composeRule.onNodeWithText("关闭APP后保持标签页").assertIsDisplayed()
        composeRule.onNodeWithText("亮色时皮肤：").performClick()
        composeRule.onNodeWithText(AppTheme.BLUE.displayName).performScrollTo().performClick()
        assertEquals("false:blue", action)

        composeRule.onNodeWithText("暗色时皮肤：").performClick()
        composeRule.onNodeWithText(AppTheme.SFW.displayName).performClick()
        assertEquals("true:sfw", action)
    }
}
