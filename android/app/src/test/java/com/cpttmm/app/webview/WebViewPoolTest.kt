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
            index.toString() to pool.getOrCreate(index.toString()) { FakeHost() }
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
        val first = pool.getOrCreate("first") { FakeHost() }
        val second = pool.getOrCreate("second") { FakeHost() }
        val active = pool.getOrCreate("active") { FakeHost() }
        pool.activate("active", emptyMap())

        pool.trimToActive()

        assertTrue(first.destroyed)
        assertTrue(second.destroyed)
        assertFalse(active.destroyed)
    }

    @Test
    fun `closing a tab can skip state persistence`() {
        val pool = WebViewPool<FakeHost>()
        val host = pool.getOrCreate("closed") { FakeHost() }

        pool.remove("closed", saveState = false)

        assertTrue(host.destroyed)
        assertEquals(false, host.savedOnDestroy)
    }

    @Test
    fun `resumes active host after every background host is paused`() {
        val events = mutableListOf<String>()
        val pool = WebViewPool<FakeHost>()
        pool.getOrCreate("active") { FakeHost("active", events) }
        pool.getOrCreate("background") { FakeHost("background", events) }

        pool.activate("active", emptyMap())

        assertEquals(listOf("pause:background", "resume:active"), events)
    }

    @Test
    fun `updates access token in every pooled host`() {
        val pool = WebViewPool<FakeHost>()
        val first = pool.getOrCreate("first") { FakeHost() }
        val second = pool.getOrCreate("second") { FakeHost() }

        pool.updateAccessToken("refreshed-token")

        assertEquals("refreshed-token", first.accessToken)
        assertEquals("refreshed-token", second.accessToken)
    }

    private class FakeHost(
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
