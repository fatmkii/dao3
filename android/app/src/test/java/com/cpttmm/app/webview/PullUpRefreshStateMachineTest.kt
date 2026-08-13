package com.cpttmm.app.webview

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class PullUpRefreshStateMachineTest {
    private fun machine() = PullUpRefreshStateMachine(
        thresholdPx = 64f,
        maximumDistancePx = 112f,
        resistanceAfterThreshold = 0.35f,
    )

    @Test
    fun `pull follows finger until threshold then applies resistance and caps distance`() {
        val machine = machine()

        assertEquals(32f, machine.pull(32f).state.distancePx, 0.001f)
        assertEquals(99f, machine.pull(164f).state.distancePx, 0.001f)
        assertEquals(112f, machine.pull(400f).state.distancePx, 0.001f)
    }

    @Test
    fun `crossing threshold arms refresh and requests haptic only once per gesture`() {
        val machine = machine()

        assertEquals(PullUpRefreshPhase.PULLING, machine.pull(63f).state.phase)
        val armed = machine.pull(64f)
        assertEquals(PullUpRefreshPhase.ARMED, armed.state.phase)
        assertTrue(armed.shouldHaptic)
        assertFalse(machine.pull(80f).shouldHaptic)
        assertEquals(PullUpRefreshPhase.PULLING, machine.pull(40f).state.phase)
        assertFalse(machine.pull(70f).shouldHaptic)
    }

    @Test
    fun `release refreshes only while armed and only once`() {
        val machine = machine()
        machine.pull(80f)

        val released = machine.release(cancelled = false)

        assertTrue(released.shouldRefresh)
        assertEquals(PullUpRefreshPhase.REFRESHING, released.state.phase)
        assertFalse(machine.release(cancelled = false).shouldRefresh)
    }

    @Test
    fun `release below threshold and cancellation do not refresh`() {
        val belowThreshold = machine()
        belowThreshold.pull(63f)
        assertFalse(belowThreshold.release(cancelled = false).shouldRefresh)
        assertEquals(PullUpRefreshPhase.PULLING, belowThreshold.state.phase)

        val cancelled = machine()
        cancelled.pull(80f)
        assertFalse(cancelled.release(cancelled = true).shouldRefresh)
        assertEquals(PullUpRefreshPhase.PULLING, cancelled.state.phase)
    }

    @Test
    fun `begin resets one-shot gesture state`() {
        val machine = machine()
        machine.pull(80f)
        machine.release(cancelled = false)

        machine.begin()
        val armedAgain = machine.pull(80f)

        assertTrue(armedAgain.shouldHaptic)
        assertTrue(machine.release(cancelled = false).shouldRefresh)
    }

    @Test
    fun `settling reaches idle at zero`() {
        val machine = machine()
        machine.pull(40f)
        machine.release(cancelled = false)

        assertEquals(PullUpRefreshPhase.PULLING, machine.updateSettlingDistance(20f).state.phase)
        assertEquals(PullUpRefreshState(), machine.updateSettlingDistance(0f).state)
    }
}
