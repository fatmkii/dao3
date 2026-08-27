package com.cpttmm.app.ui

import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performScrollToIndex
import androidx.compose.ui.test.performTouchInput
import androidx.compose.ui.test.swipeDown
import androidx.compose.ui.test.swipeLeft
import com.cpttmm.app.data.local.BrowserTabEntity
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
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
    fun showsTheCreateButtonWhenThereAreFourTabs() {
        val tabs = tabs(4)

        composeRule.setContent {
            CpttmmTheme(defaultNativeThemePalette(null)) {
                TabSheet(
                    tabs = tabs,
                    accountAliases = emptyMap(),
                    activeTab = tabs.last(),
                    error = null,
                    onSelect = {},
                    onCreate = {},
                    onClose = {},
                    onDismiss = {},
                )
            }
        }

        tabs.forEach { tab -> composeRule.onNodeWithText(tab.path).assertIsDisplayed() }
        composeRule.onNodeWithText("新建标签").assertIsDisplayed()
    }

    @Test
    fun keepsTheCreateButtonVisibleWhileManyTabsScroll() {
        val tabs = tabs(9)

        composeRule.setContent {
            CpttmmTheme(defaultNativeThemePalette(null)) {
                TabSheet(
                    tabs = tabs,
                    accountAliases = emptyMap(),
                    activeTab = tabs.last(),
                    error = null,
                    onSelect = {},
                    onCreate = {},
                    onClose = {},
                    onDismiss = {},
                )
            }
        }

        composeRule.onNodeWithText("/thread/9").assertIsDisplayed()
        composeRule.onNodeWithText("新建标签").assertIsDisplayed()
        composeRule.onNodeWithTag("tab-sheet-list").performScrollToIndex(0)
        composeRule.onNodeWithText("/thread/1").assertIsDisplayed()
        composeRule.onNodeWithText("新建标签").assertIsDisplayed()
    }

    @Test
    fun theTabListHeightDoesNotGrowAfterTheFourthTab() {
        val tabCount = mutableStateOf(5)

        composeRule.setContent {
            val tabs = tabs(tabCount.value)
            CpttmmTheme(defaultNativeThemePalette(null)) {
                TabSheet(
                    tabs = tabs,
                    accountAliases = emptyMap(),
                    activeTab = tabs.last(),
                    error = null,
                    onSelect = {},
                    onCreate = {},
                    onClose = {},
                    onDismiss = {},
                )
            }
        }

        composeRule.waitForIdle()
        val heightWithFiveTabs =
            composeRule.onNodeWithTag("tab-sheet-list").fetchSemanticsNode().boundsInRoot.height

        tabCount.value = 9
        composeRule.waitForIdle()
        val heightWithNineTabs =
            composeRule.onNodeWithTag("tab-sheet-list").fetchSemanticsNode().boundsInRoot.height

        assertEquals(heightWithFiveTabs, heightWithNineTabs, 0.5f)
    }

    @Test
    fun theFirstDragScrollsTheTabListAndLeavesTheCreateButtonVisible() {
        val tabs = tabs(9)

        composeRule.setContent {
            CpttmmTheme(defaultNativeThemePalette(null)) {
                TabSheet(
                    tabs = tabs,
                    accountAliases = emptyMap(),
                    activeTab = tabs.last(),
                    error = null,
                    onSelect = {},
                    onCreate = {},
                    onClose = {},
                    onDismiss = {},
                )
            }
        }

        composeRule.onNodeWithTag("tab-sheet-list").performTouchInput { swipeDown() }
        composeRule.onNodeWithText("/thread/4").assertIsDisplayed()
        composeRule.onNodeWithText("新建标签").assertIsDisplayed()
    }

    @Test
    fun fastOverscrollDoesNotMoveOrDismissTheSheet() {
        val tabs = tabs(9)
        var dismissed = false

        composeRule.setContent {
            CpttmmTheme(defaultNativeThemePalette(null)) {
                TabSheet(
                    tabs = tabs,
                    accountAliases = emptyMap(),
                    activeTab = tabs.last(),
                    error = null,
                    onSelect = {},
                    onCreate = {},
                    onClose = {},
                    onDismiss = { dismissed = true },
                )
            }
        }

        composeRule.onNodeWithTag("tab-sheet-list").performScrollToIndex(0)
        val buttonTopBeforeDrag =
            composeRule.onNodeWithText("新建标签").fetchSemanticsNode().boundsInRoot.top

        composeRule.onNodeWithTag("tab-sheet-list").performTouchInput {
            swipeDown(durationMillis = 50)
        }
        composeRule.waitForIdle()

        assertFalse(dismissed)
        composeRule.onNodeWithText("新建标签").assertIsDisplayed()
        val buttonTopAfterDrag =
            composeRule.onNodeWithText("新建标签").fetchSemanticsNode().boundsInRoot.top
        assertEquals(buttonTopBeforeDrag, buttonTopAfterDrag, 0.5f)
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

    @Test
    fun swipingATabToTheLeftClosesIt() {
        val first = tab("first", "account-one", "/thread/1")
        val active = tab("active", "account-one", "/active")
        var closedTab: BrowserTabEntity? = null

        composeRule.setContent {
            CpttmmTheme(defaultNativeThemePalette(null)) {
                TabSheet(
                    tabs = listOf(first, active),
                    accountAliases = emptyMap(),
                    activeTab = active,
                    error = null,
                    onSelect = {},
                    onCreate = {},
                    onClose = { closedTab = it },
                    onDismiss = {},
                )
            }
        }

        composeRule.onNodeWithText(first.path).performTouchInput { swipeLeft() }
        composeRule.waitForIdle()

        assertEquals(first, closedTab)
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

    private fun tabs(count: Int) =
        (1..count).map { index -> tab("tab-$index", "account-one", "/thread/$index") }
}
