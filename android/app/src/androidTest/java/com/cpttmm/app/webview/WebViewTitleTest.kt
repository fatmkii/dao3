package com.cpttmm.app.webview

import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.cpttmm.app.BuildConfig
import com.cpttmm.app.MainActivity
import com.cpttmm.app.data.local.AccountEntity
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import java.util.UUID
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicReference

@RunWith(AndroidJUnit4::class)
class WebViewTitleTest {
    @Test
    fun findsAndNavigatesBetweenPageMatches() {
        val pageReady = CountDownLatch(1)
        val initialResults = CountDownLatch(1)
        val nextResult = CountDownLatch(1)
        val latestResult = AtomicReference<WebFindResult>()
        lateinit var host: WebViewHost
        val scenario = ActivityScenario.launch(MainActivity::class.java)

        scenario.onActivity { activity ->
            host = WebViewHost(
                context = activity,
                account = account(),
                accessToken = "access-token",
                onExternalNavigation = {},
                onBridgeMessage = {},
                onSaveState = {},
                onPathChanged = {},
                onTitleChanged = { if (it == "find-ready") pageReady.countDown() },
                onOpenNewTab = {},
                onLongPressTarget = {},
                onMainFrameError = {},
                onShowFileChooser = { _, _ -> false },
                onDownloadFailure = {},
            )
            activity.setContentView(host.view)
            host.setOnFindResultListener { result ->
                latestResult.set(result)
                if (result.isDoneCounting && result.matchCount == 2) {
                    if (result.activeMatchOrdinal == 0) initialResults.countDown()
                    if (result.activeMatchOrdinal == 1) nextResult.countDown()
                }
            }
            host.view.loadDataWithBaseURL(
                BuildConfig.DEVELOPMENT_SERVER_ORIGIN,
                "<html><body>火锅 <span>火锅</span> 米饭" +
                    "<script>document.title='find-ready'</script></body></html>",
                "text/html",
                "UTF-8",
                BuildConfig.DEVELOPMENT_SERVER_ORIGIN,
            )
        }

        try {
            assertTrue(pageReady.await(5, TimeUnit.SECONDS))
            scenario.onActivity { host.findAll("火锅") }
            assertTrue(
                "Timed out waiting for initial find result; latest=${latestResult.get()}",
                initialResults.await(5, TimeUnit.SECONDS),
            )
            scenario.onActivity { host.findNext(true) }
            assertTrue(
                "Timed out waiting for next find result; latest=${latestResult.get()}",
                nextResult.await(5, TimeUnit.SECONDS),
            )
            assertTrue(latestResult.get().activeMatchOrdinal == 1)
        } finally {
            scenario.onActivity { host.destroy(saveState = false) }
            scenario.close()
        }
    }

    @Test
    fun reportsDocumentTitleChangesImmediately() {
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
                onLongPressTarget = {},
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
    fun dispatchesForegroundEventWhenActivityWebViewResumes() {
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val pageReady = CountDownLatch(1)
        val foregroundReceived = CountDownLatch(1)
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
                    if (title == "ready") pageReady.countDown()
                    if (title == "foreground") foregroundReceived.countDown()
                },
                onOpenNewTab = {},
                onLongPressTarget = {},
                onMainFrameError = {},
                onShowFileChooser = { _, _ -> false },
                onDownloadFailure = {},
            )
            host.view.loadDataWithBaseURL(
                BuildConfig.DEVELOPMENT_SERVER_ORIGIN,
                "<html><head><title>ready</title></head><body><script>" +
                    "window.addEventListener('cpttmm:foreground',()=>document.title='foreground')" +
                    "</script></body></html>",
                "text/html",
                "UTF-8",
                BuildConfig.DEVELOPMENT_SERVER_ORIGIN,
            )
        }

        try {
            assertTrue(pageReady.await(5, TimeUnit.SECONDS))
            instrumentation.runOnMainSync {
                host.pauseForActivity()
                host.resumeForActivity()
            }
            assertTrue(foregroundReceived.await(5, TimeUnit.SECONDS))
        } finally {
            instrumentation.runOnMainSync { host.destroy(saveState = false) }
        }
    }

    private fun account() = AccountEntity(
        id = UUID.randomUUID().toString(),
        binggan = "TitleTest",
        alias = "饼干#1",
        storageNamespace = "title-${UUID.randomUUID()}",
        cachedThemeName = null,
        accessExpiresAtMillis = Long.MAX_VALUE,
        idleExpiresAtMillis = Long.MAX_VALUE,
        lastUsedAtMillis = 0,
    )
}
