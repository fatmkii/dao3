package com.cpttmm.app.registration

import android.content.Context
import android.provider.Settings
import java.security.MessageDigest

object RegistrationDeviceDigest {
    private const val PREFIX = "com.cpttmm.app:registration:v1"

    fun fromSsaid(ssaid: String?): String? {
        if (ssaid.isNullOrBlank()) return null

        return MessageDigest.getInstance("SHA-256")
            .digest((PREFIX + ssaid).toByteArray(Charsets.UTF_8))
            .joinToString(separator = "") { byte -> "%02x".format(byte) }
    }
}

class RegistrationDeviceIdProvider(
    private val context: Context,
) {
    fun digestOrNull(): String? {
        val ssaid = Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)

        return RegistrationDeviceDigest.fromSsaid(ssaid)
    }
}
