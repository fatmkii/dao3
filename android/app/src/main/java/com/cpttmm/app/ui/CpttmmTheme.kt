package com.cpttmm.app.ui

import android.app.Activity
import android.graphics.Color as AndroidColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat
import com.cpttmm.app.preferences.AppTheme

private val HotpotRed = Color(0xFF9D3529)
private val DeepBroth = Color(0xFF351C18)
private val Biscuit = Color(0xFFF2D3A2)
internal val WarmCanvas = Color(0xFFFFF8EF)
private val WarmSurface = Color(0xFFFFFCF7)

internal data class NativeThemePalette(
    val name: String?,
    val primaryColor: Color,
    val backgroundColor: Color,
)

@Composable
internal fun CpttmmTheme(
    theme: NativeThemePalette,
    content: @Composable () -> Unit,
) {
    val baseColors =
        when (theme.name) {
            "dark" -> {
                androidx.compose.material3.darkColorScheme(
                    primary = Color(0xFF77D477),
                    background = Color(0xFF101014),
                    surface = Color(0xFF2C2C32),
                )
            }

            "blue" -> {
                androidx.compose.material3.lightColorScheme(
                    primary = Color(0xFF4D7DD9),
                    background = Color(0xFFF2F5FF),
                    surface = Color(0xFFF5F7FF),
                )
            }

            "green" -> {
                androidx.compose.material3.lightColorScheme(
                    primary = Color(0xFF3A9958),
                    background = Color(0xFFEEFAEE),
                    surface = Color(0xFFFAFFFA),
                )
            }

            "sfw" -> {
                androidx.compose.material3.lightColorScheme(
                    primary = Color(0xFF333639),
                    background = Color(0xFFF5F6F8),
                    surface = Color.White,
                )
            }

            "light" -> {
                androidx.compose.material3.lightColorScheme(
                    primary = Color(0xFF32A852),
                    background = Color(0xFFF9F9F9),
                    surface = Color.White,
                )
            }

            else -> {
                androidx.compose.material3.lightColorScheme(
                    primary = HotpotRed,
                    onPrimary = Color.White,
                    secondary = Color(0xFF76552F),
                    onSecondary = Color.White,
                    background = WarmCanvas,
                    onBackground = DeepBroth,
                    surface = WarmSurface,
                    onSurface = DeepBroth,
                    error = Color(0xFFB3261E),
                )
            }
        }
    val buttonTextColor = contrastingTextColor(theme.primaryColor)
    val colors =
        baseColors.copy(
            primary = theme.primaryColor,
            onPrimary = buttonTextColor,
            secondaryContainer = theme.primaryColor,
            onSecondaryContainer = buttonTextColor,
            surface = theme.backgroundColor,
        )
    MaterialTheme(colorScheme = colors, content = content)
}

internal fun defaultNativeThemePalette(themeName: String?): NativeThemePalette =
    when (themeName) {
        "light" -> NativeThemePalette(themeName, Color(0xFF90D590), Color.White)
        "sfw" -> NativeThemePalette(themeName, Color(0xFFAAAAAA), Color.White)
        "dark" -> NativeThemePalette(themeName, Color(0xFF316C58), Color(0xFF18181C))
        "green" -> NativeThemePalette(themeName, Color(0xFF52B051), Color(0xFFFAFFFA))
        "blue" -> NativeThemePalette(themeName, Color(0xFF6495ED), Color(0xFFF5F7FF))
        else -> NativeThemePalette("green", Color(0xFF52B051), Color(0xFFFAFFFA))
    }

internal fun defaultNativeThemePalette(theme: AppTheme): NativeThemePalette =
    defaultNativeThemePalette(theme.storageValue)

@Composable
internal fun SyncSystemBars(theme: NativeThemePalette) {
    val view = LocalView.current
    SideEffect {
        val window = (view.context as? Activity)?.window ?: return@SideEffect
        val lightBackground = theme.backgroundColor.luminance() > 0.5f
        @Suppress("DEPRECATION")
        run {
            window.statusBarColor = AndroidColor.TRANSPARENT
            window.navigationBarColor = theme.backgroundColor.toArgb()
        }
        WindowCompat.getInsetsController(window, view).apply {
            isAppearanceLightStatusBars = lightBackground
            isAppearanceLightNavigationBars = lightBackground
        }
    }
}

private fun contrastingTextColor(background: Color): Color = if (background.luminance() > 0.5f) DeepBroth else Color.White

internal fun parseCssColor(rawColor: String): Color? {
    val hex = rawColor.removePrefix("#")
    return runCatching {
        when (hex.length) {
            6 -> {
                Color(
                    red = hex.substring(0, 2).toInt(16),
                    green = hex.substring(2, 4).toInt(16),
                    blue = hex.substring(4, 6).toInt(16),
                )
            }

            8 -> {
                Color(
                    red = hex.substring(0, 2).toInt(16),
                    green = hex.substring(2, 4).toInt(16),
                    blue = hex.substring(4, 6).toInt(16),
                    alpha = hex.substring(6, 8).toInt(16),
                )
            }

            else -> {
                error("Unsupported CSS color")
            }
        }
    }.getOrNull()
}
