package com.cpttmm.app.webview

import android.webkit.WebView
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import androidx.webkit.ProfileStore
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Assume.assumeTrue
import org.junit.Test
import org.junit.runner.RunWith
import java.util.UUID

@RunWith(AndroidJUnit4::class)
class ProfileIsolationTest {
    @Test
    fun cookiesDoNotLeakBetweenAccountProfiles() {
        assumeTrue(WebViewFeature.isFeatureSupported(WebViewFeature.MULTI_PROFILE))
        val firstName = "profile-isolation-first"
        val secondName = "profile-isolation-second"
        val origin = "https://cpttmm.com"
        val cookieValue = System.nanoTime().toString()

        InstrumentationRegistry.getInstrumentation().runOnMainSync {
            val context = ApplicationProvider.getApplicationContext<android.content.Context>()
            val firstView = WebView(context)
            val secondView = WebView(context)
            val store = ProfileStore.getInstance()
            store.getOrCreateProfile(firstName)
            store.getOrCreateProfile(secondName)
            WebViewCompat.setProfile(firstView, firstName)
            WebViewCompat.setProfile(secondView, secondName)
            val firstCookies = WebViewCompat.getProfile(firstView).cookieManager
            val secondCookies = WebViewCompat.getProfile(secondView).cookieManager

            firstCookies.setCookie(origin, "profile_isolation=$cookieValue; Secure")
            firstCookies.flush()

            assertTrue(firstCookies.getCookie(origin).orEmpty().contains("profile_isolation=$cookieValue"))
            assertFalse(secondCookies.getCookie(origin).orEmpty().contains("profile_isolation=$cookieValue"))

            firstView.destroy()
            secondView.destroy()
        }
    }

    @Test
    fun cleanerClearsProfileDataWhenDeletionIsDeferred() {
        assumeTrue(WebViewFeature.isFeatureSupported(WebViewFeature.MULTI_PROFILE))
        val profileName = "delete-${UUID.randomUUID()}"
        val origin = "https://cpttmm.com"
        val instrumentation = InstrumentationRegistry.getInstrumentation()

        instrumentation.runOnMainSync {
            val profile = ProfileStore.getInstance().getOrCreateProfile(profileName)
            profile.cookieManager.setCookie(origin, "account_secret=present; Secure")
            profile.cookieManager.flush()
        }
        instrumentation.runOnMainSync {
            WebProfileCleaner.clearAndDeleteWhenReleased(profileName)
        }

        var dataCleared = false
        repeat(20) {
            instrumentation.runOnMainSync {
                val profile = ProfileStore.getInstance().getProfile(profileName)
                dataCleared = profile == null ||
                    !profile.cookieManager.getCookie(origin).orEmpty().contains("account_secret=present")
            }
            if (dataCleared) return@repeat
            Thread.sleep(100)
        }
        assertTrue(dataCleared)
    }
}
