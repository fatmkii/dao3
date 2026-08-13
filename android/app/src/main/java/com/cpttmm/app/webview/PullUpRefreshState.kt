package com.cpttmm.app.webview

internal enum class PullUpRefreshPhase {
    IDLE,
    PULLING,
    ARMED,
    REFRESHING,
}

internal data class PullUpRefreshState(
    val phase: PullUpRefreshPhase = PullUpRefreshPhase.IDLE,
    val distancePx: Float = 0f,
)

internal data class PullUpRefreshTransition(
    val state: PullUpRefreshState,
    val shouldHaptic: Boolean = false,
    val shouldRefresh: Boolean = false,
)

internal class PullUpRefreshStateMachine(
    private val thresholdPx: Float,
    private val maximumDistancePx: Float,
    private val resistanceAfterThreshold: Float,
) {
    var state = PullUpRefreshState()
        private set

    private var hapticSent = false
    private var released = false

    fun begin() {
        state = PullUpRefreshState()
        hapticSent = false
        released = false
    }

    fun pull(rawDistancePx: Float): PullUpRefreshTransition {
        if (released) return PullUpRefreshTransition(state)

        val rawDistance = rawDistancePx.coerceAtLeast(0f)
        val displayedDistance =
            if (rawDistance <= thresholdPx) {
                rawDistance
            } else {
                thresholdPx + (rawDistance - thresholdPx) * resistanceAfterThreshold
            }.coerceAtMost(maximumDistancePx)
        val phase =
            when {
                rawDistance <= 0f -> PullUpRefreshPhase.IDLE
                rawDistance < thresholdPx -> PullUpRefreshPhase.PULLING
                else -> PullUpRefreshPhase.ARMED
            }
        val shouldHaptic = phase == PullUpRefreshPhase.ARMED && !hapticSent
        if (shouldHaptic) hapticSent = true
        state = PullUpRefreshState(phase, displayedDistance)
        return PullUpRefreshTransition(state, shouldHaptic = shouldHaptic)
    }

    fun release(cancelled: Boolean): PullUpRefreshTransition {
        if (released) return PullUpRefreshTransition(state)
        released = true

        val shouldRefresh = !cancelled && state.phase == PullUpRefreshPhase.ARMED
        state =
            if (shouldRefresh) {
                state.copy(phase = PullUpRefreshPhase.REFRESHING)
            } else if (state.distancePx > 0f) {
                state.copy(phase = PullUpRefreshPhase.PULLING)
            } else {
                PullUpRefreshState()
            }
        return PullUpRefreshTransition(state, shouldRefresh = shouldRefresh)
    }

    fun updateSettlingDistance(distancePx: Float): PullUpRefreshTransition {
        val distance = distancePx.coerceAtLeast(0f)
        state =
            if (distance == 0f) {
                PullUpRefreshState()
            } else {
                state.copy(distancePx = distance)
            }
        return PullUpRefreshTransition(state)
    }
}
