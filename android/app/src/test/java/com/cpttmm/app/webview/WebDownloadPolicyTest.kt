package com.cpttmm.app.webview

import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.navigation.DomainPolicy
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class WebDownloadPolicyTest {
    @Test
    fun allowsTrustedInternalDownloadsAndAttachesAuthorization() {
        val url = DomainPolicy.home(AppDomain.PRIMARY).resolve("/images/example.png").toString()

        assertTrue(WebDownloadPolicy.isAllowed(url))
        assertTrue(WebDownloadPolicy.shouldAttachAuthorization(url))
    }

    @Test
    fun allowsExternalHttpsWithoutAttachingAuthorization() {
        val url = "https://cdn.example.com/image.png"

        assertTrue(WebDownloadPolicy.isAllowed(url))
        assertFalse(WebDownloadPolicy.shouldAttachAuthorization(url))
    }

    @Test
    fun rejectsNonNetworkAndExternalCleartextUrls() {
        assertFalse(WebDownloadPolicy.isAllowed("blob:https://cpttmm.com/example"))
        assertFalse(WebDownloadPolicy.isAllowed("data:image/png;base64,AAAA"))
        assertFalse(WebDownloadPolicy.isAllowed("http://cdn.example.com/image.png"))
    }
}
