package com.cpttmm.app.ui

import android.view.View
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.test.junit4.v2.createComposeRule
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
}
