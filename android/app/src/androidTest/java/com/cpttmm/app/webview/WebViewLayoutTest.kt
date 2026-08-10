package com.cpttmm.app.webview

import android.view.ViewGroup
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.cpttmm.app.data.local.AccountEntity
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import java.util.UUID

@RunWith(AndroidJUnit4::class)
class WebViewLayoutTest {
    @Test
    fun fillsTheAndroidViewContainer() {
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        lateinit var host: WebViewHost

        instrumentation.runOnMainSync {
            host = WebViewHost(
                context = ApplicationProvider.getApplicationContext(),
                account = account(),
                accessToken = "access-token",
                onExternalNavigation = {},
                onBridgeMessage = {},
                onSaveState = {},
                onPathChanged = {},
                onTitleChanged = {},
                onOpenNewTab = {},
                onLongPressTarget = {},
                onMainFrameError = {},
                onShowFileChooser = { _, _ -> false },
                onDownloadFailure = {},
            )
        }

        try {
            assertEquals(ViewGroup.LayoutParams.MATCH_PARENT, host.view.layoutParams.width)
            assertEquals(ViewGroup.LayoutParams.MATCH_PARENT, host.view.layoutParams.height)
        } finally {
            instrumentation.runOnMainSync { host.destroy(saveState = false) }
        }
    }

    private fun account() = AccountEntity(
        id = UUID.randomUUID().toString(),
        binggan = "LayoutTest",
        alias = "饼干#1",
        storageNamespace = "layout-${UUID.randomUUID()}",
        cachedThemeName = null,
        accessExpiresAtMillis = Long.MAX_VALUE,
        idleExpiresAtMillis = Long.MAX_VALUE,
        lastUsedAtMillis = 0,
    )
}
