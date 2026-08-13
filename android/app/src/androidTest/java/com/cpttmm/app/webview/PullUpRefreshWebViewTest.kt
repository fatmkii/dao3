package com.cpttmm.app.webview

import android.os.SystemClock
import android.view.InputDevice
import android.view.MotionEvent
import android.view.ViewGroup
import android.webkit.WebViewClient
import androidx.test.core.app.ActivityScenario
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.cpttmm.app.BuildConfig
import com.cpttmm.app.MainActivity
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

@RunWith(AndroidJUnit4::class)
class PullUpRefreshWebViewTest {
    @Test
    fun shortPageRefreshesOnlyAfterSingleFingerVerticalPullPassesThreshold() {
        val scenario = ActivityScenario.launch(MainActivity::class.java)
        val pageReady = CountDownLatch(1)
        var refreshes = 0
        lateinit var view: DraggableScrollbarWebView

        scenario.onActivity { activity ->
            view = DraggableScrollbarWebView(activity).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT,
                )
                webViewClient = object : WebViewClient() {
                    override fun onPageFinished(webView: android.webkit.WebView, url: String) {
                        pageReady.countDown()
                    }
                }
                setOnPullUpRefreshListener { refreshes += 1 }
            }
            activity.setContentView(view)
            view.loadDataWithBaseURL(
                BuildConfig.DEVELOPMENT_SERVER_ORIGIN,
                "<html><body>short page</body></html>",
                "text/html",
                "UTF-8",
                null,
            )
        }

        try {
            assertTrue(pageReady.await(5, TimeUnit.SECONDS))
            scenario.onActivity {
                assertFalse(view.canScrollVertically(1))
                val density = view.resources.displayMetrics.density
                drag(view, horizontalDp = 0f, upwardDp = 48f, density = density)
                assertEquals(0, refreshes)
                drag(view, horizontalDp = 80f, upwardDp = 8f, density = density)
                assertEquals(0, refreshes)
                multiPointerDrag(view, upwardDp = 80f, density = density)
                assertEquals(0, refreshes)
                drag(view, horizontalDp = 0f, upwardDp = 80f, density = density)
                assertEquals(1, refreshes)
            }
        } finally {
            scenario.onActivity { view.destroy() }
            scenario.close()
        }
    }

    @Test
    fun longPageRequiresBottomBeforePullCanRefresh() {
        val scenario = ActivityScenario.launch(MainActivity::class.java)
        val pageReady = CountDownLatch(1)
        val bottomReady = CountDownLatch(1)
        var refreshes = 0
        lateinit var view: DraggableScrollbarWebView

        scenario.onActivity { activity ->
            view = DraggableScrollbarWebView(activity).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT,
                )
                webViewClient = object : WebViewClient() {
                    override fun onPageFinished(webView: android.webkit.WebView, url: String) {
                        countDownWhenScrollable(webView, pageReady)
                    }
                }
                setOnPullUpRefreshListener { refreshes += 1 }
            }
            activity.setContentView(view)
            view.loadDataWithBaseURL(
                BuildConfig.DEVELOPMENT_SERVER_ORIGIN,
                "<html><body><div style='height:5000px'>long page</div></body></html>",
                "text/html",
                "UTF-8",
                null,
            )
        }

        try {
            assertTrue(pageReady.await(5, TimeUnit.SECONDS))
            scenario.onActivity {
                assertTrue(view.canScrollVertically(1))
                val density = view.resources.displayMetrics.density
                drag(view, horizontalDp = 0f, upwardDp = 80f, density = density)
                assertEquals(0, refreshes)

                view.pageDown(true)
                countDownWhenAtBottom(view, bottomReady)
            }
            assertTrue(bottomReady.await(5, TimeUnit.SECONDS))
            scenario.onActivity {
                assertFalse(view.canScrollVertically(1))
                val density = view.resources.displayMetrics.density
                drag(view, horizontalDp = 0f, upwardDp = 80f, density = density)
                assertEquals(1, refreshes)
            }
        } finally {
            scenario.onActivity { view.destroy() }
            scenario.close()
        }
    }

    private fun drag(
        view: DraggableScrollbarWebView,
        horizontalDp: Float,
        upwardDp: Float,
        density: Float,
    ) {
        val downTime = SystemClock.uptimeMillis()
        val startX = view.width * 0.5f
        val startY = view.height * 0.75f
        dispatchSingle(view, downTime, downTime, MotionEvent.ACTION_DOWN, startX, startY)
        dispatchSingle(
            view,
            downTime,
            downTime + 16,
            MotionEvent.ACTION_MOVE,
            startX + horizontalDp * density,
            startY - upwardDp * density,
        )
        dispatchSingle(
            view,
            downTime,
            downTime + 32,
            MotionEvent.ACTION_UP,
            startX + horizontalDp * density,
            startY - upwardDp * density,
        )
    }

    private fun multiPointerDrag(
        view: DraggableScrollbarWebView,
        upwardDp: Float,
        density: Float,
    ) {
        val downTime = SystemClock.uptimeMillis()
        val startX = view.width * 0.5f
        val startY = view.height * 0.75f
        dispatchSingle(view, downTime, downTime, MotionEvent.ACTION_DOWN, startX, startY)

        val properties =
            arrayOf(
                MotionEvent.PointerProperties().apply {
                    id = 0
                    toolType = MotionEvent.TOOL_TYPE_FINGER
                },
                MotionEvent.PointerProperties().apply {
                    id = 1
                    toolType = MotionEvent.TOOL_TYPE_FINGER
                },
            )
        val coordinates =
            arrayOf(
                MotionEvent.PointerCoords().apply {
                    x = startX
                    y = startY
                },
                MotionEvent.PointerCoords().apply {
                    x = startX + 24f * density
                    y = startY
                },
            )
        dispatchMulti(
            view,
            downTime,
            downTime + 8,
            MotionEvent.ACTION_POINTER_DOWN or (1 shl MotionEvent.ACTION_POINTER_INDEX_SHIFT),
            properties,
            coordinates,
        )
        coordinates.forEach { it.y -= upwardDp * density }
        dispatchMulti(
            view,
            downTime,
            downTime + 16,
            MotionEvent.ACTION_MOVE,
            properties,
            coordinates,
        )
        dispatchSingle(
            view,
            downTime,
            downTime + 32,
            MotionEvent.ACTION_UP,
            coordinates[0].x,
            coordinates[0].y,
        )
    }

    private fun dispatchSingle(
        view: DraggableScrollbarWebView,
        downTime: Long,
        eventTime: Long,
        action: Int,
        x: Float,
        y: Float,
    ) {
        MotionEvent.obtain(downTime, eventTime, action, x, y, 0).also { event ->
            event.source = InputDevice.SOURCE_TOUCHSCREEN
            view.dispatchTouchEvent(event)
            event.recycle()
        }
    }

    private fun dispatchMulti(
        view: DraggableScrollbarWebView,
        downTime: Long,
        eventTime: Long,
        action: Int,
        properties: Array<MotionEvent.PointerProperties>,
        coordinates: Array<MotionEvent.PointerCoords>,
    ) {
        MotionEvent.obtain(
            downTime,
            eventTime,
            action,
            properties.size,
            properties,
            coordinates,
            0,
            0,
            1f,
            1f,
            0,
            0,
            InputDevice.SOURCE_TOUCHSCREEN,
            0,
        ).also { event ->
            view.dispatchTouchEvent(event)
            event.recycle()
        }
    }

    private fun countDownWhenScrollable(
        view: android.webkit.WebView,
        latch: CountDownLatch,
        remainingAttempts: Int = 100,
    ) {
        when {
            view.canScrollVertically(1) -> latch.countDown()
            remainingAttempts > 0 ->
                view.postDelayed(
                    { countDownWhenScrollable(view, latch, remainingAttempts - 1) },
                    16,
                )
        }
    }

    private fun countDownWhenAtBottom(
        view: android.webkit.WebView,
        latch: CountDownLatch,
        remainingAttempts: Int = 100,
    ) {
        when {
            !view.canScrollVertically(1) -> latch.countDown()
            remainingAttempts > 0 ->
                view.postDelayed(
                    { countDownWhenAtBottom(view, latch, remainingAttempts - 1) },
                    16,
                )
        }
    }
}
