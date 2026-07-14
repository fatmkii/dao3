# 小火锅 Android 应用实施方案

## 总体方案

- 在当前仓库新增 `android/` 工程，使用 Kotlin、Jetpack Compose 和原生 WebView 外壳，application ID 为 `com.cpttmm.app`。
- 仅面向 Android，不为潜在 iOS 版本引入 Compose Multiplatform、Flutter、React Native 或 Capacitor；若未来重新启动 iOS 项目，再单独评估共享范围。
- Compose 只实现账号列表、标签栏、设置、域名切换、错误页等原生外壳；论坛、帖子、用户中心、菠菜等业务界面继续由现有 Vue 应用唯一实现，避免维护两套业务 UI。
- WebView 作为独立的 Android View 浏览器组件，通过 `AndroidView` 接入 Compose，由专门的会话/生命周期管理层持有状态，不在 Composable 重组时直接创建或销毁。复杂 WebView 与 Compose 的生命周期不同，必须显式处理状态保存、释放和返回导航。[Compose 中封装 WebView](https://developer.android.com/develop/ui/compose/migrate/interoperability-apis/wrap-webview-in-compose)
- Android 10/API 29 起步，compile/target API 36；启动时强制检查 `MULTI_PROFILE`、`DOCUMENT_START_SCRIPT`、`WEB_MESSAGE_LISTENER`，不支持则引导更新 WebView，仍不支持时阻止进入主界面。
- 每个账号对应独立 WebView Profile 和工作区，最多保存 5 个账号；不提供游客模式。
- 默认使用 `cpttmm.com`，可全局手动切换到 `cpttmm.love`；加载失败只提示切换，不自动重放请求。`www` 地址规范化到对应裸域，其他域名交系统浏览器。
- 原生底部工具栏提供后退、前进、标签、完整 binggan、账号切换和设置；标签与账号列表使用底部抽屉。外壳主题跟随当前网页主题。

## 服务端与公开接口

- 新增 `mobile_sessions` 表，保存用户、随机安装 ID 哈希、refresh token 哈希、最近使用时间、30 天闲置期限、180 天绝对期限和撤销状态；数据库不保存 refresh token 明文。
- 移动端 access token 继续使用 Sanctum，寿命 1 小时并保留当前管理员 abilities；不改变网页版现有 30 天 token 行为。Sanctum 支持逐 token 设置过期时间。[Laravel Sanctum](https://laravel.com/docs/11.x/sanctum#token-expiration)
- 新增以下 JSON 接口，继续使用现有 `{code,message,data}` 响应格式：
  - `POST /api/mobile/login`：`binggan`、可选密码、安装 ID、设备名、App 版本。
  - `POST /api/mobile/register`：按现有开放时间、IP 和注册次数规则领取饼干，并直接创建移动会话。
  - `POST /api/mobile/token/refresh`：轮换 refresh token 并签发新 access token。
  - `POST /api/mobile/logout`：幂等撤销 refresh session 及其 access tokens，即使 access token 已过期也可调用。
  - `POST /api/mobile/custom-account`：创建定制饼干；普通创建返回新工作区会话，魂穿则撤销旧账号会话并返回新账号会话。
  - `GET /api/mobile/version`：返回最新版名称、versionCode、更新说明、官网 APK、GitHub 镜像和 SHA-256；只提示更新，不强制。
- 会话响应统一包含 `binggan`、`access_token`、`access_expires_at`、`refresh_token`、闲置到期时间和绝对到期时间。
- refresh 操作使用数据库事务和行锁；同一 session 的旧 refresh token 再次出现即撤销该 token family。客户端用互斥锁串行刷新；刷新响应不确定时要求重新登录，不做危险的并发重试。
- 改密码时：从 Android 发起则保留当前移动会话、撤销其他移动会话；从普通网页发起则撤销全部移动会话。账号被封禁或魂穿时立即撤销相应移动会话。
- 抽取现有登录、注册和定制饼干业务逻辑供网页与移动端控制器复用，保持现有网页接口兼容。

## Android 与 Vue 集成

- Android 使用单一 App 状态源，Room 保存账号非敏感元数据、工作区、标签路径、标题、滚动位置和待撤销任务；DataStore 保存全局域名与安装 ID。
- 原生层按 `AppState -> AccountWorkspace -> BrowserTab -> WebViewHost` 分层；Compose 只订阅不可变 UI 状态，WebView 实例、导航栈、加载回调和资源释放由 `WebViewHost` 管理，禁止放入可序列化状态或 ViewModel 长期持有。
- access/refresh token 使用 Android Keystore 生成的 AES-256-GCM 密钥加密；不保存密码、不使用硬件设备标识、不参与 Android 自动备份。[Android 加密建议](https://developer.android.com/privacy-and-security/cryptography)
- 每账号最多 10 个标签，当前工作区最多保活 3 个 WebView；超限时休眠最久未用标签。休眠、切账号或进程重启后只恢复当前路径和滚动位置，不恢复历史栈，也不保证未提交表单内容。
- WebView 进入后台标签时暂停媒体与计时活动，休眠、切账号、内存压力或 Activity 销毁时依序保存可恢复状态、解除 client/bridge、停止加载并调用 `destroy()`；不允许后台标签无限保活。
- 普通点击留在当前标签；`target="_blank"`、`window.open` 和长按“新标签打开”创建标签。达到 10 个时要求先关闭标签。Android 返回键优先关闭抽屉、再执行网页后退；没有网页历史时保留标签并退出到后台。
- WebView Profile 名使用随机内部 ID，不暴露 binggan。切账号时销毁旧工作区的活 WebView，但保留其 Profile 与标签元数据。
- 使用受 origin 限制的 `WebMessageListener`，仅允许两个裸域；不使用通配符或 `addJavascriptInterface`。外部网页永远无法获得原生桥。[WebView bridge allowlist](https://developer.android.com/reference/androidx/webkit/WebViewCompat)
- 在文档启动阶段向受信页面写入现有 `Binggan`/`Token` localStorage；refresh token 永不进入 WebView。access token 更新时同步活 WebView，并触发 `cpttmm:auth-updated` DOM 事件。
- 新增 `useAndroidAppBridge` Vue composable，作为唯一桥接入口：
  - 网页到原生：`themeChanged`、`authExpired`、`openCustomAccount`。
  - 原生到网页：`cpttmm:auth-updated`。
- App 模式下原生层唯一管理登录、退出、领取饼干和定制饼干；网页 TopBar 隐藏这些入口但保留个人中心、举报和管理功能。普通浏览器完全不变。
- 主题 store 暴露只读 `themeName`；根组件发送主题名、深浅模式和核心色值。切账号时先使用该账号最后缓存主题，再接受网页更新。
- 支持图片/文件选择、DownloadManager、剪贴板、WebSocket、JavaScript 弹窗和前后台恢复；不申请宽泛存储权限。禁止明文 HTTP、忽略 TLS 错误、WebView 调试和 bridge token 日志。
- 断网时显示原生错误页，提供重试和切换域名；不缓存帖子、不排队发帖。

## 测试与发布

- PHPUnit 覆盖移动登录/注册、管理员 abilities、1 小时 access token、refresh 轮换与重用撤销、30/180 天期限、本机退出、封禁、密码修改、定制账号和魂穿事务。
- Playwright 覆盖普通浏览器行为不变，以及模拟 App bridge 时隐藏认证入口、上报鉴权失效、同步主题和委托定制饼干。
- Android 单元/仪器测试覆盖 Keystore、5 账号限制、10/3 标签策略、Profile 隔离、域名映射、外链拦截、滚动恢复、进程重建、离线页和 refresh 并发。
- 在 API 29 与 API 36 模拟器、至少一台定制系统真机上验证；验收必须包含两个生产域名、图片上传、实时通信、管理员页面和 WebView 能力不足拦截。
- 先部署向后兼容的数据库/API/Vue App 模式，再发布 Android 测试版；确认线上接口后才开放官网 APK。
- 使用 `android-vX.Y.Z` 标签触发独立 GitHub Actions：测试、release keystore 签名、生成 SHA-256、创建 GitHub Release，并上传 APK 与版本清单到官网共享下载目录。
- release keystore 仅存 GitHub Secrets 和离线备份，不进入仓库。官网为主下载源，GitHub Release 为镜像。
- 在公开发布前完成 Android Developer Console 身份验证并登记 `com.cpttmm.app`；Android 的站外分发验证将在 2027 年扩展到全球。[Android 开发者验证指南](https://developer.android.com/developer-verification/guides)

## 已锁定的边界

- 两个域名完全共用数据库、Redis 和 Sanctum token 表。
- Android 是当前唯一原生客户端目标；现阶段不建设跨平台共享 UI，也不重写现有 Vue 业务页面。
- 不做生物识别 App 锁、云备份、网页版设备会话列表、推送、分享、深链、离线内容、离线提交、第三方分析或崩溃上报。
- 本地仅保存脱敏诊断日志，可由用户手动导出；禁止记录 token、密码、表单正文和完整 URL 查询参数。
- 账号离线移除时立即清除本地工作区，并加密保存待撤销凭据，联网后完成服务端撤销。
