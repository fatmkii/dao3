package com.cpttmm.app.webview

import androidx.webkit.WebViewFeature

data class WebViewCapability(
    val missingFeatures: List<String>,
) {
    val isSupported: Boolean = missingFeatures.isEmpty()
}

class WebViewCapabilityChecker(
    private val isSupported: (String) -> Boolean,
) {
    fun check(): WebViewCapability {
        return WebViewCapability(REQUIRED_FEATURES.filterNot(isSupported))
    }

    companion object {
        val REQUIRED_FEATURES = listOf(
            WebViewFeature.MULTI_PROFILE,
            WebViewFeature.DOCUMENT_START_SCRIPT,
            WebViewFeature.WEB_MESSAGE_LISTENER,
        )
    }
}
