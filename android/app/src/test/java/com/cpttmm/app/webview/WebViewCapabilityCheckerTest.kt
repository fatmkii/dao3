package com.cpttmm.app.webview

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class WebViewCapabilityCheckerTest {
    @Test
    fun `accepts webview only when every required feature exists`() {
        assertTrue(WebViewCapabilityChecker { true }.check().isSupported)
    }

    @Test
    fun `reports every missing feature`() {
        val supported = WebViewCapabilityChecker.REQUIRED_FEATURES.first()
        val result = WebViewCapabilityChecker { it == supported }.check()

        assertFalse(result.isSupported)
        assertEquals(WebViewCapabilityChecker.REQUIRED_FEATURES.drop(1), result.missingFeatures)
    }
}
