package com.cpttmm.app.network

data class MobileReleaseInfo(
    val versionName: String,
    val versionCode: Int,
    val notes: String,
    val apkUrl: String,
    val githubUrl: String,
    val sha256: String,
)
