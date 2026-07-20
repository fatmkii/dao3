package com.cpttmm.app.webview

import android.os.Handler
import android.os.Looper
import androidx.webkit.ProfileStore
import androidx.webkit.WebViewFeature

object WebProfileCleaner {
    private const val MAX_DELETE_ATTEMPTS = 4
    private const val RETRY_DELAY_MILLIS = 250L

    fun clearAndDeleteWhenReleased(profileName: String) {
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.MULTI_PROFILE)) return
        check(Looper.myLooper() == Looper.getMainLooper())

        val store = ProfileStore.getInstance()
        if (runCatching { store.deleteProfile(profileName) }.isSuccess) return

        store.getProfile(profileName)?.let { profile ->
            profile.cookieManager.removeAllCookies { profile.cookieManager.flush() }
            profile.webStorage.deleteAllData()
            profile.geolocationPermissions.clearAll()
        }
        deleteWithRetry(store, profileName, attempt = 1)
    }

    private fun deleteWithRetry(store: ProfileStore, profileName: String, attempt: Int) {
        val result = runCatching { store.deleteProfile(profileName) }
        if (result.isFailure && attempt < MAX_DELETE_ATTEMPTS) {
            Handler(Looper.getMainLooper()).postDelayed(
                { deleteWithRetry(store, profileName, attempt + 1) },
                RETRY_DELAY_MILLIS,
            )
        }
    }
}
