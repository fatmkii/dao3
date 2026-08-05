package com.cpttmm.app.ui

internal enum class BottomBarVisibilityChange {
    SHOW,
    HIDE,
}

internal class BottomBarScrollBehavior(
    private val hideThresholdPx: Int,
    private val showThresholdPx: Int,
) {
    private var accumulatedDelta = 0
    private var direction = 0

    init {
        require(hideThresholdPx > 0)
        require(showThresholdPx > 0)
    }

    fun onScroll(
        scrollY: Int,
        oldScrollY: Int,
        userInitiated: Boolean,
        bottomBarVisible: Boolean,
    ): BottomBarVisibilityChange? {
        if (scrollY <= 0) {
            reset()
            return if (bottomBarVisible) null else BottomBarVisibilityChange.SHOW
        }
        if (!userInitiated) {
            reset()
            return null
        }

        val delta = scrollY - oldScrollY
        if (delta == 0) return null

        val nextDirection = if (delta > 0) 1 else -1
        if (direction != nextDirection) {
            accumulatedDelta = 0
            direction = nextDirection
        }
        accumulatedDelta += kotlin.math.abs(delta)

        val change =
            when {
                bottomBarVisible && direction > 0 && accumulatedDelta >= hideThresholdPx ->
                    BottomBarVisibilityChange.HIDE
                !bottomBarVisible && direction < 0 && accumulatedDelta >= showThresholdPx ->
                    BottomBarVisibilityChange.SHOW
                else -> null
            }
        if (change != null) reset()
        return change
    }

    fun reset() {
        accumulatedDelta = 0
        direction = 0
    }
}
