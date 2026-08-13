package com.cpttmm.app

import android.content.res.Configuration
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.lifecycle.lifecycleScope
import com.cpttmm.app.preferences.AppThemePreferences
import com.cpttmm.app.ui.CpttmmApp
import com.cpttmm.app.webview.WebViewHost
import com.cpttmm.app.webview.WebViewPool
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import java.io.IOException

class MainActivity : ComponentActivity() {
    private var activeWebViewHost: WebViewHost? = null
    private var activeWebViewPool: WebViewPool<WebViewHost>? = null
    private val foregroundGeneration = mutableIntStateOf(0)
    private val isSystemDark = mutableStateOf(false)
    private val initialThemePreferences = mutableStateOf<AppThemePreferences?>(null)

    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        splashScreen.setKeepOnScreenCondition { initialThemePreferences.value == null }
        super.onCreate(savedInstanceState)
        val app = application as CpttmmApplication
        isSystemDark.value = resources.configuration.isDarkMode()

        lifecycleScope.launch {
            val loadedPreferences =
                try {
                    app.preferences.themePreferences.first()
                } catch (_: IOException) {
                    AppThemePreferences()
                }
            initialThemePreferences.value = loadedPreferences
            if (loadedPreferences.requiresRepair) {
                try {
                    app.preferences.repairThemePreferences()
                } catch (_: IOException) {
                    // The validated in-memory values remain usable for this launch.
                }
            }
        }

        setContent {
            initialThemePreferences.value?.let { themePreferences ->
                CpttmmApp(
                    auth = app.auth,
                    accounts = app.accounts,
                    tabs = app.tabs,
                    preferences = app.preferences,
                    diagnostics = app.diagnostics,
                    initialThemePreferences = themePreferences,
                    isSystemDark = isSystemDark.value,
                    foregroundGeneration = foregroundGeneration.intValue,
                    onWebViewHostChanged = { activeWebViewHost = it },
                    onWebViewPoolChanged = { activeWebViewPool = it },
                )
            }
        }
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        isSystemDark.value = newConfig.isDarkMode()
    }

    override fun onPostResume() {
        super.onPostResume()
        activeWebViewHost?.resumeForActivity()
        foregroundGeneration.intValue += 1
    }

    override fun onPause() {
        activeWebViewHost?.pauseForActivity()
        super.onPause()
    }

    @Suppress("DEPRECATION")
    override fun onTrimMemory(level: Int) {
        super.onTrimMemory(level)
        if (level >= TRIM_MEMORY_RUNNING_LOW) {
            activeWebViewPool?.trimToActive()
        }
    }

    @Suppress("DEPRECATION")
    override fun onLowMemory() {
        activeWebViewPool?.trimToActive()
        super.onLowMemory()
    }
}

private fun Configuration.isDarkMode(): Boolean =
    uiMode and Configuration.UI_MODE_NIGHT_MASK == Configuration.UI_MODE_NIGHT_YES
