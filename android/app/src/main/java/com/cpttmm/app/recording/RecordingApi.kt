package com.cpttmm.app.recording

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.File
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URI
import java.security.MessageDigest
import java.util.Base64

class RecordingApi(
    private val origin: String,
    private val onUnauthorized: () -> Unit,
    private val token: () -> String,
) {
    suspend fun request(path: String, body: JSONObject? = null): JSONObject = withContext(Dispatchers.IO) {
        val connection = URI(origin).resolve("/api/mobile/recordings/$path").toURL().openConnection() as HttpURLConnection
        try {
            connection.requestMethod = if (body == null) "GET" else "POST"
            connection.instanceFollowRedirects = false
            connection.connectTimeout = 15000
            connection.readTimeout = 30000
            connection.setRequestProperty("Accept", "application/json")
            connection.setRequestProperty("Authorization", "Bearer ${token()}")
            if (body != null) {
                connection.doOutput = true
                connection.setRequestProperty("Content-Type", "application/json")
                connection.outputStream.use { it.write(body.toString().toByteArray()) }
            }
            if (connection.responseCode == 401) {
                withContext(Dispatchers.Main) { onUnauthorized() }
                error("登录状态正在刷新，请重试")
            }
            val stream = if (connection.responseCode in 200..299) connection.inputStream else connection.errorStream
            val json = JSONObject(stream?.bufferedReader()?.use { it.readText() }.orEmpty())
            check(connection.responseCode in 200..299 && json.optInt("code") == 200) {
                json.optString("message", "录音请求失败，请重试")
            }
            json.getJSONObject("data")
        } catch (error: IOException) {
            throw IOException("录音请求失败，请检查网络后重试", error)
        } finally {
            connection.disconnect()
        }
    }

    suspend fun upload(file: File, upload: JSONObject) = withContext(Dispatchers.IO) {
        val url = URI(upload.getString("url"))
        require(url.scheme == "https" && url.host != null && url.userInfo == null) { "上传地址无效" }
        val connection = url.toURL().openConnection() as HttpURLConnection
        try {
            connection.requestMethod = "PUT"
            connection.instanceFollowRedirects = false
            connection.connectTimeout = 15000
            connection.readTimeout = 30000
            connection.doOutput = true
            connection.setFixedLengthStreamingMode(file.length())
            val headers = upload.getJSONObject("headers")
            headers.keys().forEach { connection.setRequestProperty(it, headers.getString(it)) }
            file.inputStream().use { input -> connection.outputStream.use { input.copyTo(it) } }
            // A lost response can be retried: HEAD completion will verify the already uploaded object.
            check(connection.responseCode in 200..299 || connection.responseCode == 412) { "上传失败，请重试" }
        } catch (error: IOException) {
            throw IOException("上传失败，片段已保留，请检查网络后重试", error)
        } finally {
            connection.disconnect()
        }
    }

    companion object {
        fun md5(file: File): String {
            val digest = MessageDigest.getInstance("MD5")
            file.inputStream().use { stream ->
                val bytes = ByteArray(8192)
                while (true) {
                    val count = stream.read(bytes)
                    if (count < 0) break
                    digest.update(bytes, 0, count)
                }
            }
            return Base64.getEncoder().encodeToString(digest.digest())
        }
    }
}
