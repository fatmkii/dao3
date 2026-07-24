#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
    echo "Usage: $0 <device-serial>" >&2
    echo "Example: $0 192.168.1.162:37669" >&2
    exit 2
fi

device=$1
repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
apk="$repo_root/android/app/build/outputs/apk/debug/app-debug.apk"
windows_adb=/mnt/c/Users/47155/AppData/Local/Android/Sdk/platform-tools/adb.exe
windows_apk=$(wslpath -w "$apk")

if [[ ! -x "$windows_adb" ]]; then
    echo "Windows ADB was not found: $windows_adb" >&2
    exit 1
fi

if [[ $("$windows_adb" -s "$device" get-state 2>/dev/null | tr -d '\r') != "device" ]]; then
    echo "ADB device is not available: $device" >&2
    exit 1
fi

"$repo_root/android/gradlew" -p "$repo_root/android" assembleDebug
"$windows_adb" -s "$device" install -r "$windows_apk"
"$windows_adb" -s "$device" shell am start \
    -n com.cpttmm.app.debug/com.cpttmm.app.MainActivity

echo "Debug APK installed and started on $device"
