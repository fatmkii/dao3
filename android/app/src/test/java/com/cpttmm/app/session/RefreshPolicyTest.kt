package com.cpttmm.app.session

import com.cpttmm.app.data.local.AccountEntity
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class RefreshPolicyTest {
    private val now = 1_000_000L

    @Test
    fun `refreshes before webview when less than five minutes remain`() {
        assertTrue(
            RefreshPolicy.needsRefresh(
                account(expiresAt = now + RefreshPolicy.BEFORE_WEB_VIEW_MILLIS - 1),
                nowMillis = now,
                minimumRemainingMillis = RefreshPolicy.BEFORE_WEB_VIEW_MILLIS,
            ),
        )
    }

    @Test
    fun `does not refresh at the exact threshold`() {
        assertFalse(
            RefreshPolicy.needsRefresh(
                account(expiresAt = now + RefreshPolicy.ON_FOREGROUND_MILLIS),
                nowMillis = now,
                minimumRemainingMillis = RefreshPolicy.ON_FOREGROUND_MILLIS,
            ),
        )
    }

    @Test
    fun `foreground refreshes below ten minute threshold`() {
        assertTrue(
            RefreshPolicy.needsRefresh(
                account(expiresAt = now + RefreshPolicy.ON_FOREGROUND_MILLIS - 1),
                nowMillis = now,
                minimumRemainingMillis = RefreshPolicy.ON_FOREGROUND_MILLIS,
            ),
        )
    }

    @Test
    fun `expired access token always refreshes`() {
        assertTrue(
            RefreshPolicy.needsRefresh(
                account(expiresAt = now - 1),
                nowMillis = now,
                minimumRemainingMillis = RefreshPolicy.BEFORE_WEB_VIEW_MILLIS,
            ),
        )
    }

    private fun account(expiresAt: Long) = AccountEntity(
        id = "account-id",
        binggan = "cookie",
        alias = "饼干#1",
        storageNamespace = "profile-random",
        cachedThemeName = null,
        accessExpiresAtMillis = expiresAt,
        idleExpiresAtMillis = Long.MAX_VALUE,
        lastUsedAtMillis = now,
    )
}
