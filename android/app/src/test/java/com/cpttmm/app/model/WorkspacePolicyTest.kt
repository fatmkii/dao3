package com.cpttmm.app.model

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
}
