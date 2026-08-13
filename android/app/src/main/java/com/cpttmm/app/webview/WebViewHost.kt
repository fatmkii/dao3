package com.cpttmm.app.webview

import android.annotation.SuppressLint
import android.app.DownloadManager
import android.content.Context
import android.graphics.Bitmap
import android.net.Uri
import android.os.Environment
import android.os.Handler
import android.os.Looper
import android.os.Message
import android.view.ViewGroup
import android.webkit.CookieManager
import android.webkit.URLUtil
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebMessage
import android.webkit.WebMessagePort
import android.webkit.WebResourceRequest
import android.webkit.WebResourceError
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import com.cpttmm.app.BuildConfig
import com.cpttmm.app.data.local.AccountEntity
import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.navigation.DomainPolicy
import com.cpttmm.app.navigation.NavigationTarget
import org.json.JSONObject

data class RestorableWebViewState(
    val path: String,
    val title: String,
    val scrollY: Int,
)

data class WebBridgeMessage(
    val data: String,
    val sourceOrigin: String,
    val reply: (String) -> Unit,
)

data class WebFindResult(
    val activeMatchOrdinal: Int,
    val matchCount: Int,
    val isDoneCounting: Boolean,
)

data class WebHitTarget(
    val linkUrl: String? = null,
    val imageUrl: String? = null,
)

enum class WebImageSaveResult {
    STARTED,
    UNSUPPORTED,
    FAILED,
}

