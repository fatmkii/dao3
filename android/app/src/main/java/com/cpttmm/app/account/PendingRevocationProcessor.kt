package com.cpttmm.app.account

import android.content.Context
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.cpttmm.app.CpttmmApplication
import com.cpttmm.app.crypto.TokenCipher
import com.cpttmm.app.data.local.AppDatabase
import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.network.MobileApi

class PendingRevocationProcessor(
    database: AppDatabase,
    private val cipher: TokenCipher,
    private val api: MobileApi,
    private val domain: suspend () -> AppDomain,
) {
    private val dao = database.accountDao()

    suspend fun process(): Boolean {
        for (revocation in dao.pendingRevocations()) {
            val refreshToken = runCatching {
                cipher.decrypt(revocation.encryptedRefreshToken, revocation.accountId)
            }.getOrElse { return false }
            runCatching { api.logout(domain(), refreshToken) }
                .onSuccess { dao.deletePendingRevocation(revocation) }
                .onFailure { return false }
        }
        return true
    }
}

class PendingRevocationWorker(
    context: Context,
    parameters: WorkerParameters,
) : CoroutineWorker(context, parameters) {
    override suspend fun doWork(): Result {
        val app = applicationContext as CpttmmApplication
        return if (app.pendingRevocations.process()) Result.success() else Result.retry()
    }

    companion object {
        private const val WORK_NAME = "pending-mobile-session-revocations"

        fun enqueue(context: Context) {
            val request = OneTimeWorkRequestBuilder<PendingRevocationWorker>()
                .setConstraints(
                    Constraints.Builder()
                        .setRequiredNetworkType(NetworkType.CONNECTED)
                        .build(),
                )
                .build()
            WorkManager.getInstance(context).enqueueUniqueWork(
                WORK_NAME,
                ExistingWorkPolicy.KEEP,
                request,
            )
        }
    }
}
