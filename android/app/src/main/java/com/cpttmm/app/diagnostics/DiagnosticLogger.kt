package com.cpttmm.app.diagnostics

import android.content.Context
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import java.time.Instant

enum class DiagnosticEvent {
    APP_STARTED,
    WEBVIEW_MAIN_FRAME_ERROR,
    AUTH_REFRESH_FAILED,
    FILE_CHOOSER_FAILED,
    DOWNLOAD_FAILED,
}

class DiagnosticLogger(private val context: Context) {
    private val file = context.noBackupFilesDir.resolve("diagnostics.log")
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val lock = Any()

    fun record(event: DiagnosticEvent) {
        scope.launch {
            synchronized(lock) {
                val retained = if (file.exists()) file.readLines().takeLast(MAX_ENTRIES - 1) else emptyList()
                file.writeText((retained + "${Instant.now()} ${event.name}").joinToString("\n", postfix = "\n"))
            }
        }
    }

    private companion object {
        const val MAX_ENTRIES = 250
    }
}
