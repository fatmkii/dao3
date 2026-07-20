package com.cpttmm.app.navigation

import com.cpttmm.app.BuildConfig
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class DomainPolicyTest {
    @Test
    fun `normalizes www app urls to bare domain`() {
        val target = DomainPolicy.classify("https://www.cpttmm.com/forum?page=2")

        assertTrue(target is NavigationTarget.Internal)
        assertEquals("https://cpttmm.com/forum?page=2", (target as NavigationTarget.Internal).uri.toString())
    }

    @Test
    fun `keeps both configured domains internal`() {
        assertTrue(DomainPolicy.classify("https://cpttmm.com/") is NavigationTarget.Internal)
        assertTrue(DomainPolicy.classify("https://cpttmm.love/thread/1") is NavigationTarget.Internal)
    }

    @Test
    fun `sends other https hosts outside the app`() {
        assertTrue(DomainPolicy.classify("https://example.com/") is NavigationTarget.External)
    }

    @Test
    fun `blocks cleartext and malformed urls`() {
        assertEquals(NavigationTarget.Blocked, DomainPolicy.classify("http://cpttmm.com/"))
        assertEquals(NavigationTarget.Blocked, DomainPolicy.classify("not a url"))
    }

    @Test
    fun `only accepts the default https origin`() {
        assertEquals(
            "https://cpttmm.com/thread/1",
            (DomainPolicy.classify("https://cpttmm.com:443/thread/1") as NavigationTarget.Internal)
                .uri.toString(),
        )
        assertEquals(NavigationTarget.Blocked, DomainPolicy.classify("https://cpttmm.com:8443/thread/1"))
        assertEquals(NavigationTarget.Blocked, DomainPolicy.classify("https://user@cpttmm.com/thread/1"))
    }

    @Test
    fun `configured local server is internal only on its exact origin`() {
        if (BuildConfig.LOCAL_SERVER_URL.isBlank()) return

        val localOrigin = BuildConfig.LOCAL_SERVER_URL.trimEnd('/')
        assertTrue(DomainPolicy.classify("$localOrigin/thread/1") is NavigationTarget.Internal)
        assertEquals(NavigationTarget.Blocked, DomainPolicy.classify("http://127.0.0.2/thread/1"))
    }
}
