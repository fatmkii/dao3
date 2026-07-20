package com.cpttmm.app.webview

import android.annotation.SuppressLint
import android.app.DownloadManager
import android.content.Context
import android.graphics.Bitmap
import android.net.Uri
import android.os.Environment
import android.os.Message
import android.webkit.URLUtil
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceError
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.webkit.ProfileStore
import androidx.webkit.ScriptHandler
import androidx.webkit.WebMessageCompat
import androidx.webkit.WebViewCompat
import com.cpttmm.app.data.local.AccountEntity
import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.navigation.DomainPolicy
import com.cpttmm.app.navigation.NavigationTarget

data class RestorableWebViewState(
    val path: String,
    val title: String,
    val scrollY: Int,
)

class WebViewHost(
    context: Context,
    private val account: AccountEntity,
    accessToken: String,
    private val onExternalNavigation: (String) -> Unit,
    private val onBridgeMessage: (String) -> Unit,
    private val onSaveState: (RestorableWebViewState) -> Unit,
    private val onOpenNewTab: (String) -> Unit,
    private val onLongPressLink: (String) -> Unit,
    private val onMainFrameError: (String?) -> Unit,
    private val onShowFileChooser: (
        ValueCallback<Array<Uri>>,
        WebChromeClient.FileChooserParams,
    ) -> Boolean,
    private val onDownloadFailure: () -> Unit,
) : PooledWebViewHost {
    val view: WebView = WebView(context)

    private var documentStartScript: ScriptHandler? = null
    private var destroyed = false
    private var pendingScrollY: Int? = null

    init {
        configure(accessToken)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configure(accessToken: String) {
        WebView.setWebContentsDebuggingEnabled(false)
        ProfileStore.getInstance().getOrCreateProfile(account.profileName)
        WebViewCompat.setProfile(view, account.profileName)

        view.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            mediaPlaybackRequiresUserGesture = true
            setSupportMultipleWindows(true)
        }
        view.webViewClient = object : WebViewClient() {
            override fun onPageStarted(webView: WebView, url: String, favicon: Bitmap?) {
                onMainFrameError(null)
            }

            override fun onPageFinished(webView: WebView, url: String) {
                pendingScrollY?.let { scrollY ->
                    pendingScrollY = null
                    webView.scrollTo(0, scrollY)
                }
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
                WebViewCompat.setProfile(popup, account.profileName)
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
            if (hit.type == WebView.HitTestResult.SRC_ANCHOR_TYPE ||
                hit.type == WebView.HitTestResult.SRC_IMAGE_ANCHOR_TYPE
            ) {
                hit.extra?.let(onLongPressLink) != null
            } else {
                false
            }
        }

        installDocumentStartScript(accessToken)
        WebViewCompat.addWebMessageListener(
            view,
            BRIDGE_NAME,
            DomainPolicy.trustedOrigins,
        ) { _: WebView, message: WebMessageCompat, _, isMainFrame: Boolean, _ ->
            if (isMainFrame) {
                message.data?.let(onBridgeMessage)
            }
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
        installDocumentStartScript(accessToken)
        val currentUrl = view.url
        if (currentUrl != null && DomainPolicy.classify(currentUrl) is NavigationTarget.Internal) {
            view.evaluateJavascript(WebAuthScript.update(accessToken), null)
        }
    }

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

    fun clearProfileData() {
        if (destroyed) return
        val profile = WebViewCompat.getProfile(view)
        profile.cookieManager.removeAllCookies { profile.cookieManager.flush() }
        profile.webStorage.deleteAllData()
        profile.geolocationPermissions.clearAll()
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

    override fun resume() {
        if (destroyed) return
        view.resumeTimers()
        view.onResume()
    }

    override fun destroy(saveState: Boolean) {
        if (destroyed) return
        destroyed = true
        if (saveState) saveRestorableState()
        documentStartScript?.remove()
        documentStartScript = null
        WebViewCompat.removeWebMessageListener(view, BRIDGE_NAME)
        view.webViewClient = WebViewClient()
        view.webChromeClient = WebChromeClient()
        view.stopLoading()
        view.removeAllViews()
        view.destroy()
    }

    private fun installDocumentStartScript(accessToken: String) {
        documentStartScript?.remove()
        documentStartScript = WebViewCompat.addDocumentStartJavaScript(
            view,
            WebAuthScript.documentStart(account.binggan, accessToken),
            DomainPolicy.trustedOrigins,
        )
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

    private fun saveRestorableState() {
        val current = view.url ?: return
        val target = DomainPolicy.classify(current) as? NavigationTarget.Internal ?: return
        val path = buildString {
            append(target.uri.rawPath.ifBlank { "/" })
            target.uri.rawQuery?.let { append('?').append(it) }
            target.uri.rawFragment?.let { append('#').append(it) }
        }
        onSaveState(
            RestorableWebViewState(
                path = path,
                title = view.title.orEmpty(),
                scrollY = view.scrollY,
            ),
        )
    }

    private fun enqueueDownload(
        url: String,
        userAgent: String?,
        contentDisposition: String?,
        mimeType: String?,
    ) {
        val uri = Uri.parse(url)
        require(uri.scheme == "https")
        val fileName = URLUtil.guessFileName(url, contentDisposition, mimeType)
        val request = DownloadManager.Request(uri)
            .setTitle(fileName)
            .setMimeType(mimeType)
            .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName)
        userAgent?.takeIf { it.isNotBlank() }?.let { request.addRequestHeader("User-Agent", it) }
        WebViewCompat.getProfile(view).cookieManager.getCookie(url)
            ?.takeIf { it.isNotBlank() }
            ?.let { request.addRequestHeader("Cookie", it) }
        val manager = view.context.getSystemService(DownloadManager::class.java)
        manager.enqueue(request)
    }

    companion object {
        const val BRIDGE_NAME = "CpttmmAndroid"
    }
}
