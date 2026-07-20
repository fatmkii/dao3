# Android 本地联调

先启动 Laravel、Vite 和 Reverb：

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec php php artisan migrate
```

本地 `.env` 需要配置至少 32 个字符的 `ANDROID_REGISTRATION_HMAC_KEY`，该值不要提交到仓库。

Windows 模拟器通过 `adb reverse` 访问 WSL 中的服务：

```bash
ADB=/mnt/c/Users/47155/AppData/Local/Android/Sdk/platform-tools/adb.exe
DEVICE=$("$ADB" devices | tr -d '\r' | awk 'NR > 1 && $2 == "device" { print $1; exit }')
test -n "$DEVICE"
"$ADB" -s "$DEVICE" reverse tcp:80 tcp:80
"$ADB" -s "$DEVICE" reverse tcp:5173 tcp:5173
"$ADB" -s "$DEVICE" reverse tcp:8080 tcp:8080
```

构建并安装仅用于本地联调的 Debug APK：

```bash
cd android
./gradlew -PLOCAL_SERVER_URL=http://127.0.0.1 assembleDebug
"$ADB" -s "$DEVICE" install -r app/build/outputs/apk/debug/app-debug.apk
```

`LOCAL_SERVER_URL` 只写入 Debug 构建。Release 构建始终使用两个生产 HTTPS 域名，并保持明文流量关闭。
