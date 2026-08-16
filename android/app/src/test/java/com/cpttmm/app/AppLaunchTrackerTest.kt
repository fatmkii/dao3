package com.cpttmm.app

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class AppLaunchTrackerTest {
    @Test
    fun firstActivityInProcessIsEligibleEvenWhenStateWasRestored() {
        val tracker = AppLaunchTracker()

        assertTrue(tracker.shouldApplyTabRetentionPolicy(hasSavedInstanceState = true))
    }

    @Test
    fun activityRecreationWithSavedStateIsNotEligibleAfterInitialLaunch() {
        val tracker = AppLaunchTracker()

        tracker.shouldApplyTabRetentionPolicy(hasSavedInstanceState = false)

        assertFalse(tracker.shouldApplyTabRetentionPolicy(hasSavedInstanceState = true))
    }

    @Test
    fun newTaskWithoutSavedStateIsEligibleAfterExistingActivity() {
        val tracker = AppLaunchTracker()

        tracker.shouldApplyTabRetentionPolicy(hasSavedInstanceState = false)

        assertTrue(tracker.shouldApplyTabRetentionPolicy(hasSavedInstanceState = false))
    }
}
