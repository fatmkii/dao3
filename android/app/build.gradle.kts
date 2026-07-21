import com.android.build.api.variant.HasUnitTestBuilder
import java.net.URI

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.devtools.ksp")
    id("androidx.room")
}

val configuredVersionCode = providers.gradleProperty("VERSION_CODE").orNull?.toInt() ?: 1
val configuredVersionName = providers.gradleProperty("VERSION_NAME").orNull ?: "0.1.0"
val developmentServerOrigin = "http://192.168.1.210"
val productionPrimaryOrigin = "https://cpttmm.com"
val productionFallbackOrigin = "https://cpttmm.love"
val releaseKeystorePath = System.getenv("ANDROID_KEYSTORE_PATH")

fun validateServerOrigin(name: String, origin: String, expectedScheme: String) {
    val uri = URI(origin)
    require(
        uri.scheme == expectedScheme &&
            !uri.host.isNullOrBlank() &&
            uri.userInfo == null &&
            uri.rawPath.orEmpty().let { it.isEmpty() || it == "/" } &&
            uri.rawQuery == null &&
            uri.rawFragment == null
    ) { "$name must be a valid $expectedScheme origin without credentials, path, query, or fragment" }
}

validateServerOrigin("developmentServerOrigin", developmentServerOrigin, "http")
validateServerOrigin("productionPrimaryOrigin", productionPrimaryOrigin, "https")
validateServerOrigin("productionFallbackOrigin", productionFallbackOrigin, "https")

room {
    schemaDirectory("$projectDir/schemas")
}

android {
    namespace = "com.cpttmm.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.cpttmm.app"
        minSdk = 29
        targetSdk = 36
        versionCode = configuredVersionCode
        versionName = configuredVersionName
        manifestPlaceholders["appLabel"] = "小火锅"
        buildConfigField("String", "PRODUCTION_PRIMARY_ORIGIN", "\"$productionPrimaryOrigin\"")
        buildConfigField("String", "PRODUCTION_FALLBACK_ORIGIN", "\"$productionFallbackOrigin\"")

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        if (releaseKeystorePath != null) {
            create("release") {
                storeFile = file(releaseKeystorePath)
                storePassword = requireNotNull(System.getenv("ANDROID_KEYSTORE_PASSWORD"))
                keyAlias = requireNotNull(System.getenv("ANDROID_KEY_ALIAS"))
                keyPassword = requireNotNull(System.getenv("ANDROID_KEY_PASSWORD"))
            }
        }
    }

    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
            buildConfigField("String", "DEVELOPMENT_SERVER_ORIGIN", "\"$developmentServerOrigin\"")
            manifestPlaceholders["appLabel"] = "小火锅 Dev"
        }
        release {
            isMinifyEnabled = true
            buildConfigField("String", "DEVELOPMENT_SERVER_ORIGIN", "\"\"")
            signingConfig = signingConfigs.findByName("release")
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }
}

androidComponents {
    beforeVariants(selector().withBuildType("release")) { variant ->
        (variant as HasUnitTestBuilder).enableUnitTest = true
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2026.06.01")

    implementation(composeBom)
    implementation("androidx.activity:activity-compose:1.13.0")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.datastore:datastore-preferences:1.2.1")
    implementation("androidx.room:room-ktx:2.8.4")
    implementation("androidx.room:room-runtime:2.8.4")
    implementation("androidx.webkit:webkit:1.16.0")
    implementation("androidx.work:work-runtime:2.11.2")

    ksp("androidx.room:room-compiler:2.8.4")

    debugImplementation("androidx.compose.ui:ui-tooling")

    androidTestImplementation("androidx.test:core:1.7.0")
    androidTestImplementation("androidx.test.ext:junit:1.3.0")
    androidTestImplementation("androidx.test:runner:1.7.0")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.7.0")
    androidTestImplementation(platform("androidx.compose:compose-bom:2026.06.01"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
    testImplementation("junit:junit:4.13.2")
}
