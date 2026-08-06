package com.cpttmm.app.webview

import android.content.Context
import androidx.test.core.app.ActivityScenario
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.cpttmm.app.BuildConfig
import com.cpttmm.app.MainActivity
import com.cpttmm.app.data.local.AccountEntity
import com.cpttmm.app.navigation.AppDomain
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import java.util.UUID
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

@RunWith(AndroidJUnit4::class)
class WebViewBridgeTest {
    @Test
    fun trustedMainPageExchangesMessagesWithItsExactOrigin() {
        val bootstrapReceived = CountDownLatch(1)
        val themeReceived = CountDownLatch(1)
        var sourceOrigin: String? = null
        var userAgent: String? = null
        lateinit var host: WebViewHost
        val scenario = ActivityScenario.launch(MainActivity::class.java)

        scenario.onActivity { activity ->
            host = host(
                context = activity,
                onBridgeMessage = { message ->
                    sourceOrigin = message.sourceOrigin
                    when (JSONObject(message.data).optString("type")) {
                        "authBootstrapRequested" -> {
                            message.reply(authBootstrap())
                            bootstrapReceived.countDown()
                        }
                        "themeChanged" -> themeReceived.countDown()
                    }
                },
            )
            userAgent = host.view.settings.userAgentString
            activity.setContentView(host.view)
            host.load(AppDomain.PRIMARY)
        }

        try {
            assertTrue(bootstrapReceived.await(10, TimeUnit.SECONDS))
            assertTrue(themeReceived.await(10, TimeUnit.SECONDS))
            assertEquals(BuildConfig.DEVELOPMENT_SERVER_ORIGIN, sourceOrigin)
            assertTrue("User-Agent was $userAgent", userAgent.orEmpty().contains(WebViewHost.USER_AGENT_MARKER))
        } finally {
            scenario.onActivity { host.destroy(saveState = false) }
            scenario.close()
        }
    }

    @Test
    fun reloadRebuildsTheChannel() {
        val firstMessage = CountDownLatch(1)
        val secondMessage = CountDownLatch(1)
        var bootstrapCount = 0
        lateinit var host: WebViewHost
        val scenario = ActivityScenario.launch(MainActivity::class.java)

        scenario.onActivity { activity ->
            host = host(context = activity, onBridgeMessage = { message ->
                if (JSONObject(message.data).optString("type") != "authBootstrapRequested") return@host
                bootstrapCount += 1
                message.reply(authBootstrap())
                if (bootstrapCount == 1) firstMessage.countDown() else secondMessage.countDown()
            })
            activity.setContentView(host.view)
            host.load(AppDomain.PRIMARY)
        }

        try {
            assertTrue(firstMessage.await(10, TimeUnit.SECONDS))
            scenario.onActivity { host.reload() }
            assertTrue(secondMessage.await(10, TimeUnit.SECONDS))
        } finally {
            scenario.onActivity { host.destroy(saveState = false) }
            scenario.close()
        }
    }

    @Test
    fun rejectsExternalOriginsAndClosesThePortOnDestroy() {
        val externalPageSettled = CountDownLatch(1)
        var bridgeMessages = 0
        lateinit var host: WebViewHost
        val scenario = ActivityScenario.launch(MainActivity::class.java)

        scenario.onActivity { activity ->
            host = host(
                context = activity,
                onBridgeMessage = { bridgeMessages += 1 },
                onTitleChanged = { if (it == "rejected") externalPageSettled.countDown() },
            )
            activity.setContentView(host.view)
            host.view.loadDataWithBaseURL(
                "https://example.com",
                "<html><head><title>loading</title></head><body><script>" +
                    "let received=false;window.addEventListener('message',()=>received=true);" +
                    "setTimeout(()=>document.title=received?'unexpected':'rejected',250)" +
                    "</script></body></html>",
                "text/html",
                "UTF-8",
                "https://example.com",
            )
        }

        assertTrue(externalPageSettled.await(5, TimeUnit.SECONDS))
        assertEquals(0, bridgeMessages)
        scenario.onActivity { host.destroy(saveState = false) }

        val trustedMessage = CountDownLatch(1)
        scenario.onActivity { activity ->
            host = host(context = activity, onBridgeMessage = { message ->
                if (JSONObject(message.data).optString("type") != "authBootstrapRequested") return@host
                trustedMessage.countDown()
            })
            activity.setContentView(host.view)
            host.load(AppDomain.PRIMARY)
        }
        assertTrue(trustedMessage.await(10, TimeUnit.SECONDS))
        scenario.onActivity { host.destroy(saveState = false) }
        scenario.close()
    }

    private fun authBootstrap() =
        "{\"type\":\"authBootstrap\",\"payload\":{" +
            "\"storageNamespace\":\"bridge-test\"," +
            "\"binggan\":\"BridgeTest\"," +
            "\"accessToken\":\"access-token\"," +
            "\"pendingStorageNamespaces\":[]}}"

    private fun host(
        context: Context,
        onBridgeMessage: (WebBridgeMessage) -> Unit = {},
        onTitleChanged: (String) -> Unit = {},
    ) = WebViewHost(
        context = context,
        account = AccountEntity(
            id = UUID.randomUUID().toString(),
            binggan = "BridgeTest",
            alias = "饼干#1",
            storageNamespace = "bridge-${UUID.randomUUID()}",
            cachedThemeName = null,
            accessExpiresAtMillis = Long.MAX_VALUE,
            idleExpiresAtMillis = Long.MAX_VALUE,
            lastUsedAtMillis = 0,
        ),
        accessToken = "access-token",
        onExternalNavigation = {},
        onBridgeMessage = onBridgeMessage,
        onSaveState = {},
        onPathChanged = {},
        onTitleChanged = onTitleChanged,
        onOpenNewTab = {},
        onLongPressLink = {},
        onMainFrameError = {},
        onShowFileChooser = { _, _ -> false },
        onDownloadFailure = {},
    )
}
