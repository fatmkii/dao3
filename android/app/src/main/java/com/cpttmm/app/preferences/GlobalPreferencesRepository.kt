package com.cpttmm.app.preferences

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.booleanPreferencesKey
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

    val themePreferences: Flow<AppThemePreferences> = context.globalDataStore.data.map(::themePreferences)

    val keepTabsAfterClose: Flow<Boolean> = context.globalDataStore.data.map { preferences ->
        preferences[KEEP_TABS_AFTER_CLOSE] ?: true
    }

    suspend fun setDomain(domain: AppDomain) {
        context.globalDataStore.edit { it[DOMAIN] = domain.host }
    }

    suspend fun setKeepTabsAfterClose(enabled: Boolean) {
        context.globalDataStore.edit { it[KEEP_TABS_AFTER_CLOSE] = enabled }
    }

    suspend fun initializeThemePreferences(migratedThemeName: String?) {
        context.globalDataStore.edit { preferences ->
            if (preferences[THEME_INITIALIZED] == true) return@edit
            val migratedTheme = AppTheme.fromStorage(migratedThemeName) ?: AppTheme.GREEN
            preferences[THEME_FOLLOW_SYSTEM] = false
            preferences[THEME_LIGHT] = AppTheme.GREEN.storageValue
            preferences[THEME_DARK] = AppTheme.DARK.storageValue
            preferences[THEME_MANUAL] = migratedTheme.storageValue
            preferences[THEME_INITIALIZED] = true
        }
    }

    suspend fun repairThemePreferences() {
        context.globalDataStore.edit(::writeValidThemePreferences)
    }

    suspend fun setFollowSystem(enabled: Boolean, isSystemDark: Boolean) {
        context.globalDataStore.edit { preferences ->
            val current = themePreferences(preferences)
            if (!enabled) {
                preferences[THEME_MANUAL] = current.themeFor(isSystemDark).storageValue
            }
            preferences[THEME_FOLLOW_SYSTEM] = enabled
            writeValidThemePreferences(preferences)
        }
    }

    suspend fun setThemeForSystemMode(isDarkMode: Boolean, theme: AppTheme) {
        context.globalDataStore.edit { preferences ->
            preferences[if (isDarkMode) THEME_DARK else THEME_LIGHT] = theme.storageValue
            writeValidThemePreferences(preferences)
        }
    }

    suspend fun recordWebTheme(theme: AppTheme, isSystemDark: Boolean) {
        context.globalDataStore.edit { preferences ->
            writeThemePreferences(
                preferences,
                themePreferences(preferences).afterWebThemeChanged(theme, isSystemDark),
            )
        }
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

    private fun themePreferences(
        preferences: androidx.datastore.preferences.core.Preferences,
    ): AppThemePreferences {
        val lightTheme = AppTheme.fromStorage(preferences[THEME_LIGHT])
        val darkTheme = AppTheme.fromStorage(preferences[THEME_DARK])
        val manualTheme = AppTheme.fromStorage(preferences[THEME_MANUAL])
        val initialized = preferences[THEME_INITIALIZED] ?: false
        return AppThemePreferences(
            followSystem = preferences[THEME_FOLLOW_SYSTEM] ?: false,
            lightTheme = lightTheme ?: AppTheme.GREEN,
            darkTheme = darkTheme ?: AppTheme.DARK,
            manualTheme = manualTheme ?: AppTheme.GREEN,
            initialized = initialized,
            requiresRepair = initialized && (lightTheme == null || darkTheme == null || manualTheme == null),
        )
    }

    private fun writeValidThemePreferences(
        preferences: androidx.datastore.preferences.core.MutablePreferences,
    ) {
        writeThemePreferences(preferences, themePreferences(preferences))
    }

    private fun writeThemePreferences(
        preferences: androidx.datastore.preferences.core.MutablePreferences,
        themePreferences: AppThemePreferences,
    ) {
        preferences[THEME_LIGHT] = themePreferences.lightTheme.storageValue
        preferences[THEME_DARK] = themePreferences.darkTheme.storageValue
        preferences[THEME_MANUAL] = themePreferences.manualTheme.storageValue
        preferences[THEME_INITIALIZED] = true
    }

    private companion object {
        val DOMAIN = stringPreferencesKey("domain")
        val INSTALLATION_ID = stringPreferencesKey("installation_id")
        val PENDING_STORAGE_CLEANUPS = stringSetPreferencesKey("pending_storage_cleanups")
        val THEME_FOLLOW_SYSTEM = booleanPreferencesKey("theme_follow_system")
        val THEME_LIGHT = stringPreferencesKey("theme_light")
        val THEME_DARK = stringPreferencesKey("theme_dark")
        val THEME_MANUAL = stringPreferencesKey("theme_manual")
        val THEME_INITIALIZED = booleanPreferencesKey("theme_initialized")
        val KEEP_TABS_AFTER_CLOSE = booleanPreferencesKey("keep_tabs_after_close")
    }
}
