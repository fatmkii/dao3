package com.cpttmm.app.webview

import android.animation.ValueAnimator
import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RectF
import android.view.MotionEvent
import android.view.animation.DecelerateInterpolator
import android.webkit.WebView
import kotlin.math.roundToInt

internal data class ScrollbarThumb(
    val top: Float,
    val height: Float,
)

internal object ScrollbarGeometry {
    fun thumb(
        trackHeight: Float,
        scrollExtent: Int,
        scrollRange: Int,
        scrollOffset: Int,
        minimumHeight: Float,
    ): ScrollbarThumb? {
        if (trackHeight <= 0f || scrollExtent <= 0 || scrollRange <= scrollExtent) return null

        val height = (trackHeight * scrollExtent / scrollRange)
            .coerceIn(minimumHeight.coerceAtMost(trackHeight), trackHeight)
        val travel = trackHeight - height
        val progress = scrollOffset.coerceIn(0, scrollRange - scrollExtent).toFloat() /
            (scrollRange - scrollExtent)
        return ScrollbarThumb(top = travel * progress, height = height)
    }

    fun scrollOffset(
        thumbTop: Float,
        trackHeight: Float,
        thumbHeight: Float,
        scrollExtent: Int,
        scrollRange: Int,
    ): Int {
        val travel = trackHeight - thumbHeight
        if (travel <= 0f || scrollRange <= scrollExtent) return 0

        val progress = thumbTop.coerceIn(0f, travel) / travel
        return (progress * (scrollRange - scrollExtent)).roundToInt()
    }
}

