package com.cpttmm.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.mutableIntStateOf
import com.cpttmm.app.ui.CpttmmApp
import com.cpttmm.app.webview.WebViewHost
import com.cpttmm.app.webview.WebViewPool

class MainActivity : ComponentActivity() {
    private var activeWebViewHost: WebViewHost? = null
    private var activeWebViewPool: WebViewPool<WebViewHost>? = null
    private val foregroundGeneration = mutableIntStateOf(0)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val app = application as CpttmmApplication

        setContent {
            CpttmmApp(
                auth = app.auth,
                accounts = app.accounts,
                tabs = app.tabs,
                preferences = app.preferences,
                diagnostics = app.diagnostics,
                foregroundGeneration = foregroundGeneration.intValue,
                onWebViewHostChanged = { activeWebViewHost = it },
                onWebViewPoolChanged = { activeWebViewPool = it },
            )
        }
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
