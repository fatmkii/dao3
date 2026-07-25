package com.cpttmm.app.session

import com.cpttmm.app.data.local.AccountEntity

object RefreshPolicy {
    const val BEFORE_WEB_VIEW_MILLIS = 5 * 60 * 1000L
    const val ON_FOREGROUND_MILLIS = 10 * 60 * 1000L

    fun needsRefresh(
        account: AccountEntity,
        nowMillis: Long,
        minimumRemainingMillis: Long,
    ): Boolean = account.accessExpiresAtMillis - nowMillis < minimumRemainingMillis
}
