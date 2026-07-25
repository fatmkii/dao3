package com.cpttmm.app.webview

import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import androidx.webkit.WebViewFeature
import com.cpttmm.app.BuildConfig
import com.cpttmm.app.data.local.AccountEntity
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Assume.assumeTrue
import org.junit.Test
import org.junit.runner.RunWith
import java.util.UUID
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

@RunWith(AndroidJUnit4::class)
class WebViewTitleTest {
    @Test
    fun reportsDocumentTitleChangesImmediately() {
        assumeTrue(WebViewFeature.isFeatureSupported(WebViewFeature.MULTI_PROFILE))
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val titleChanged = CountDownLatch(1)
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
                onTitleChanged = { title ->
                    if (title == "实时标题") titleChanged.countDown()
                },
                onOpenNewTab = {},
                onLongPressLink = {},
                onMainFrameError = {},
                onShowFileChooser = { _, _ -> false },
                onDownloadFailure = {},
            )
            host.view.loadDataWithBaseURL(
                "https://cpttmm.com",
                "<html><head><title>初始标题</title></head>" +
                    "<body><script>document.title='实时标题'</script></body></html>",
                "text/html",
                "UTF-8",
                null,
            )
        }

        try {
            assertTrue(titleChanged.await(5, TimeUnit.SECONDS))
        } finally {
            instrumentation.runOnMainSync { host.destroy(saveState = false) }
        }
    }

    @Test
    fun reportsHistoryApiPathChangesImmediately() {
        assumeTrue(WebViewFeature.isFeatureSupported(WebViewFeature.MULTI_PROFILE))
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val pathChanged = CountDownLatch(1)
        var reportedPath: String? = null
        lateinit var host: WebViewHost

        instrumentation.runOnMainSync {
            host = WebViewHost(
                context = ApplicationProvider.getApplicationContext(),
                account = account(),
                accessToken = "access-token",
                onExternalNavigation = {},
                onBridgeMessage = {},
                onSaveState = {},
                onPathChanged = { path ->
                    if (path == "/thread/1?page=2#reply-3") {
                        reportedPath = path
                        pathChanged.countDown()
                    }
                },
                onTitleChanged = {},
                onOpenNewTab = {},
                onLongPressLink = {},
                onMainFrameError = {},
                onShowFileChooser = { _, _ -> false },
                onDownloadFailure = {},
            )
            host.view.loadDataWithBaseURL(
                BuildConfig.DEVELOPMENT_SERVER_ORIGIN,
                "<html><body><script>" +
                    "history.pushState({}, '', '/thread/1?page=2#reply-3')" +
                    "</script></body></html>",
                "text/html",
                "UTF-8",
                null,
            )
        }

        try {
            assertTrue(pathChanged.await(5, TimeUnit.SECONDS))
            assertEquals("/thread/1?page=2#reply-3", reportedPath)
        } finally {
            instrumentation.runOnMainSync { host.destroy(saveState = false) }
        }
    }

    private fun account() = AccountEntity(
        id = UUID.randomUUID().toString(),
        binggan = "TitleTest",
        alias = "饼干#1",
        profileName = "title-${UUID.randomUUID()}",
        cachedThemeName = null,
        accessExpiresAtMillis = Long.MAX_VALUE,
        idleExpiresAtMillis = Long.MAX_VALUE,
        lastUsedAtMillis = 0,
    )
}
