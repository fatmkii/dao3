package com.cpttmm.app.account

import android.os.Build
import com.cpttmm.app.BuildConfig
import com.cpttmm.app.common.SingleFlight
import com.cpttmm.app.diagnostics.AccountFailureReporter
import com.cpttmm.app.diagnostics.AccountOperationStage
import com.cpttmm.app.diagnostics.DiagnosticIncident
import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.network.MobileApi
import com.cpttmm.app.network.MobileApiException
import com.cpttmm.app.network.MobileReleaseInfo
import com.cpttmm.app.network.MobileSessionParseException
import com.cpttmm.app.network.RegistrationStatus
import com.cpttmm.app.preferences.GlobalPreferencesRepository
import com.cpttmm.app.registration.RegistrationDeviceIdProvider
import com.cpttmm.app.session.MobileSessionData
import com.cpttmm.app.session.RefreshPolicy
import com.cpttmm.app.session.TokenEncryptionException
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.flow.first
import java.io.IOException

class MobileAuthCoordinator(
    private val api: MobileApi,
    private val accounts: SecureAccountRepository,
    private val preferences: GlobalPreferencesRepository,
    private val registrationDeviceId: RegistrationDeviceIdProvider,
    private val failureReporter: AccountFailureReporter = AccountFailureReporter.NONE,
    private val nowMillis: () -> Long = System::currentTimeMillis,
) {
    private val refreshFlights = SingleFlight<String, String>()

    suspend fun login(binggan: String, password: String?): SavedAccount {
        val domain = preferences.domain.first()
        return requestAndSave(domain) {
            api.login(
                domain = domain,
                binggan = binggan,
                password = password,
                installationId = preferences.installationId(),
                deviceName = Build.MODEL,
                appVersion = BuildConfig.VERSION_NAME,
            )
        }
    }

    suspend fun register(): SavedAccount {
        val digest = registrationDeviceId.digestOrNull() ?: throw SsaidUnavailableException()
        val domain = preferences.domain.first()
        return requestAndSave(domain) {
            api.register(
                domain = domain,
                registrationDeviceDigest = digest,
                installationId = preferences.installationId(),
                deviceName = Build.MODEL,
                appVersion = BuildConfig.VERSION_NAME,
            )
        }
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

    private suspend fun requestAndSave(
        domain: AppDomain,
        request: suspend () -> MobileSessionData,
    ): SavedAccount {
        val session = try {
            request()
        } catch (failure: CancellationException) {
            throw failure
        } catch (failure: MobileApiException) {
            throw failure
        } catch (failure: IOException) {
            throw failure
        } catch (failure: Exception) {
            val stage = if (failure is MobileSessionParseException) {
                AccountOperationStage.RESPONSE_PARSE
            } else {
                AccountOperationStage.API_REQUEST
            }
            throw diagnosed(stage, domain, failure)
        }

        try {
            return accounts.saveSession(session)
        } catch (failure: CancellationException) {
            throw failure
        } catch (failure: AccountLimitException) {
            throw failure
        } catch (failure: Exception) {
            val stage = if (failure is TokenEncryptionException) {
                AccountOperationStage.TOKEN_ENCRYPT
            } else {
                AccountOperationStage.DATABASE_SAVE
            }
            throw diagnosed(stage, domain, failure)
        }
    }

    private fun diagnosed(
        stage: AccountOperationStage,
        domain: AppDomain,
        failure: Throwable,
    ): AccountOperationException =
        AccountOperationException(failureReporter.record(stage, domain, failure), failure)
}

class AccountOperationException(
    val incident: DiagnosticIncident,
    cause: Throwable,
) : IllegalStateException("Account operation failed", cause)

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
