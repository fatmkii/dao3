# Android WebView 桥兼容代码清理指南

本文记录 Android WebView 桥从 AndroidX `WEB_MESSAGE_LISTENER` 迁移到平台 `WebMessagePort` 时，为保证“网页先发布、APK 后发布”而保留的旧 APK 兼容代码。只有在 MessagePort APK 成为唯一受支持版本后，才可按本文删除兼容分支。

## 协议与发布矩阵

| 网页 / APK | 旧 APK：`window.CpttmmAndroid` listener | 新 APK：MessagePort |
| --- | --- | --- |
| 迁移前网页 | 支持 | 不支持 |
| 当前兼容网页 | 支持 | 支持 |
| 未来清理后网页 | 不支持 | 支持 |

发布必须遵循以下顺序：

1. 先部署当前同时支持两种传输方式的网页，并确认旧 APK 回归正常。
2. 再通过 Android release/tag 流程发布 MessagePort APK。
3. 在发布记录中填写首次支持 MessagePort 的 APK 标签和 versionCode；在真实 release 确定前不要预先猜测版本号。

首次支持版本：

- Android tag：`待 MessagePort APK 发布时填写`
- versionCode：`待 MessagePort APK 发布时填写`

两种传输共享相同的 JSON 消息协议、异步回复语义和业务行为。新 APK 的 User-Agent 带有固定 `CpttmmAndroid` 标记，并使用 `cpttmm:bridge-port-v1` 作为端口握手标识。
网页收到端口后立即发送 `cpttmm:bridge-ready-v1` 确认；APK 只在收到该确认后使用端口传递业务消息。

## 临时兼容代码

### 旧 listener 检测与适配

位置：`resources/js/androidBridgeTransport.ts`。

- `legacyBridge()` 检测旧 APK 注入的 `window.CpttmmAndroid`。
- `currentAndroidBridge()` 和 `waitForAndroidBridge()` 将旧 listener 与新 `MessagePort` 归一为同一收发接口。
- 该旧分支只负责传输适配；bootstrap、401 刷新、主题/OLO/路由同步和存储隔离不应复制到分支内。

### 旧全局类型声明

位置：`resources/js/index.d.ts` 的 `Window.CpttmmAndroid`。

该声明只服务于旧 APK 全局对象。MessagePort 使用浏览器内建类型，不需要额外全局声明。

### 旧 APK Playwright 夹具与用例

位置：

- `tests/e2e/fixtures/androidBridge.ts` 的 `installLegacyAndroidBridge()` 和 `legacyAndroidTest`。
- `tests/e2e/android-bridge.spec.ts` 的 “keeps the new web app compatible with the legacy listener bridge” 用例。
- `tests/e2e/image-upload.spec.ts` 中仍模拟 `window.CpttmmAndroid` 的图片上传夹具。

这些测试专门防止兼容网页先行发布后破坏旧 APK；它们不是新 MessagePort 协议的长期测试入口。

## 应永久保留的逻辑

- WebView User-Agent 的 `CpttmmAndroid` 标记及网页侧严格检测。
- `cpttmm:bridge-port-v1` MessagePort 握手。
- `cpttmm:bridge-ready-v1` 显式确认。
- `DomainPolicy` 可信 origin 限制、精确 target origin，以及只向主页面传递端口的安全边界。
- reload、跨文档导航和 WebView 销毁时关闭旧端口，加载完成但未收到消息时重试握手。
- 统一 JSON 消息协议和原生异步回复机制。
- `authBootstrap`、access token 刷新、账号 localStorage 隔离和待清理命名空间确认逻辑。
- 主题、OLO 和路由同步等业务协议。

## 清理前置条件

必须同时满足：

1. 兼容网页已经稳定部署，且新旧 APK 的生产回归均通过。
2. MessagePort APK 已成为唯一受支持和分发的版本，所有官方下载安装入口均不再提供旧 APK。
3. 产品明确停止支持早于该版本的 APK，并接受旧 APK 无法继续使用新版网页。

不要单独使用 `mobile_sessions.app_version` 判断所有用户是否已升级。该字段只记录移动会话创建时的 App 版本；用户升级 App 不会更新已有会话记录，因此它既可能低估升级比例，也不能证明旧 APK 已全部淘汰。应结合支持政策、分发入口、发布窗口和实际版本遥测作出清理决定。

## 稳定后的清理步骤

1. 从 `androidBridgeTransport.ts` 删除 `legacyBridge()`、旧全局对象检测及 listener 适配，让初始化只等待 MessagePort。
2. 从 `resources/js/index.d.ts` 删除 `Window.CpttmmAndroid` 声明。
3. 删除 `installLegacyAndroidBridge()`、`legacyAndroidTest` 和旧 APK 专用用例；把仍使用旧夹具的图片上传测试改为 MessagePort fixture。
4. 保留普通浏览器不因伪造握手而被误判为 Android 的测试。
5. 使用下列检索确认旧兼容入口无残留：

```bash
rg -n "window\.CpttmmAndroid|legacyBridge|installLegacyAndroidBridge|legacyAndroidTest|legacy-listener" resources tests
rg -n "WEB_MESSAGE_LISTENER|WebViewCapabilityChecker|UnsupportedWebViewScreen" android resources tests docs
```

第二条检索在清理本文档前会命中本文对旧实现的说明；除明确的历史/清理文档外不应再命中运行时代码或测试。

## 清理后的验证

至少运行：

```bash
./android/gradlew -p android testDebugUnitTest testReleaseUnitTest
./android/gradlew -p android lintDebug
./android/gradlew -p android connectedDebugAndroidTest
docker compose exec node npm run build
docker compose exec node npm run e2e:docker
```

验收标准：新 APK 在可信主页面完成双向 bootstrap，reload 后建立新端口，外部 origin 无法获得端口；401 刷新、主题/OLO/路由同步和多账号存储隔离保持正常；普通浏览器不会进入 Android 模式；旧 listener 兼容关键词在运行时代码与测试中无残留。
