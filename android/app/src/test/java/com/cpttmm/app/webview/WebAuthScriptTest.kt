package com.cpttmm.app.webview

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class WebAuthScriptTest {
    @Test
    fun `bootstrap message preserves untrusted values as json`() {
        val message = WebAuthScript.bootstrapMessage(
            storageNamespace = "storage\"</script>",
            binggan = "b\"</script>\n",
            accessToken = "token\\'\u2028",
            pendingStorageNamespaces = setOf("old-one"),
        )
        assertTrue(message.contains("\"storageNamespace\":\"storage\\\"\\u003c/script\\u003e\""))
        assertTrue(message.contains("\"binggan\":\"b\\\"\\u003c/script\\u003e\\n\""))
        assertTrue(message.contains("\"accessToken\":\"token\\\\'\\u2028\""))
        assertTrue(message.contains("\"pendingStorageNamespaces\":[\"old-one\"]"))
        assertFalse(message.contains("</script>"))
    }

    @Test
    fun `token update only dispatches escaped access token to memory context`() {
        val script = WebAuthScript.update("access-token")

        assertTrue(script.contains("accessToken:\"access-token\""))
        assertTrue(script.contains("cpttmm:auth-updated"))
        assertFalse(script.contains("localStorage"))
        assertFalse(script.contains("Refresh"))
        assertFalse(script.contains("Binggan"))
    }

    @Test
    fun `token update escapes script breaking values`() {
        val script = WebAuthScript.update("\"</script>\n\u2028")

        assertTrue(script.contains("\\\"\\u003c/script\\u003e\\n\\u2028"))
        assertFalse(script.contains("</script>"))
    }
}
