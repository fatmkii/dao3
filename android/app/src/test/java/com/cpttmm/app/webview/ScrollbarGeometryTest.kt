package com.cpttmm.app.webview

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class ScrollbarGeometryTest {
    @Test
    fun hidesThumbWhenContentDoesNotScroll() {
        assertNull(
            ScrollbarGeometry.thumb(
                trackHeight = 1000f,
                scrollExtent = 1000,
                scrollRange = 1000,
                scrollOffset = 0,
                minimumHeight = 48f,
            ),
        )
    }

    @Test
    fun positionsThumbFromScrollProgress() {
        val thumb = requireNotNull(
            ScrollbarGeometry.thumb(
                trackHeight = 1000f,
                scrollExtent = 1000,
                scrollRange = 4000,
                scrollOffset = 1500,
                minimumHeight = 48f,
            ),
        )

        assertEquals(375f, thumb.top, 0.001f)
        assertEquals(250f, thumb.height, 0.001f)
    }

    @Test
    fun keepsThumbUsableForLongPages() {
        val thumb = requireNotNull(
            ScrollbarGeometry.thumb(
                trackHeight = 1000f,
                scrollExtent = 1000,
                scrollRange = 100_000,
                scrollOffset = 0,
                minimumHeight = 48f,
            ),
        )

        assertEquals(48f, thumb.height, 0.001f)
    }

    @Test
    fun mapsThumbTravelToEntireScrollRange() {
        assertEquals(
            0,
            ScrollbarGeometry.scrollOffset(
                thumbTop = -20f,
                trackHeight = 1000f,
                thumbHeight = 250f,
                scrollExtent = 1000,
                scrollRange = 4000,
            )
        )
        assertEquals(
            3000,
            ScrollbarGeometry.scrollOffset(
                thumbTop = 900f,
                trackHeight = 1000f,
                thumbHeight = 250f,
                scrollExtent = 1000,
                scrollRange = 4000,
            )
        )
    }
}
