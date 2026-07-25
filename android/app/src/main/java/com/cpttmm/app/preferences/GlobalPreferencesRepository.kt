package com.cpttmm.app.preferences

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.cpttmm.app.navigation.AppDomain
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import java.util.UUID

private val Context.globalDataStore by preferencesDataStore(name = "global")

class GlobalPreferencesRepository(
    private val context: Context,
) {
    private val installIdMutex = Mutex()

    val domain: Flow<AppDomain> = context.globalDataStore.data.map { preferences ->
        AppDomain.entries.firstOrNull { it.host == preferences[DOMAIN] } ?: AppDomain.PRIMARY
    }

    suspend fun setDomain(domain: AppDomain) {
        context.globalDataStore.edit { it[DOMAIN] = domain.host }
    }

    suspend fun installationId(): String = installIdMutex.withLock {
        val existing = context.globalDataStore.data.first()[INSTALLATION_ID]
        if (existing != null) return@withLock existing

        val generated = UUID.randomUUID().toString()
        context.globalDataStore.edit { it[INSTALLATION_ID] = generated }
        generated
    }

    private companion object {
        val DOMAIN = stringPreferencesKey("domain")
        val INSTALLATION_ID = stringPreferencesKey("installation_id")
    }
}
