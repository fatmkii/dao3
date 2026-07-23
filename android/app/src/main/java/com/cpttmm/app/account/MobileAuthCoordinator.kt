package com.cpttmm.app.account

import android.os.Build
import com.cpttmm.app.BuildConfig
import com.cpttmm.app.common.SingleFlight
import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.network.MobileApi
import com.cpttmm.app.network.MobileApiException
import com.cpttmm.app.network.MobileReleaseInfo
import com.cpttmm.app.network.RegistrationStatus
import com.cpttmm.app.preferences.GlobalPreferencesRepository
import com.cpttmm.app.registration.RegistrationDeviceIdProvider
import com.cpttmm.app.session.RefreshPolicy
import kotlinx.coroutines.flow.first

class MobileAuthCoordinator(
    private val api: MobileApi,
    private val accounts: SecureAccountRepository,
    private val preferences: GlobalPreferencesRepository,
    private val registrationDeviceId: RegistrationDeviceIdProvider,
    private val nowMillis: () -> Long = System::currentTimeMillis,
) {
    private val refreshFlights = SingleFlight<String, String>()

    suspend fun login(binggan: String, password: String?): String {
        val session = api.login(
            domain = preferences.domain.first(),
            binggan = binggan,
            password = password,
            installationId = preferences.installationId(),
            deviceName = Build.MODEL,
            appVersion = BuildConfig.VERSION_NAME,
        )

        return accounts.saveSession(session)
    }

    suspend fun register(): String {
        val digest = registrationDeviceId.digestOrNull() ?: throw SsaidUnavailableException()
        val session = api.register(
            domain = preferences.domain.first(),
            registrationDeviceDigest = digest,
            installationId = preferences.installationId(),
            deviceName = Build.MODEL,
            appVersion = BuildConfig.VERSION_NAME,
        )

        return accounts.saveSession(session)
    }

    suspend fun registrationStatus(domain: AppDomain): RegistrationStatus = api.registrationStatus(domain)

    suspend fun refresh(accountId: String, domain: AppDomain): String {
        return refreshFlights.run(accountId) {
            val tokens = accounts.decryptedTokens(accountId) ?: throw MissingAccountSecretsException()
            try {
                val refreshedSession = api.refresh(domain, tokens.refreshToken)
                accounts.saveSession(refreshedSession)
                refreshedSession.accessToken
            } catch (failure: Exception) {
                if (!failure.isTerminalRefreshFailure()) throw failure

                accounts.invalidateSession(accountId)
                throw MobileSessionExpiredException(failure)
            }
        }
    }

    suspend fun accessTokenForWebView(
        account: com.cpttmm.app.data.local.AccountEntity,
        domain: AppDomain,
        minimumRemainingMillis: Long = RefreshPolicy.BEFORE_WEB_VIEW_MILLIS,
    ): String {
        if (RefreshPolicy.needsRefresh(account, nowMillis(), minimumRemainingMillis)) {
            refresh(account.id, domain)
        }

        return accounts.decryptedTokens(account.id)?.accessToken
            ?: throw MissingAccountSecretsException()
    }

    suspend fun releaseInfo(domain: AppDomain): MobileReleaseInfo = api.version(domain)

}

class SsaidUnavailableException : IllegalStateException("无法读取 Android 设备标识，请改用网页版领取或联系管理员")

open class MobileSessionUnavailableException(
    message: String,
    cause: Throwable? = null,
) : IllegalStateException(message, cause)

class MobileSessionExpiredException(cause: Throwable) :
    MobileSessionUnavailableException("移动会话已失效，请重新登录", cause)

class MissingAccountSecretsException :
    MobileSessionUnavailableException("账号凭据不存在，请重新登录")

internal fun Throwable.isTerminalRefreshFailure(): Boolean =
    this is MobileApiException && (code == HTTP_UNAUTHORIZED || code == MOBILE_SESSION_UNAUTHORIZED)

private const val HTTP_UNAUTHORIZED = 401
private const val MOBILE_SESSION_UNAUTHORIZED = 21401
