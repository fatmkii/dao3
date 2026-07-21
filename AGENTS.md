# Repository Guidelines

## Project Structure & Module Organization
This repository contains a Laravel 11 API, a Vue 3 SPA, and a native Android client.

- Backend app code: `app/` (`Http/Controllers`, `Models`, `Services`, `Jobs`, `Common`)
- Routes: `routes/api.php` and `routes/web.php`
- Frontend source: `resources/vue/`, `resources/js/`, `resources/stores/`, `resources/api/`, `resources/css/`
- Blade entry and static views: `resources/views/`
- Database migrations/seeders/factories: `database/`
- Tests: `tests/Feature`, `tests/Unit`
- Public build output/assets: `public/`
- Android project: `android/` (single Gradle module: `android/app/`)
- Android application source: `android/app/src/main/java/com/cpttmm/app/`
  - `ui/`: Jetpack Compose application shell, account screens, and WebView workspace
  - `account/`: account persistence, authentication coordination, tabs, and session revocation
  - `webview/`: WebView lifecycle, profile isolation, JavaScript auth bridge, and pooling
  - `network/`, `session/`, `registration/`: mobile API calls and session/device registration logic
  - `data/local/`, `preferences/`, `crypto/`: Room storage, DataStore preferences, and Android Keystore encryption
  - `navigation/`, `model/`, `diagnostics/`, `common/`: domain policy, state models, diagnostics, and shared utilities
- Android resources and manifests: `android/app/src/main/res/`, `android/app/src/main/AndroidManifest.xml`, and `android/app/src/debug/AndroidManifest.xml`
- Android JVM tests: `android/app/src/test/`; device/instrumentation tests: `android/app/src/androidTest/`
- Android Room schema snapshots: `android/app/schemas/`; local setup and installation notes: `android/README.md`

## Build, Test, and Development Commands
- Development runs in Docker Compose from WSL. Do not use `sudo` for normal project commands; fix script or Docker socket permissions instead.
- `./scripts/init.sh`: build/start containers, configure Laravel, install Composer/npm dependencies, generate `APP_KEY`, and run migrations.
- `./scripts/dev.sh`: start the full development stack with `docker-compose.yml` plus `docker-compose.dev.yml`.
- `./scripts/rebuild.sh`: rebuild and restart the base Docker Compose stack.
- In the development environment, `npm run dev` is already configured to run in Docker, so frontend code changes do not require `npm run build`.
- `docker compose exec php composer install`: install PHP dependencies inside the PHP container.
- `docker compose exec node npm install`: install frontend dependencies inside the Node container.
- `docker compose exec php php artisan migrate`: run database migrations.
- `docker compose exec php php artisan test`: run all tests.
- `docker compose exec php php artisan test --filter=AntiSpam`: run a focused subset.
- `npm run e2e:install`: install the local Playwright Chromium browser after npm dependencies are installed.
- `docker compose exec node npm run e2e:docker:install`: install Playwright Chromium and browser runtime dependencies in the Node container after it is created or rebuilt.
- `npm run e2e`: run Playwright smoke checks against `http://localhost:80` from WSL after local browser dependencies are installed.
- `docker compose exec node npm run e2e:docker`: run Playwright smoke checks from the Node container, mapping browser `localhost` requests back to the WSL host. Prefer this command in the Docker development environment.
- `docker compose exec node npm run build`: production frontend build.
- `docker compose exec node npm run staging`: staging-mode frontend build.
- Development services include nginx on port `80`, Vite on `5173`, Reverb on `8080`, and phpMyAdmin on `8081`.
- `./android/gradlew -p android assembleDebug`: build the Android debug APK from the repository root.
- `./android/gradlew -p android testDebugUnitTest testReleaseUnitTest`: run Android JVM unit tests for both variants.
- `./android/gradlew -p android connectedDebugAndroidTest`: run Android instrumentation tests on a connected emulator or device.
- `./android/gradlew -p android lintDebug`: run Android lint for the debug variant.
- The Android debug client is fixed to `http://192.168.1.210` and cannot be overridden. See `android/README.md` for ADB and installation steps.

