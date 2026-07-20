package com.cpttmm.app.navigation

import com.cpttmm.app.BuildConfig
import java.net.URI

enum class AppDomain(val host: String) {
    PRIMARY("cpttmm.com"),
    FALLBACK("cpttmm.love"),
}

sealed interface NavigationTarget {
    data class Internal(val uri: URI) : NavigationTarget
    data class External(val uri: URI) : NavigationTarget
    data object Blocked : NavigationTarget
}

object DomainPolicy {
    private val localServer = BuildConfig.LOCAL_SERVER_URL
        .takeIf { BuildConfig.DEBUG && it.isNotBlank() }
        ?.let(::URI)

    val trustedOrigins: Set<String> = AppDomain.entries
        .mapTo(linkedSetOf()) { "https://${it.host}" }
        .apply { localServer?.let { add(it.toString().trimEnd('/')) } }

    fun home(domain: AppDomain): URI = localServer ?: URI("https://${domain.host}/")

    fun classify(rawUrl: String): NavigationTarget {
        val uri = runCatching { URI(rawUrl) }.getOrNull() ?: return NavigationTarget.Blocked
        if (uri.host.isNullOrBlank() || uri.userInfo != null) {
            return NavigationTarget.Blocked
        }
        if (localServer != null && sameOrigin(uri, localServer)) return NavigationTarget.Internal(uri)
        if (uri.scheme?.lowercase() != "https") return NavigationTarget.Blocked
        if (uri.port != -1 && uri.port != 443) return NavigationTarget.Blocked

        val bareHost = uri.host.lowercase().removePrefix("www.")
        val appDomain = AppDomain.entries.firstOrNull { it.host == bareHost }
            ?: return NavigationTarget.External(uri)

        return NavigationTarget.Internal(
            URI(
                "https",
                null,
                appDomain.host,
                -1,
                uri.path,
                uri.query,
                uri.fragment,
            ),
        )
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
