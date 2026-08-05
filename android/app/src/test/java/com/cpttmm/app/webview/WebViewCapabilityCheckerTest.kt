package com.cpttmm.app.webview

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class WebViewCapabilityCheckerTest {
    @Test
    fun `accepts webview when message listener is supported`() {
        val result = WebViewCapabilityChecker { it == WebViewCapabilityChecker.REQUIRED_FEATURES.single() }.check()

        assertTrue(result.isSupported)
        assertEquals(listOf("WEB_MESSAGE_LISTENER"), WebViewCapabilityChecker.REQUIRED_FEATURES)
    }

    @Test
    fun `reports every missing feature`() {
        val result = WebViewCapabilityChecker { false }.check()

        assertFalse(result.isSupported)
        assertEquals(WebViewCapabilityChecker.REQUIRED_FEATURES, result.missingFeatures)
    }
}
