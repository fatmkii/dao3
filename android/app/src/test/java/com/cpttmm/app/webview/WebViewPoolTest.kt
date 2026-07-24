package com.cpttmm.app.webview

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class WebViewPoolTest {
    @Test
    fun `keeps active and two most recently used hosts`() {
        val pool = WebViewPool<FakeHost>()
        val hosts = (1..4).associate { index ->
            index.toString() to pool.getOrCreate(index.toString(), "account") { FakeHost() }
        }

        pool.activate(
            tabId = "4",
            lastUsedAtMillis = mapOf("1" to 1L, "2" to 2L, "3" to 3L, "4" to 4L),
        )

        assertTrue(hosts.getValue("1").destroyed)
        assertFalse(hosts.getValue("2").destroyed)
        assertFalse(hosts.getValue("3").destroyed)
        assertTrue(hosts.getValue("4").resumed)
        assertTrue(hosts.getValue("2").paused)
        assertTrue(hosts.getValue("3").paused)
    }

    @Test
    fun `memory trim destroys every background host`() {
        val pool = WebViewPool<FakeHost>()
        val first = pool.getOrCreate("first", "account") { FakeHost() }
        val second = pool.getOrCreate("second", "account") { FakeHost() }
        val active = pool.getOrCreate("active", "account") { FakeHost() }
        pool.activate("active", emptyMap())

        pool.trimToActive()

        assertTrue(first.destroyed)
        assertTrue(second.destroyed)
        assertFalse(active.destroyed)
    }

    @Test
    fun `closing a tab can skip state persistence`() {
        val pool = WebViewPool<FakeHost>()
        val host = pool.getOrCreate("closed", "account") { FakeHost() }

        pool.remove("closed", saveState = false)

        assertTrue(host.destroyed)
        assertEquals(false, host.savedOnDestroy)
    }

    @Test
    fun `resumes active host after every background host is paused`() {
        val events = mutableListOf<String>()
        val pool = WebViewPool<FakeHost>()
        pool.getOrCreate("active", "account") { FakeHost(name = "active", events = events) }
        pool.getOrCreate("background", "account") { FakeHost(name = "background", events = events) }

        pool.activate("active", emptyMap())

        assertEquals(listOf("pause:background", "resume:active"), events)
    }

    @Test
    fun `updates access token only in hosts for the selected account`() {
        val pool = WebViewPool<FakeHost>()
        val first = pool.getOrCreate("first", "first-account") { FakeHost("first-account") }
        val second = pool.getOrCreate("second", "second-account") { FakeHost("second-account") }

        pool.updateAccessToken("first-account", "refreshed-token")

        assertEquals("refreshed-token", first.accessToken)
        assertEquals(null, second.accessToken)
    }

    @Test
    fun `replaces a tab host when its account changes`() {
        val pool = WebViewPool<FakeHost>()
        val old = pool.getOrCreate("tab", "old") { FakeHost("old") }
        val replacement = pool.getOrCreate("tab", "new") { FakeHost("new") }

        assertTrue(old.destroyed)
        assertEquals(false, old.savedOnDestroy)
        assertEquals("new", replacement.accountId)
    }

    private class FakeHost(
        override val accountId: String = "account",
        private val name: String = "host",
        private val events: MutableList<String>? = null,
    ) : PooledWebViewHost {
        var paused = false
        var resumed = false
        var destroyed = false
        var savedOnDestroy: Boolean? = null
        var accessToken: String? = null

        override fun pause() {
            paused = true
            events?.add("pause:$name")
        }

        override fun resume() {
            resumed = true
            events?.add("resume:$name")
        }

        override fun updateAccessToken(accessToken: String) {
            this.accessToken = accessToken
        }

        override fun destroy(saveState: Boolean) {
            destroyed = true
            savedOnDestroy = saveState
        }
    }
}
