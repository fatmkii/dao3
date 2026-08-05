package com.cpttmm.app.ui

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class BottomBarScrollBehaviorTest {
    @Test
    fun hidesAfterConsecutiveUserScrollsReachThreshold() {
        val behavior = behavior()

        assertNull(behavior.onScroll(10, 0, userInitiated = true, bottomBarVisible = true))
        assertNull(behavior.onScroll(23, 10, userInitiated = true, bottomBarVisible = true))
        assertEquals(
            BottomBarVisibilityChange.HIDE,
            behavior.onScroll(24, 23, userInitiated = true, bottomBarVisible = true),
        )
        assertNull(behavior.onScroll(48, 24, userInitiated = true, bottomBarVisible = false))
    }

    @Test
    fun showsAfterConsecutiveUpwardScrollsReachThreshold() {
        val behavior = behavior()

        assertNull(behavior.onScroll(95, 100, userInitiated = true, bottomBarVisible = false))
        assertEquals(
            BottomBarVisibilityChange.SHOW,
            behavior.onScroll(88, 95, userInitiated = true, bottomBarVisible = false),
        )
    }

    @Test
    fun reversingDirectionResetsAccumulatedDistance() {
        val behavior = behavior()

        assertNull(behavior.onScroll(20, 0, userInitiated = true, bottomBarVisible = true))
        assertNull(behavior.onScroll(16, 20, userInitiated = true, bottomBarVisible = true))
        assertNull(behavior.onScroll(20, 16, userInitiated = true, bottomBarVisible = true))
        assertEquals(
            BottomBarVisibilityChange.HIDE,
            behavior.onScroll(40, 20, userInitiated = true, bottomBarVisible = true),
        )
    }

    @Test
    fun ignoresProgrammaticScrolls() {
        val behavior = behavior()

        assertNull(behavior.onScroll(500, 0, userInitiated = false, bottomBarVisible = true))
        assertNull(behavior.onScroll(510, 500, userInitiated = true, bottomBarVisible = true))
    }

    @Test
    fun returningToTopShowsBottomBar() {
        val behavior = behavior()

        assertEquals(
            BottomBarVisibilityChange.SHOW,
            behavior.onScroll(0, 100, userInitiated = false, bottomBarVisible = false),
        )
    }

    @Test
    fun resetDiscardsPreviousProgress() {
        val behavior = behavior()

        assertNull(behavior.onScroll(20, 0, userInitiated = true, bottomBarVisible = true))
        behavior.reset()
        assertNull(behavior.onScroll(40, 20, userInitiated = true, bottomBarVisible = true))
    }

    private fun behavior() = BottomBarScrollBehavior(
        hideThresholdPx = 24,
        showThresholdPx = 12,
    )
}