## Coding Style & Naming Conventions
- Follow `.editorconfig`: UTF-8, LF, spaces, 4-space indent (2 for `*.yml`/`*.yaml`).
- PHP: PSR-4 autoloading (`App\\`, `Tests\\`), class names in `StudlyCase`.
- Vue SFC files and components use `PascalCase` names (example: `ThreadPage.vue`).
- TS/JS helpers use `camelCase` filenames/functions (example: `copyToClipboard.ts`).
- Android code is Kotlin with Jetpack Compose; use `PascalCase` for classes and composables and `camelCase` for functions and properties. Keep packages under `com.cpttmm.app` and place code in the existing feature package that owns the behavior.
- Android targets Java 17, min SDK 29, and compile/target SDK 36. Keep Room schema exports in `android/app/schemas/` when changing the database.
- Run formatter/linter tools already configured in the stack before opening a PR (Laravel Pint for PHP where applicable).

## Testing Guidelines
- Framework: PHPUnit (via `php artisan test`).
- Frontend smoke checks use Playwright. After changes that affect Vue pages, routing, frontend assets, or page rendering, run `docker compose exec node npm run e2e:docker` with the local stack available at `http://localhost:80`.
- Place HTTP/integration tests in `tests/Feature`; pure logic tests in `tests/Unit`.
- Name test files with `*Test.php` suffix (example: `AntiSpamHttpTest.php`).
- Add or update tests for behavior changes in middleware, services, and API responses.
- Android local logic tests use JUnit 4 under `android/app/src/test/`; tests requiring Android framework APIs, WebView profiles, process recreation, or Compose UI belong under `android/app/src/androidTest/`.
- After Android changes, run the focused JVM test task and `lintDebug`; run `connectedDebugAndroidTest` when the behavior depends on an emulator/device, WebView, Keystore, Room process recreation, or Compose UI.

## Commit & Pull Request Guidelines
- Recent history favors Conventional Commit prefixes: `feat:`, `fix:`, `refactor:`, `chore:`.
- Keep commit subject lines short and action-oriented; group related changes only.
- PRs should include:
  - clear summary and scope,
  - linked issue/task (if available),
  - test evidence (`php artisan test`, targeted filters),
  - screenshots/GIFs for UI-visible Vue changes.
- Call out config/env changes explicitly (Redis/Reverb/queue-related settings).

# Terminal
Use bash commands instead of PowerShell.
Environment is WSL with Docker Compose.
Avoid PowerShell syntax.

## Android 开发环境

- `docker-compose.yml` + `docker-compose.dev.yml` provide the local development server at `192.168.1.210`; they are not the production deployment stack.
- Debug uses `com.cpttmm.app.debug` and trusts only the fixed development origin. Release uses `com.cpttmm.app` and trusts only `https://cpttmm.com` and `https://cpttmm.love`; origins are build-time Android configuration, not Laravel `.env` values.
- `.github/workflows/android-ci.yml` verifies Android changes on PRs and `main`. Official signed APKs are built and published only by `.github/workflows/android-release.yml` from `android-vX.Y.Z` tags.
- The web production release is deployed separately by `.github/workflows/build-release.yml`.

WSL 内已安装 Android SDK：

```text
ANDROID_HOME=/home/fat/Android/Sdk
平台：android-35、android-36
Build Tools：36.0.0
Command-line Tools：20.0
```

## Windows ADB（模拟器和实机）

Android 虚拟机运行在 Windows 宿主机上。为避免同时运行两套 ADB server，WSL 中连接 Android 模拟器和实机时均应调用 Windows 版 `adb.exe`，不要使用 WSL 的 `adb`：

```text
/mnt/c/Users/47155/AppData/Local/Android/Sdk/platform-tools/adb.exe
```

虚拟机设备通常为 `emulator-5554` 或 `emulator-5556`。

## Android 实机

实机通过 TCP 连接 Windows ADB，设备序列号中的 IP 和端口可能变化。先用 Windows `adb.exe devices -l` 查询当前序列号，再将其作为参数传给安装脚本：

```bash
./scripts/android-debug.sh <device-serial>
```

脚本会设置 Vite 所需的 `reverse tcp:5173 tcp:5173`，使用 WSL Gradle 构建 APK，将 APK 路径转换为 Windows 路径后交给 Windows ADB 安装并启动。Reverb 根据页面主机名直接连接 `192.168.1.210:8080`，不需要反向映射 8080。
