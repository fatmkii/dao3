package com.cpttmm.app.ui

import android.view.View
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import com.cpttmm.app.webview.PullUpRefreshPhase
import com.cpttmm.app.webview.PullUpRefreshState
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test

class ActiveTabViewTest {
    @get:Rule
    val composeRule = createComposeRule()

    @Test
    fun changingTabReplacesAttachedAndroidView() {
        val activeTabId = mutableStateOf("first")
        lateinit var firstView: View
        lateinit var secondView: View

        composeRule.setContent {
            val context = LocalContext.current
            firstView = remember { View(context) }
            secondView = remember { View(context) }
            ActiveTabView(
                tabId = activeTabId.value,
                view = if (activeTabId.value == "first") firstView else secondView,
            )
        }

        composeRule.runOnIdle {
            assertTrue(firstView.isAttachedToWindow)
            activeTabId.value = "second"
        }
        composeRule.runOnIdle {
            assertFalse(firstView.isAttachedToWindow)
            assertTrue(secondView.isAttachedToWindow)
        }
    }

    @Test
    fun pullUpRefreshIndicatorDescribesEveryVisibleState() {
        val state = mutableStateOf(PullUpRefreshState())
        composeRule.setContent { PullUpRefreshIndicator(state.value) }

        composeRule.onNodeWithText("上拉刷新").assertDoesNotExist()

        composeRule.runOnIdle {
            state.value = PullUpRefreshState(PullUpRefreshPhase.PULLING, 32f)
        }
        composeRule.onNodeWithText("上拉刷新").assertExists()

        composeRule.runOnIdle {
            state.value = PullUpRefreshState(PullUpRefreshPhase.ARMED, 64f)
        }
        composeRule.onNodeWithText("松开刷新").assertExists()

        composeRule.runOnIdle {
            state.value = PullUpRefreshState(PullUpRefreshPhase.REFRESHING, 64f)
        }
        composeRule.onNodeWithText("正在刷新").assertExists()
    }
}
