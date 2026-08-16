package com.cpttmm.app

internal class AppLaunchTracker {
    private var hasCreatedActivity = false

    @Synchronized
    fun shouldApplyTabRetentionPolicy(hasSavedInstanceState: Boolean): Boolean {
        val firstActivityInProcess = !hasCreatedActivity
        hasCreatedActivity = true
        return firstActivityInProcess || !hasSavedInstanceState
    }
}
