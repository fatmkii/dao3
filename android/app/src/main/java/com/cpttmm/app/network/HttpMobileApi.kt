package com.cpttmm.app.network

import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.navigation.DomainPolicy
import com.cpttmm.app.session.MobileSessionData
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.time.Instant

class HttpMobileApi : MobileApi {
    override suspend fun login(
        domain: AppDomain,
        binggan: String,
        password: String?,
        installationId: String,
        deviceName: String,
        appVersion: String,
    ): MobileSessionData {
        val request = JSONObject()
            .put("binggan", binggan)
            .put("installation_id", installationId)
            .put("device_name", deviceName)
            .put("app_version", appVersion)
        if (password != null) request.put("password", password)

        return session(post(domain, "login", request))
    }

    override suspend fun register(
        domain: AppDomain,
        registrationDeviceDigest: String,
        installationId: String,
        deviceName: String,
        appVersion: String,
    ): MobileSessionData {
        return session(
            post(
                domain,
                "register",
                JSONObject()
                    .put("registration_device_digest", registrationDeviceDigest)
                    .put("installation_id", installationId)
                    .put("device_name", deviceName)
                    .put("app_version", appVersion),
            ),
        )
    }

    override suspend fun registrationStatus(domain: AppDomain): RegistrationStatus {
        val data = get(domain, "registration-status")
        return RegistrationStatus(
            isOpen = data.getBoolean("enable"),
            nextOpenAt = Instant.ofEpochSecond(data.getLong("next_date")),
            ipCooldownSeconds = data.getLong("reg_record_TTL"),
        )
    }

    override suspend fun refresh(domain: AppDomain, refreshToken: String): MobileSessionData {
        return session(post(domain, "token/refresh", JSONObject().put("refresh_token", refreshToken)))
    }

    override suspend fun logout(domain: AppDomain, refreshToken: String) {
        post(domain, "logout", JSONObject().put("refresh_token", refreshToken))
    }

    override suspend fun version(domain: AppDomain): MobileReleaseInfo {
        val data = get(domain, "version")
        return MobileReleaseInfo(
            versionName = data.getString("version_name"),
            versionCode = data.getInt("version_code"),
            notes = data.optString("notes"),
            apkUrl = data.optString("apk_url"),
            githubUrl = data.optString("github_url"),
            sha256 = data.optString("sha256"),
        )
    }

    private suspend fun post(
        domain: AppDomain,
        path: String,
        request: JSONObject,
        accessToken: String? = null,
    ): JSONObject =
        withContext(Dispatchers.IO) {
            val connection = DomainPolicy.home(domain).resolve("/api/mobile/$path")
                .toURL()
                .openConnection() as HttpURLConnection
            try {
                connection.requestMethod = "POST"
                connection.instanceFollowRedirects = false
                connection.connectTimeout = TIMEOUT_MILLIS
                connection.readTimeout = TIMEOUT_MILLIS
                connection.doOutput = true
                connection.setRequestProperty("Accept", "application/json")
                connection.setRequestProperty("Content-Type", "application/json; charset=utf-8")
                accessToken?.let { connection.setRequestProperty("Authorization", "Bearer $it") }
                connection.outputStream.use { output ->
                    output.write(request.toString().toByteArray(Charsets.UTF_8))
                }

                val responseStream = if (connection.responseCode in 200..299) {
                    connection.inputStream
                } else {
                    connection.errorStream
                }
                val response = responseStream?.bufferedReader()?.use { it.readText() }.orEmpty()
                val json = runCatching { JSONObject(response) }
                    .getOrElse {
                        throw MobileApiException(connection.responseCode, invalidResponseMessage(response))
                    }
                if (connection.responseCode == HttpURLConnection.HTTP_NOT_FOUND ||
                    connection.responseCode == HttpURLConnection.HTTP_BAD_METHOD
                ) {
                    throw MobileApiException(connection.responseCode, MISSING_MOBILE_API_MESSAGE)
                }
                val code = json.optInt("code", connection.responseCode)
                if (code != SUCCESS_CODE) {
                    throw MobileApiException(code, json.optString("message", "请求失败"))
                }

                json.optJSONObject("data") ?: JSONObject()
            } finally {
                connection.disconnect()
            }
        }

    private suspend fun get(domain: AppDomain, path: String): JSONObject = withContext(Dispatchers.IO) {
        val connection = DomainPolicy.home(domain).resolve("/api/mobile/$path")
            .toURL()
            .openConnection() as HttpURLConnection
        try {
            connection.requestMethod = "GET"
            connection.instanceFollowRedirects = false
            connection.connectTimeout = TIMEOUT_MILLIS
            connection.readTimeout = TIMEOUT_MILLIS
            connection.setRequestProperty("Accept", "application/json")
            val responseStream = if (connection.responseCode in 200..299) {
                connection.inputStream
            } else {
                connection.errorStream
            }
            val response = responseStream?.bufferedReader()?.use { it.readText() }.orEmpty()
            val json = runCatching { JSONObject(response) }
                .getOrElse {
                    throw MobileApiException(connection.responseCode, invalidResponseMessage(response))
                }
            if (connection.responseCode == HttpURLConnection.HTTP_NOT_FOUND ||
                connection.responseCode == HttpURLConnection.HTTP_BAD_METHOD
            ) {
                throw MobileApiException(connection.responseCode, MISSING_MOBILE_API_MESSAGE)
            }
            val code = json.optInt("code", connection.responseCode)
            if (code != SUCCESS_CODE) {
                throw MobileApiException(code, json.optString("message", "请求失败"))
            }
            json.optJSONObject("data") ?: JSONObject()
        } finally {
            connection.disconnect()
        }
    }

    private fun session(data: JSONObject): MobileSessionData {
        return MobileSessionData(
            binggan = data.getString("binggan"),
            accessToken = data.getString("access_token"),
            accessExpiresAt = Instant.parse(data.getString("access_expires_at")),
            refreshToken = data.getString("refresh_token"),
            idleExpiresAt = Instant.parse(data.getString("idle_expires_at")),
            absoluteExpiresAt = Instant.parse(data.getString("absolute_expires_at")),
        )
    }

    private fun invalidResponseMessage(response: String): String =
        if (response.trimStart().startsWith("<")) {
            MISSING_MOBILE_API_MESSAGE
        } else {
            "服务器返回了无法识别的响应。"
        }

    private companion object {
        const val SUCCESS_CODE = 200
        const val TIMEOUT_MILLIS = 15_000
        const val MISSING_MOBILE_API_MESSAGE = "服务器尚未部署 Android 接口，请稍后重试。"
    }
}
