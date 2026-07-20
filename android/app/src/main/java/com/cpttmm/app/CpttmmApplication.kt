package com.cpttmm.app

import android.app.Application
import androidx.room.Room
import com.cpttmm.app.account.MobileAuthCoordinator
import com.cpttmm.app.account.BrowserTabRepository
import com.cpttmm.app.account.PendingRevocationProcessor
import com.cpttmm.app.account.PendingRevocationWorker
import com.cpttmm.app.account.SecureAccountRepository
import com.cpttmm.app.crypto.AndroidKeystoreTokenCipher
import com.cpttmm.app.data.local.AppDatabase
import com.cpttmm.app.diagnostics.DiagnosticEvent
import com.cpttmm.app.diagnostics.DiagnosticLogger
import com.cpttmm.app.network.HttpMobileApi
import com.cpttmm.app.preferences.GlobalPreferencesRepository
import com.cpttmm.app.registration.RegistrationDeviceIdProvider
import kotlinx.coroutines.flow.first

class CpttmmApplication : Application() {
    private val tokenCipher by lazy { AndroidKeystoreTokenCipher() }

    val database: AppDatabase by lazy {
        Room.databaseBuilder(this, AppDatabase::class.java, "cpttmm.db").build()
    }

    val preferences: GlobalPreferencesRepository by lazy {
        GlobalPreferencesRepository(this)
    }

    val accounts: SecureAccountRepository by lazy {
        SecureAccountRepository(database, tokenCipher)
    }

    val tabs: BrowserTabRepository by lazy {
        BrowserTabRepository(database)
    }

    val diagnostics: DiagnosticLogger by lazy { DiagnosticLogger(this) }

    val auth: MobileAuthCoordinator by lazy {
        MobileAuthCoordinator(
            api = HttpMobileApi(),
            accounts = accounts,
            preferences = preferences,
            registrationDeviceId = RegistrationDeviceIdProvider(this),
        )
    }

    val pendingRevocations: PendingRevocationProcessor by lazy {
        PendingRevocationProcessor(
            database = database,
            cipher = tokenCipher,
            api = HttpMobileApi(),
            domain = { preferences.domain.first() },
        )
    }

    override fun onCreate() {
        super.onCreate()
        diagnostics.record(DiagnosticEvent.APP_STARTED)
        PendingRevocationWorker.enqueue(this)
    }
}
