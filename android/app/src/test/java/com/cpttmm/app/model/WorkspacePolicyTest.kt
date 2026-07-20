package com.cpttmm.app.model

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class WorkspacePolicyTest {
    @Test
    fun `limits accounts and tabs`() {
        assertTrue(WorkspacePolicy.canAddAccount(4))
        assertFalse(WorkspacePolicy.canAddAccount(5))
        assertTrue(WorkspacePolicy.canAddTab(9))
        assertFalse(WorkspacePolicy.canAddTab(10))
    }

    @Test
    fun `sleeps least recently used live tabs and keeps activating tab`() {
        val tabs = (1..5).map { index ->
            BrowserTab(
                id = index.toString(),
                path = "/$index",
                title = "Tab $index",
                scrollY = 0,
                lastUsedAtMillis = index.toLong(),
                isLive = true,
            )
        }

        assertEquals(setOf("1", "2"), WorkspacePolicy.tabsToSleep(tabs, activatingTabId = "5"))
    }
}