class WebViewHost(
    context: Context,
    account: AccountEntity,
    accessToken: String,
    initialThemeName: String = "green",
    private val onExternalNavigation: (String) -> Unit,
    private val onBridgeMessage: (WebBridgeMessage) -> Unit,
    private val onSaveState: (RestorableWebViewState) -> Unit,
    private val onPathChanged: (String) -> Unit,
    private val onTitleChanged: (String) -> Unit,
    private val onOpenNewTab: (String) -> Unit,
    private val onLongPressTarget: (WebHitTarget) -> Unit,
    private val onMainFrameError: (String?) -> Unit,
    private val onShowFileChooser: (
        ValueCallback<Array<Uri>>,
        WebChromeClient.FileChooserParams,
    ) -> Boolean,
    private val onDownloadFailure: () -> Unit,
) : PooledWebViewHost {
    override val accountId: String = account.id
    val view: WebView = DraggableScrollbarWebView(context).apply {
        layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT,
        )
    }

    private var currentAccessToken = accessToken
    private var currentThemeName = initialThemeName
    private var destroyed = false
    private var pendingScrollY: Int? = null
    private val bridgePorts = linkedSetOf<WebMessagePort>()
    private var bridgeAcknowledged = false
    private var activeBridgePort: WebMessagePort? = null
    private var bridgeHandshakeAttempts = 0
    private var bridgeFinalHandshakeAttempted = false
    private var onFindResult: ((WebFindResult) -> Unit)? = null
    private val retryBridgeHandshake = Runnable {
        if (!destroyed && !bridgeAcknowledged) {
            view.url?.let { establishBridge(view, it) }
        }
    }

    init {
        configure()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configure() {
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG)
        view.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            mediaPlaybackRequiresUserGesture = true
            setSupportMultipleWindows(true)
        }
        view.settings.userAgentString = "${view.settings.userAgentString} $USER_AGENT_MARKER"
        view.webViewClient = object : WebViewClient() {
            override fun onPageStarted(webView: WebView, url: String, favicon: Bitmap?) {
                bridgeHandshakeAttempts = 0
                bridgeFinalHandshakeAttempted = false
                closeBridgePort()
                onMainFrameError(null)
                DomainPolicy.internalPath(url)?.let(onPathChanged)
            }

            override fun onPageCommitVisible(webView: WebView, url: String) {
                establishBridge(webView, url)
            }

            override fun onPageFinished(webView: WebView, url: String) {
                if (!bridgeAcknowledged) {
                    val forceFinalHandshake =
                        bridgeHandshakeAttempts >= MAX_BRIDGE_HANDSHAKE_ATTEMPTS &&
                            !bridgeFinalHandshakeAttempted
                    establishBridge(
                        webView,
                        url,
                        force = forceFinalHandshake,
                    )
                }
                pendingScrollY?.let { scrollY ->
                    pendingScrollY = null
                    webView.scrollTo(0, scrollY)
                }
            }

            override fun doUpdateVisitedHistory(webView: WebView, url: String, isReload: Boolean) {
                DomainPolicy.internalPath(url)?.let(onPathChanged)
            }

            override fun shouldOverrideUrlLoading(webView: WebView, request: WebResourceRequest): Boolean {
                return handleNavigation(webView, request.url.toString())
            }

            override fun onReceivedError(
                webView: WebView,
                request: WebResourceRequest,
                error: WebResourceError,
            ) {
                if (request.isForMainFrame) {
                    onMainFrameError(error.description.toString())
                }
            }
        }
        view.webChromeClient = object : WebChromeClient() {
            override fun onReceivedTitle(webView: WebView, title: String) {
                if (title.isNotBlank()) onTitleChanged(title)
            }

            override fun onShowFileChooser(
                webView: WebView,
                filePathCallback: ValueCallback<Array<Uri>>,
                fileChooserParams: FileChooserParams,
            ): Boolean = onShowFileChooser(filePathCallback, fileChooserParams)

            override fun onCreateWindow(
                webView: WebView,
                isDialog: Boolean,
                isUserGesture: Boolean,
                resultMsg: Message,
            ): Boolean {
                if (!isUserGesture) return false
                val popup = WebView(webView.context)
                popup.webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(
                        popupView: WebView,
                        request: WebResourceRequest,
                    ): Boolean {
                        onOpenNewTab(request.url.toString())
                        popupView.destroy()
                        return true
                    }
                }
                (resultMsg.obj as WebView.WebViewTransport).webView = popup
                resultMsg.sendToTarget()
                return true
            }
        }
        view.setDownloadListener { url, userAgent, contentDisposition, mimeType, _ ->
            runCatching {
                enqueueDownload(url, userAgent, contentDisposition, mimeType)
            }.onFailure { onDownloadFailure() }
        }
        view.setOnLongClickListener {
            val hit = view.hitTestResult
            when (hit.type) {
                WebView.HitTestResult.SRC_ANCHOR_TYPE -> {
                    hit.extra?.takeIf(String::isNotBlank)?.let { url ->
                        onLongPressTarget(WebHitTarget(linkUrl = url))
                    } != null
                }
                WebView.HitTestResult.IMAGE_TYPE -> {
                    hit.extra?.takeIf(String::isNotBlank)?.let { url ->
                        onLongPressTarget(WebHitTarget(imageUrl = url))
                    } != null
                }
                WebView.HitTestResult.SRC_IMAGE_ANCHOR_TYPE -> {
                    requestLinkedImageTarget(hit.extra)
                    true
                }
                else -> false
            }
        }
        view.setFindListener { activeMatchOrdinal, numberOfMatches, isDoneCounting ->
            onFindResult?.invoke(
                WebFindResult(activeMatchOrdinal, numberOfMatches, isDoneCounting),
            )
        }
    }

    fun load(domain: AppDomain, path: String = "/", scrollY: Int = 0) {
        check(!destroyed) { "WebViewHost has been destroyed" }
        val safePath = if (path.startsWith('/')) path else "/"
        val url = DomainPolicy.home(domain).resolve(safePath).toString()
        view.loadUrl(url)
        if (scrollY > 0) {
            pendingScrollY = scrollY
        }
    }

    override fun updateAccessToken(accessToken: String) {
        if (destroyed) return
        currentAccessToken = accessToken
        val currentUrl = view.url
        if (currentUrl != null && DomainPolicy.classify(currentUrl) is NavigationTarget.Internal) {
            view.evaluateJavascript(WebAuthScript.update(accessToken), null)
        }
    }

    override fun updateTheme(themeName: String) {
        if (destroyed) return
        currentThemeName = themeName
        activeBridgePort?.postMessage(WebMessage(WebAuthScript.themeMessage(themeName)))
    }

    fun accessToken(): String = currentAccessToken

    fun dispatchAuthRefreshFailed() {
        if (destroyed) return
        val currentUrl = view.url
        if (currentUrl != null && DomainPolicy.classify(currentUrl) is NavigationTarget.Internal) {
            view.evaluateJavascript(
                "window.dispatchEvent(new CustomEvent('cpttmm:auth-refresh-failed'));void 0;",
                null,
            )
        }
    }

    fun goBack(): Boolean {
        if (!view.canGoBack()) return false
        view.goBack()
        return true
    }

    fun goForward(): Boolean {
        if (!view.canGoForward()) return false
        view.goForward()
        return true
    }

    fun reload() {
        if (!destroyed) view.reload()
    }

    fun clearResourceCacheAndReload() {
        if (destroyed) return
        view.clearCache(true)
        view.reload()
    }

    fun currentUrl(): String? = view.url

    fun currentTitle(): String = view.title.orEmpty()

    fun setOnFindResultListener(listener: ((WebFindResult) -> Unit)?) {
        onFindResult = listener
    }

    fun findAll(query: String) {
        if (destroyed) return
        if (query.isBlank()) {
            clearFindMatches()
        } else {
            view.findAllAsync(query)
        }
    }

    fun findNext(forward: Boolean) {
        if (!destroyed) view.findNext(forward)
    }

    fun clearFindMatches() {
        if (destroyed) return
        view.clearMatches()
        onFindResult?.invoke(WebFindResult(0, 0, true))
    }

    fun saveImage(rawUrl: String): WebImageSaveResult {
        if (destroyed || !WebDownloadPolicy.isAllowed(rawUrl)) {
            return WebImageSaveResult.UNSUPPORTED
        }
        return runCatching {
            enqueueDownload(
                url = rawUrl,
                userAgent = view.settings.userAgentString,
                contentDisposition = null,
                mimeType = null,
            )
            WebImageSaveResult.STARTED
        }.onFailure { onDownloadFailure() }.getOrDefault(WebImageSaveResult.FAILED)
    }

    fun restorableState(): RestorableWebViewState? = currentRestorableState()

    fun setOnVerticalScrollChangedListener(listener: ((Int, Int, Boolean) -> Unit)?) {
        (view as DraggableScrollbarWebView).setOnVerticalScrollChangedListener(listener)
    }

    override fun pause() {
        if (destroyed) return
        saveRestorableState()
        view.onPause()
    }

    fun pauseForActivity() {
        if (destroyed) return
        pause()
        view.pauseTimers()
    }

    fun resumeForActivity() {
        if (destroyed) return
        resume()
        val currentUrl = view.url
        if (currentUrl != null && DomainPolicy.classify(currentUrl) is NavigationTarget.Internal) {
            view.evaluateJavascript(
                "window.dispatchEvent(new CustomEvent('cpttmm:foreground'));void 0;",
                null,
            )
        }
    }

    override fun resume() {
        if (destroyed) return
        view.resumeTimers()
        view.onResume()
    }

    override fun destroy(saveState: Boolean) {
        if (destroyed) return
        destroyed = true
        if (saveState) saveRestorableState()
        setOnVerticalScrollChangedListener(null)
        onFindResult = null
        closeBridgePort()
        view.webViewClient = WebViewClient()
        view.webChromeClient = WebChromeClient()
        view.stopLoading()
        view.removeAllViews()
        view.destroy()
    }

    private fun handleNavigation(webView: WebView, rawUrl: String): Boolean {
        return when (val target = DomainPolicy.classify(rawUrl)) {
            NavigationTarget.Blocked -> true
            is NavigationTarget.External -> {
                onExternalNavigation(target.uri.toString())
                true
            }
            is NavigationTarget.Internal -> {
                val normalized = target.uri.toString()
                if (normalized != rawUrl) {
                    webView.loadUrl(normalized)
                    true
                } else {
                    false
                }
            }
        }
    }

    private fun requestLinkedImageTarget(fallbackLinkUrl: String?) {
        val handler = Handler(Looper.getMainLooper()) { message ->
            val linkUrl = message.data.getString("url")
                ?.takeIf(String::isNotBlank)
                ?: fallbackLinkUrl?.takeIf(String::isNotBlank)
            val imageUrl = message.data.getString("src")?.takeIf(String::isNotBlank)
            if (linkUrl != null || imageUrl != null) {
                onLongPressTarget(WebHitTarget(linkUrl = linkUrl, imageUrl = imageUrl))
            }
            true
        }
        view.requestFocusNodeHref(Message.obtain(handler))
    }

    private fun handleBridgeMessage(
        message: String,
        sourceOrigin: String,
        replyPort: WebMessagePort,
    ) {
        val json = runCatching { JSONObject(message) }.getOrNull()
        if (json?.optString("type") == "navigationChanged") {
            val url = json.optJSONObject("payload")?.optString("url").orEmpty()
            DomainPolicy.internalPath(url)?.let(onPathChanged)
            return
        }
        onBridgeMessage(
            WebBridgeMessage(
                data = message,
                sourceOrigin = sourceOrigin,
                reply = { reply -> replyPort.postMessage(WebMessage(reply)) },
            ),
        )
    }

    private fun establishBridge(webView: WebView, url: String, force: Boolean = false) {
        if (destroyed) return
        val sourceOrigin = DomainPolicy.trustedOrigin(url) ?: return
        if (!force && bridgeHandshakeAttempts >= MAX_BRIDGE_HANDSHAKE_ATTEMPTS) return
        if (force) bridgeFinalHandshakeAttempted = true
        val ports = webView.createWebMessageChannel()
        val nativePort = ports[0]
        bridgePorts += nativePort
        bridgeHandshakeAttempts += 1
        nativePort.setWebMessageCallback(object : WebMessagePort.WebMessageCallback() {
            override fun onMessage(port: WebMessagePort, message: WebMessage) {
                if (port !in bridgePorts || destroyed) return
                val data = message.data ?: return
                if (!bridgeAcknowledged) {
                    if (data == BRIDGE_READY_ACK) selectBridgePort(port)
                    return
                }
                if (data != BRIDGE_READY_ACK) {
                    handleBridgeMessage(data, sourceOrigin, port)
                }
            }
        })
        webView.postWebMessage(
            WebMessage(BRIDGE_HANDSHAKE, arrayOf(ports[1])),
            Uri.parse(sourceOrigin),
        )
        scheduleBridgeHandshakeRetry()
    }

    private fun selectBridgePort(port: WebMessagePort) {
        if (bridgeAcknowledged) return
        bridgeAcknowledged = true
        activeBridgePort = port
        view.removeCallbacks(retryBridgeHandshake)
        bridgePorts.filterNot { it === port }.forEach {
            bridgePorts.remove(it)
            it.close()
        }
        port.postMessage(WebMessage(WebAuthScript.themeMessage(currentThemeName)))
    }

    private fun scheduleBridgeHandshakeRetry() {
        view.removeCallbacks(retryBridgeHandshake)
        if (bridgeHandshakeAttempts < MAX_BRIDGE_HANDSHAKE_ATTEMPTS) {
            view.postDelayed(retryBridgeHandshake, BRIDGE_HANDSHAKE_RETRY_MILLIS)
        }
    }

    private fun closeBridgePort() {
        view.removeCallbacks(retryBridgeHandshake)
        bridgePorts.forEach(WebMessagePort::close)
        bridgePorts.clear()
        bridgeAcknowledged = false
        activeBridgePort = null
    }

    private fun saveRestorableState() {
        val state = currentRestorableState() ?: return
        onSaveState(state)
    }

    private fun currentRestorableState(): RestorableWebViewState? {
        val current = view.url ?: return null
        val path = DomainPolicy.internalPath(current) ?: return null
        return RestorableWebViewState(
            path = path,
            title = view.title.orEmpty(),
            scrollY = view.scrollY,
        )
    }

    private fun enqueueDownload(
        url: String,
        userAgent: String?,
        contentDisposition: String?,
        mimeType: String?,
    ) {
        val uri = Uri.parse(url)
        require(WebDownloadPolicy.isAllowed(url))
        val fileName = URLUtil.guessFileName(url, contentDisposition, mimeType)
        val request = DownloadManager.Request(uri)
            .setTitle(fileName)
            .setMimeType(mimeType)
            .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName)
        userAgent?.takeIf { it.isNotBlank() }?.let { request.addRequestHeader("User-Agent", it) }
        CookieManager.getInstance().getCookie(url)
            ?.takeIf(String::isNotBlank)
            ?.let { request.addRequestHeader("Cookie", it) }
        if (WebDownloadPolicy.shouldAttachAuthorization(url)) {
            view.url?.takeIf { it.startsWith("http://") || it.startsWith("https://") }
                ?.let { request.addRequestHeader("Referer", it) }
            request.addRequestHeader("Authorization", "Bearer $currentAccessToken")
        }
        val manager = view.context.getSystemService(DownloadManager::class.java)
        manager.enqueue(request)
    }

    companion object {
        const val USER_AGENT_MARKER = "CpttmmAndroid"
        const val BRIDGE_HANDSHAKE = "cpttmm:bridge-port-v1"
        const val BRIDGE_READY_ACK = "cpttmm:bridge-ready-v1"
        private const val BRIDGE_HANDSHAKE_RETRY_MILLIS = 400L
        private const val MAX_BRIDGE_HANDSHAKE_ATTEMPTS = 20
    }
}

internal object WebDownloadPolicy {
    fun isAllowed(rawUrl: String): Boolean {
        val uri = runCatching { java.net.URI(rawUrl) }.getOrNull() ?: return false
        return when (DomainPolicy.classify(rawUrl)) {
            is NavigationTarget.Internal ->
                uri.scheme.equals("https", ignoreCase = true) ||
                    (BuildConfig.DEBUG && uri.scheme.equals("http", ignoreCase = true))
            is NavigationTarget.External -> uri.scheme.equals("https", ignoreCase = true)
            NavigationTarget.Blocked -> false
        }
    }

    fun shouldAttachAuthorization(rawUrl: String): Boolean =
        DomainPolicy.classify(rawUrl) is NavigationTarget.Internal
}
