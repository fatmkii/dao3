package com.cpttmm.app.preferences

enum class AppTheme(
    val storageValue: String,
    val displayName: String,
) {
    SFW("sfw", "魔芋锅"),
    LIGHT("light", "白汤锅"),
    DARK("dark", "芝麻锅"),
    GREEN("green", "青菜锅"),
    BLUE("blue", "甘蓝锅"),
    ;

    companion object {
        fun fromStorage(value: String?): AppTheme? = entries.firstOrNull { it.storageValue == value }
    }
}

data class AppThemePreferences(
    val followSystem: Boolean = false,
    val lightTheme: AppTheme = AppTheme.GREEN,
    val darkTheme: AppTheme = AppTheme.DARK,
    val manualTheme: AppTheme = AppTheme.GREEN,
    val initialized: Boolean = false,
    val requiresRepair: Boolean = false,
) {
    fun themeFor(isSystemDark: Boolean): AppTheme =
        if (followSystem) {
            if (isSystemDark) darkTheme else lightTheme
        } else {
            manualTheme
        }

    fun accountHomeTheme(isSystemDark: Boolean): AppTheme =
        if (followSystem) themeFor(isSystemDark) else AppTheme.GREEN

    fun afterWebThemeChanged(theme: AppTheme, isSystemDark: Boolean): AppThemePreferences =
        copy(
            lightTheme = if (followSystem && !isSystemDark) theme else lightTheme,
            darkTheme = if (followSystem && isSystemDark) theme else darkTheme,
            manualTheme = theme,
        )
}
