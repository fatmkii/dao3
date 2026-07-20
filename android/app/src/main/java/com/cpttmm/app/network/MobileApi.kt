package com.cpttmm.app.network

import com.cpttmm.app.navigation.AppDomain
import com.cpttmm.app.session.MobileSessionData

interface MobileApi {
    suspend fun login(
        domain: AppDomain,
        binggan: String,
        password: String?,
        installationId: String,
        deviceName: String,
        appVersion: String,
    ): MobileSessionData

    suspend fun register(
        domain: AppDomain,
        registrationDeviceDigest: String,
        installationId: String,
        deviceName: String,
        appVersion: String,
    ): MobileSessionData

    suspend fun refresh(domain: AppDomain, refreshToken: String): MobileSessionData

    suspend fun logout(domain: AppDomain, refreshToken: String)

    suspend fun customAccount(
        domain: AppDomain,
        accessToken: String,
        binggan: String,
        requestedBinggan: String,
        password: String,
        transfer: Boolean,
        installationId: String,
        deviceName: String,
        appVersion: String,
    ): MobileSessionData

    suspend fun version(domain: AppDomain): MobileReleaseInfo
}

class MobileApiException(
    val code: Int,
    override val message: String,
) : Exception(message)
