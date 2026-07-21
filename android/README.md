# Android 本地联调

先启动 Laravel、Vite 和 Reverb：

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec php php artisan migrate
```

本地 `.env` 需要配置至少 32 个字符的 `ANDROID_REGISTRATION_HMAC_KEY`，该值不要提交到仓库。

Debug APK 仅通过局域网地址 `http://192.168.1.210` 访问开发服务。该地址是构建期固定配置，不能通过 Gradle 参数覆盖。请确保服务监听端口 80，且 Windows 防火墙允许模拟器访问。

构建并安装 Debug APK：

```bash
ADB=/mnt/c/Users/47155/AppData/Local/Android/Sdk/platform-tools/adb.exe
DEVICE=emulator-5554
test "$("$ADB" -s "$DEVICE" get-state 2>/dev/null | tr -d '\r')" = "device"
"$ADB" -s "$DEVICE" reverse tcp:5173 tcp:5173
"$ADB" -s "$DEVICE" reverse tcp:8080 tcp:8080
cd android
./gradlew assembleDebug
"$ADB" -s "$DEVICE" install -r app/build/outputs/apk/debug/app-debug.apk
```

端口 5173 和 8080 的反向映射分别供当前开发配置中的 Vite 热更新和 Reverb 使用；应用访问 Laravel 的主地址仍是 `192.168.1.210:80`。

Debug 应用 ID 为 `com.cpttmm.app.debug`，桌面名称为“小火锅 Dev”，可以和正式版同时安装。Debug 只把 `192.168.1.210` 视为内部可信服务；两个生产域名会交给系统浏览器，不能使用原生桥。

Debug 构建会开启 WebView 远程调试。安装并启动应用后，可以在 Windows Chrome 的 `chrome://inspect` 中检查页面、网络和 JavaScript。

本地验证 Release 编译：

```bash
./gradlew assembleRelease
```

Release 应用 ID 为 `com.cpttmm.app`，只使用 `https://cpttmm.com` 和 `https://cpttmm.love`，并保持明文流量与 WebView 远程调试关闭。开发和生产 Origin 集中定义在 `app/build.gradle.kts`，不从 Laravel `.env` 读取。

未配置签名环境变量时，本地生成的是仅供编译验证的未签名 APK，不是正式发布物。正式 APK 只能通过推送 `android-vX.Y.Z` 标签触发 `.github/workflows/android-release.yml` 生成、验签并发布，例如：

```bash
git tag android-v0.2.0
git push origin android-v0.2.0
```
