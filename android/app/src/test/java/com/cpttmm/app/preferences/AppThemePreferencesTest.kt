package com.cpttmm.app.preferences

import org.junit.Assert.assertEquals
import org.junit.Test

class AppThemePreferencesTest {
    @Test
    fun `defaults to green manually and green dark pair when following`() {
        val preferences = AppThemePreferences()

        assertEquals(AppTheme.GREEN, preferences.themeFor(isSystemDark = false))
        assertEquals(AppTheme.GREEN, preferences.themeFor(isSystemDark = true))
        assertEquals(
            AppTheme.GREEN,
            preferences.copy(followSystem = true).themeFor(isSystemDark = false),
        )
        assertEquals(
            AppTheme.DARK,
            preferences.copy(followSystem = true).themeFor(isSystemDark = true),
        )
    }

    @Test
    fun `account home stays green unless following system`() {
        val manualBlue = AppThemePreferences(manualTheme = AppTheme.BLUE)

        assertEquals(AppTheme.GREEN, manualBlue.accountHomeTheme(isSystemDark = true))
        assertEquals(
            AppTheme.DARK,
            manualBlue.copy(followSystem = true).accountHomeTheme(isSystemDark = true),
        )
    }

    @Test
    fun `unknown stored themes are rejected`() {
        assertEquals(null, AppTheme.fromStorage("removed-theme"))
    }

    @Test
    fun `web theme change in dark mode leaves light theme unchanged`() {
        val preferences = AppThemePreferences(
            followSystem = true,
            lightTheme = AppTheme.GREEN,
            darkTheme = AppTheme.DARK,
        )

        val updated = preferences.afterWebThemeChanged(AppTheme.BLUE, isSystemDark = true)

        assertEquals(AppTheme.GREEN, updated.lightTheme)
        assertEquals(AppTheme.BLUE, updated.darkTheme)
        assertEquals(AppTheme.BLUE, updated.manualTheme)
    }

    @Test
    fun `web theme change in light mode leaves dark theme unchanged`() {
        val preferences = AppThemePreferences(
            followSystem = true,
            lightTheme = AppTheme.GREEN,
            darkTheme = AppTheme.DARK,
        )

        val updated = preferences.afterWebThemeChanged(AppTheme.SFW, isSystemDark = false)

        assertEquals(AppTheme.SFW, updated.lightTheme)
        assertEquals(AppTheme.DARK, updated.darkTheme)
        assertEquals(AppTheme.SFW, updated.manualTheme)
    }
}