internal class DraggableScrollbarWebView(context: Context) : WebView(context) {
    private val density = resources.displayMetrics.density
    private val trackPadding = 4f * density
    private val thumbWidth = 5f * density
    private val thumbInset = 3f * density
    private val minimumThumbHeight = 48f * density
    private val touchTargetWidth = 48f * density
    private val touchTargetHeight = 48f * density
    private val thumbRect = RectF()
    private val thumbPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.rgb(97, 97, 97)
    }
    private val outlinePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.WHITE
        style = Paint.Style.STROKE
        strokeWidth = density
    }
    private val hideScrollbar = Runnable { animateScrollbarTo(0f) }
    private val finishUserScroll = Runnable {
        userScrollActive = false
        expectedScrollDirection = 0
    }

    private var scrollbarAlpha = 0f
    private var fadeAnimator: ValueAnimator? = null
    private var draggingScrollbar = false
    private var dragGrabOffset = 0f
    private var touchInProgress = false
    private var userScrollActive = false
    private var lastTouchY = 0f
    private var expectedScrollDirection = 0
    private var onVerticalScrollChanged: ((Int, Int, Boolean) -> Unit)? = null

    init {
        isVerticalScrollBarEnabled = false
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val thumb = currentThumb() ?: return
        if (scrollbarAlpha <= 0f) return

        // onDraw uses the WebView's scrolled content coordinates. Offset the thumb back into
        // the visible viewport so its position reflects the page's scroll progress.
        val right = scrollX + width - thumbInset
        val viewportTop = scrollY + trackPadding + thumb.top
        thumbRect.set(
            right - thumbWidth,
            viewportTop,
            right,
            viewportTop + thumb.height,
        )
        val radius = thumbWidth / 2f
        thumbPaint.alpha = (255 * scrollbarAlpha).roundToInt()
        outlinePaint.alpha = (180 * scrollbarAlpha).roundToInt()
        canvas.drawRoundRect(thumbRect, radius, radius, thumbPaint)
        canvas.drawRoundRect(thumbRect, radius, radius, outlinePaint)
    }

    override fun onScrollChanged(left: Int, top: Int, oldLeft: Int, oldTop: Int) {
        super.onScrollChanged(left, top, oldLeft, oldTop)
        if (top == oldTop) return
        if (!draggingScrollbar) showScrollbarTemporarily()
        val scrollDirection = if (top > oldTop) 1 else -1
        val userInitiated = userScrollActive && scrollDirection == expectedScrollDirection
        onVerticalScrollChanged?.invoke(top, oldTop, userInitiated)
        if (userScrollActive && !touchInProgress) scheduleUserScrollEnd()
    }

    @SuppressLint("ClickableViewAccessibility")
    override fun onTouchEvent(event: MotionEvent): Boolean {
        when (event.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                touchInProgress = true
                userScrollActive = true
                lastTouchY = event.y
                expectedScrollDirection = 0
                removeCallbacks(finishUserScroll)
            }
            MotionEvent.ACTION_MOVE -> {
                val fingerDelta = event.y - lastTouchY
                if (fingerDelta != 0f) {
                    expectedScrollDirection =
                        if (draggingScrollbar) {
                            if (fingerDelta > 0f) 1 else -1
                        } else {
                            if (fingerDelta > 0f) -1 else 1
                        }
                    lastTouchY = event.y
                }
            }
            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                touchInProgress = false
                scheduleUserScrollEnd()
            }
        }

        if (draggingScrollbar) {
            when (event.actionMasked) {
                MotionEvent.ACTION_MOVE -> dragScrollbarTo(event.y)
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> finishScrollbarDrag()
            }
            return true
        }

        if (event.actionMasked == MotionEvent.ACTION_DOWN && isScrollbarHit(event.x, event.y)) {
            val thumb = currentThumb() ?: return super.onTouchEvent(event)
            dragGrabOffset = event.y - trackPadding - thumb.top
            draggingScrollbar = true
            parent?.requestDisallowInterceptTouchEvent(true)
            showScrollbar()
            return true
        }

        return super.onTouchEvent(event)
    }

    override fun onDetachedFromWindow() {
        removeCallbacks(hideScrollbar)
        removeCallbacks(finishUserScroll)
        touchInProgress = false
        userScrollActive = false
        expectedScrollDirection = 0
        fadeAnimator?.cancel()
        super.onDetachedFromWindow()
    }

    fun setOnVerticalScrollChangedListener(listener: ((Int, Int, Boolean) -> Unit)?) {
        onVerticalScrollChanged = listener
    }

    private fun currentThumb(): ScrollbarThumb? = ScrollbarGeometry.thumb(
        trackHeight = (height - 2 * trackPadding).coerceAtLeast(0f),
        scrollExtent = computeVerticalScrollExtent(),
        scrollRange = computeVerticalScrollRange(),
        scrollOffset = scrollY,
        minimumHeight = minimumThumbHeight,
    )

    private fun isScrollbarHit(x: Float, y: Float): Boolean {
        if (scrollbarAlpha <= 0f || x < width - touchTargetWidth) return false
        val thumb = currentThumb() ?: return false
        val top = trackPadding + thumb.top
        val extraHeight = ((touchTargetHeight - thumb.height) / 2f).coerceAtLeast(0f)
        return y in (top - extraHeight)..(top + thumb.height + extraHeight)
    }

    private fun dragScrollbarTo(y: Float) {
        val scrollExtent = computeVerticalScrollExtent()
        val scrollRange = computeVerticalScrollRange()
        val trackHeight = (height - 2 * trackPadding).coerceAtLeast(0f)
        val thumb = ScrollbarGeometry.thumb(
            trackHeight = trackHeight,
            scrollExtent = scrollExtent,
            scrollRange = scrollRange,
            scrollOffset = scrollY,
            minimumHeight = minimumThumbHeight,
        ) ?: return
        val target = ScrollbarGeometry.scrollOffset(
            thumbTop = y - trackPadding - dragGrabOffset,
            trackHeight = trackHeight,
            thumbHeight = thumb.height,
            scrollExtent = scrollExtent,
            scrollRange = scrollRange,
        )
        scrollTo(scrollX, target)
        showScrollbar()
    }

    private fun finishScrollbarDrag() {
        draggingScrollbar = false
        parent?.requestDisallowInterceptTouchEvent(false)
        showScrollbarTemporarily()
    }

    private fun showScrollbarTemporarily() {
        showScrollbar()
        postDelayed(hideScrollbar, SCROLLBAR_HIDE_DELAY_MILLIS)
    }

    private fun showScrollbar() {
        removeCallbacks(hideScrollbar)
        fadeAnimator?.cancel()
        scrollbarAlpha = 1f
        invalidate()
    }

    private fun animateScrollbarTo(targetAlpha: Float) {
        fadeAnimator?.cancel()
        fadeAnimator = ValueAnimator.ofFloat(scrollbarAlpha, targetAlpha).apply {
            duration = SCROLLBAR_FADE_DURATION_MILLIS
            interpolator = DecelerateInterpolator()
            addUpdateListener {
                scrollbarAlpha = it.animatedValue as Float
                invalidate()
            }
            start()
        }
    }

    private fun scheduleUserScrollEnd() {
        removeCallbacks(finishUserScroll)
        postDelayed(finishUserScroll, USER_SCROLL_END_DELAY_MILLIS)
    }

    private companion object {
        const val SCROLLBAR_HIDE_DELAY_MILLIS = 800L
        const val SCROLLBAR_FADE_DURATION_MILLIS = 200L
        const val USER_SCROLL_END_DELAY_MILLIS = 150L
    }
}
