package com.cpttmm.app.preferences

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.navigation.DomainPolicy
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

    suspend fun queueStorageCleanup(storageNamespace: String) {
        val entries = AppDomain.entries.mapTo(mutableSetOf()) { domain ->
            cleanupEntry(DomainPolicy.home(domain).toString().trimEnd('/'), storageNamespace)
        }
        context.globalDataStore.edit { preferences ->
            preferences[PENDING_STORAGE_CLEANUPS] =
                preferences[PENDING_STORAGE_CLEANUPS].orEmpty() + entries
        }
    }

    suspend fun pendingStorageNamespaces(origin: String): Set<String> {
        val prefix = "${origin.trimEnd('/')}|"
        return context.globalDataStore.data.first()[PENDING_STORAGE_CLEANUPS]
            .orEmpty()
            .filterTo(mutableSetOf()) { it.startsWith(prefix) }
            .mapTo(mutableSetOf()) { it.removePrefix(prefix) }
    }

    suspend fun completeStorageCleanup(origin: String, storageNamespaces: Set<String>) {
        val normalizedOrigin = origin.trimEnd('/')
        val completed = storageNamespaces.mapTo(mutableSetOf()) {
            cleanupEntry(normalizedOrigin, it)
        }
        context.globalDataStore.edit { preferences ->
            preferences[PENDING_STORAGE_CLEANUPS] =
                preferences[PENDING_STORAGE_CLEANUPS].orEmpty() - completed
        }
    }

    private fun cleanupEntry(origin: String, storageNamespace: String) =
        "${origin.trimEnd('/')}|$storageNamespace"

    private companion object {
        val DOMAIN = stringPreferencesKey("domain")
        val INSTALLATION_ID = stringPreferencesKey("installation_id")
        val PENDING_STORAGE_CLEANUPS = stringSetPreferencesKey("pending_storage_cleanups")
    }
}
