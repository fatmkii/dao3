package com.cpttmm.app.session

import java.time.Instant

data class MobileSessionData(
    val binggan: String,
    val accessToken: String,
    val accessExpiresAt: Instant,
    val refreshToken: String,
    val idleExpiresAt: Instant,
)
