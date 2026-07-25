package com.cpttmm.app.webview

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class WebAuthScriptTest {
    @Test
    fun `document start script escapes untrusted values`() {
        val script = WebAuthScript.documentStart(
            binggan = "b\"</script>\n",
            accessToken = "token\\'\u2028",
        )

        assertTrue(script.contains("b\\\"\\u003c/script\\u003e\\n"))
        assertTrue(script.contains("token\\\\'\\u2028"))
        assertFalse(script.contains("</script>"))
    }

    @Test
    fun `token update only writes access token and dispatches event`() {
        val script = WebAuthScript.update("access-token")

        assertTrue(script.contains("localStorage.setItem('Token',\"access-token\")"))
        assertTrue(script.contains("cpttmm:auth-updated"))
        assertFalse(script.contains("Refresh"))
        assertFalse(script.contains("Binggan"))
    }

    @Test
    fun `document start script reports history api navigation`() {
        val script = WebAuthScript.documentStart("binggan", "access-token")

        assertTrue(script.contains("navigationChanged"))
        assertTrue(script.contains("pushState"))
        assertTrue(script.contains("replaceState"))
        assertTrue(script.contains("popstate"))
    }
}
