package com.cpttmm.app.network

import java.time.Instant

data class RegistrationStatus(
    val isOpen: Boolean,
    val nextOpenAt: Instant,
    val ipCooldownSeconds: Long,
) {
    val canRegister: Boolean
        get() = isOpen && ipCooldownSeconds <= 0
}
