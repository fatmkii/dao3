package com.cpttmm.app.navigation

import com.cpttmm.app.BuildConfig
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Assume.assumeFalse
import org.junit.Assume.assumeTrue
import org.junit.Test

class DomainPolicyTest {
    @Test
    fun `normalizes www app urls to bare domain`() {
        assumeFalse(BuildConfig.DEBUG)
        val target = DomainPolicy.classify("https://www.cpttmm.com/forum?page=2")

        assertTrue(target is NavigationTarget.Internal)
        assertEquals("https://cpttmm.com/forum?page=2", (target as NavigationTarget.Internal).uri.toString())
    }

    @Test
    fun `keeps both configured domains internal`() {
        assumeFalse(BuildConfig.DEBUG)
        assertTrue(DomainPolicy.classify("https://cpttmm.com/") is NavigationTarget.Internal)
        assertTrue(DomainPolicy.classify("https://cpttmm.love/thread/1") is NavigationTarget.Internal)
    }

    @Test
    fun `extracts the current path from internal navigation`() {
        val origin = DomainPolicy.home(AppDomain.PRIMARY).toString().trimEnd('/')

        assertEquals(
            "/thread/1?page=2#reply-3",
            DomainPolicy.internalPath("$origin/thread/1?page=2#reply-3"),
        )
        assertEquals("/", DomainPolicy.internalPath(origin))
        assertEquals(null, DomainPolicy.internalPath("https://example.com/thread/1"))
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
        assumeFalse(BuildConfig.DEBUG)
        assertEquals(
            "https://cpttmm.com/thread/1",
            (DomainPolicy.classify("https://cpttmm.com:443/thread/1") as NavigationTarget.Internal)
                .uri.toString(),
        )
        assertEquals(NavigationTarget.Blocked, DomainPolicy.classify("https://cpttmm.com:8443/thread/1"))
        assertEquals(NavigationTarget.Blocked, DomainPolicy.classify("https://user@cpttmm.com/thread/1"))
    }

    @Test
    fun `development build trusts only its fixed server origin`() {
        assumeTrue(BuildConfig.DEBUG)

        val localOrigin = BuildConfig.DEVELOPMENT_SERVER_ORIGIN.trimEnd('/')
        assertEquals(localOrigin, DomainPolicy.home(AppDomain.PRIMARY).toString().trimEnd('/'))
        assertEquals(localOrigin, DomainPolicy.home(AppDomain.FALLBACK).toString().trimEnd('/'))
        assertTrue(DomainPolicy.classify("$localOrigin/thread/1") is NavigationTarget.Internal)
        assertEquals(NavigationTarget.Blocked, DomainPolicy.classify("http://127.0.0.2/thread/1"))
        assertTrue(DomainPolicy.classify(BuildConfig.PRODUCTION_PRIMARY_ORIGIN) is NavigationTarget.External)
        assertTrue(DomainPolicy.classify(BuildConfig.PRODUCTION_FALLBACK_ORIGIN) is NavigationTarget.External)
        assertEquals(setOf(localOrigin), DomainPolicy.trustedOrigins)
    }

    @Test
    fun `release build has no development server origin`() {
        assumeFalse(BuildConfig.DEBUG)

        assertTrue(BuildConfig.DEVELOPMENT_SERVER_ORIGIN.isBlank())
        assertEquals(
            setOf(BuildConfig.PRODUCTION_PRIMARY_ORIGIN, BuildConfig.PRODUCTION_FALLBACK_ORIGIN),
            DomainPolicy.trustedOrigins,
        )
    }
}
