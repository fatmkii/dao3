package com.cpttmm.app.navigation

import com.cpttmm.app.BuildConfig
import java.net.URI

enum class AppDomain(val host: String) {
    PRIMARY(URI(BuildConfig.PRODUCTION_PRIMARY_ORIGIN).host),
    FALLBACK(URI(BuildConfig.PRODUCTION_FALLBACK_ORIGIN).host),
}

sealed interface NavigationTarget {
    data class Internal(val uri: URI) : NavigationTarget
    data class External(val uri: URI) : NavigationTarget
    data object Blocked : NavigationTarget
}

object DomainPolicy {
    private val developmentServer = BuildConfig.DEVELOPMENT_SERVER_ORIGIN
        .takeIf { BuildConfig.DEBUG && it.isNotBlank() }
        ?.let(::URI)
    private val productionOrigins = linkedMapOf(
        AppDomain.PRIMARY to URI(BuildConfig.PRODUCTION_PRIMARY_ORIGIN),
        AppDomain.FALLBACK to URI(BuildConfig.PRODUCTION_FALLBACK_ORIGIN),
    )

    val trustedOrigins: Set<String> = if (BuildConfig.DEBUG) {
        setOf(requireNotNull(developmentServer).toString().trimEnd('/'))
    } else {
        productionOrigins.values.mapTo(linkedSetOf()) { it.toString().trimEnd('/') }
    }

    fun home(domain: AppDomain): URI = developmentServer ?: productionOrigins.getValue(domain)

    fun classify(rawUrl: String): NavigationTarget {
        val uri = runCatching { URI(rawUrl) }.getOrNull() ?: return NavigationTarget.Blocked
        if (uri.host.isNullOrBlank() || uri.userInfo != null) {
            return NavigationTarget.Blocked
        }
        if (developmentServer != null && sameOrigin(uri, developmentServer)) {
            return NavigationTarget.Internal(uri)
        }
        if (uri.scheme?.lowercase() != "https") return NavigationTarget.Blocked
        if (uri.port != -1 && uri.port != 443) return NavigationTarget.Blocked

        val bareHost = uri.host.lowercase().removePrefix("www.")
        val appDomain = AppDomain.entries.firstOrNull { it.host == bareHost }
            ?: return NavigationTarget.External(uri)
        if (BuildConfig.DEBUG) return NavigationTarget.External(uri)

        return NavigationTarget.Internal(
            productionOrigins.getValue(appDomain).resolve(
                URI(null, null, uri.path, uri.query, uri.fragment),
            ),
        )
    }

    fun internalPath(rawUrl: String): String? {
        val target = classify(rawUrl) as? NavigationTarget.Internal ?: return null
        return buildString {
            append(target.uri.rawPath.ifBlank { "/" })
            target.uri.rawQuery?.let { append('?').append(it) }
            target.uri.rawFragment?.let { append('#').append(it) }
        }
    }

    fun trustedOrigin(rawUrl: String): String? {
        val target = classify(rawUrl) as? NavigationTarget.Internal ?: return null
        val uri = target.uri
        return buildString {
            append(uri.scheme.lowercase()).append("://").append(uri.host.lowercase())
            if (uri.port != -1 && uri.port != effectivePort(URI("${uri.scheme}://${uri.host}"))) {
                append(':').append(uri.port)
            }
        }.takeIf(trustedOrigins::contains)
    }

    private fun sameOrigin(uri: URI, origin: URI): Boolean =
        uri.scheme.equals(origin.scheme, ignoreCase = true) &&
            uri.host.equals(origin.host, ignoreCase = true) &&
            effectivePort(uri) == effectivePort(origin)

    private fun effectivePort(uri: URI): Int = when {
        uri.port != -1 -> uri.port
        uri.scheme.equals("https", ignoreCase = true) -> 443
        else -> 80
    }
}
