package com.cpttmm.app.diagnostics

import android.content.Context
import android.os.Build
import com.cpttmm.app.BuildConfig
import com.cpttmm.app.navigation.AppDomain
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.time.Instant
import java.util.UUID

enum class DiagnosticEvent {
    APP_STARTED,
    WEBVIEW_MAIN_FRAME_ERROR,
    AUTH_REFRESH_FAILED,
    FILE_CHOOSER_FAILED,
    DOWNLOAD_FAILED,
}

enum class AccountOperationStage {
    API_REQUEST,
    RESPONSE_PARSE,
    TOKEN_ENCRYPT,
    DATABASE_SAVE,
}

data class DiagnosticIncident(
    val id: String,
    val copyText: String,
)

fun interface AccountFailureReporter {
    fun record(stage: AccountOperationStage, domain: AppDomain, failure: Throwable): DiagnosticIncident

    companion object {
        val NONE = AccountFailureReporter { stage, _, failure ->
            DiagnosticIncident(
                id = "unavailable",
                copyText = "stage=${stage.name}\nexception=${failure.javaClass.name}",
            )
        }
    }
}

class DiagnosticLogger(private val context: Context) : AccountFailureReporter {
    private val file = context.noBackupFilesDir.resolve("diagnostics.log")
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val lock = Any()

    fun record(event: DiagnosticEvent) {
        append("${Instant.now()} ${event.name}")
    }

    override fun record(
        stage: AccountOperationStage,
        domain: AppDomain,
        failure: Throwable,
    ): DiagnosticIncident {
        val incidentId = UUID.randomUUID().toString().take(8)
        val entry = JSONObject()
            .put("time", Instant.now().toString())
            .put("event", "ACCOUNT_OPERATION_FAILED")
            .put("stage", stage.name)
            .put("incident_id", incidentId)
            .put("exceptions", exceptionNames(failure).joinToString(" -> "))
            .put("app_version", BuildConfig.VERSION_NAME)
            .put("version_code", BuildConfig.VERSION_CODE)
            .put("android_sdk", Build.VERSION.SDK_INT)
            .put("manufacturer", Build.MANUFACTURER)
            .put("model", Build.MODEL)
            .put("domain", domain.host)
            .toString()
        append(entry)

        return DiagnosticIncident(incidentId, entry)
    }

    private fun append(entry: String) {
        scope.launch {
            synchronized(lock) {
                val retained = if (file.exists()) file.readLines().takeLast(MAX_ENTRIES - 1) else emptyList()
                file.writeText((retained + entry).joinToString("\n", postfix = "\n"))
            }
        }
    }

    private fun exceptionNames(failure: Throwable): List<String> =
        generateSequence(failure) { it.cause }
            .take(MAX_CAUSE_DEPTH)
            .map { it.javaClass.name }
            .toList()

    private companion object {
        const val MAX_ENTRIES = 250
        const val MAX_CAUSE_DEPTH = 5
    }
}
