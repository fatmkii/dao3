package com.cpttmm.app.webview

import org.junit.Assert.assertEquals
import org.junit.Test

class WebFileChooserTest {
    @Test
    fun `single image wildcard uses photo picker`() {
        assertEquals(
            WebFileChooserRoute.PHOTO_PICKER,
            webFileChooserRoute(arrayOf("image/*"), isSingleOpenRequest = true),
        )
    }

    @Test
    fun `non-image and multiple requests use generic chooser`() {
        assertEquals(
            WebFileChooserRoute.GENERIC_CHOOSER,
            webFileChooserRoute(arrayOf("application/pdf"), isSingleOpenRequest = true),
        )
        assertEquals(
            WebFileChooserRoute.GENERIC_CHOOSER,
            webFileChooserRoute(arrayOf("image/*"), isSingleOpenRequest = false),
        )
    }

    @Test
    fun `cancel completes callback with null and permits another selection`() {
        val received = mutableListOf<String?>()
        val pending = PendingWebFileChooser<String>()

        pending.replace(received::add)
        pending.complete(null)
        pending.replace(received::add)
        pending.complete("content://second")

        assertEquals(listOf(null, "content://second"), received)
    }

    @Test
    fun `replacing and destroying pending chooser release callbacks`() {
        val first = mutableListOf<String?>()
        val second = mutableListOf<String?>()
        val pending = PendingWebFileChooser<String>()

        pending.replace(first::add)
        pending.replace(second::add)
        pending.clear()

        assertEquals(listOf<String?>(null), first)
        assertEquals(listOf<String?>(null), second)
    }
}
