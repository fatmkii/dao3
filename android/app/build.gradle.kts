import java.net.URI

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.devtools.ksp")
    id("androidx.room")
}

val configuredVersionCode = providers.gradleProperty("VERSION_CODE").orNull?.toInt() ?: 1
val configuredVersionName = providers.gradleProperty("VERSION_NAME").orNull ?: "0.1.0"
val localServerUrl = providers.gradleProperty("LOCAL_SERVER_URL").orNull.orEmpty()
val releaseKeystorePath = System.getenv("ANDROID_KEYSTORE_PATH")

if (localServerUrl.isNotEmpty()) {
    val uri = URI(localServerUrl)
    require(
        uri.scheme in setOf("http", "https") &&
            !uri.host.isNullOrBlank() &&
            uri.userInfo == null &&
            uri.rawPath.orEmpty().let { it.isEmpty() || it == "/" } &&
            uri.rawQuery == null &&
            uri.rawFragment == null
    ) { "LOCAL_SERVER_URL must be an HTTP(S) origin without credentials, path, query, or fragment" }
}

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
            buildConfigField("String", "LOCAL_SERVER_URL", "\"$localServerUrl\"")
        }
        release {
            isMinifyEnabled = true
            buildConfigField("String", "LOCAL_SERVER_URL", "\"\"")
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
