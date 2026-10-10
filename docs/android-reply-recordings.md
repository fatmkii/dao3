# Android 回帖录音部署与验收

## 配置与部署

1. `composer install`；`php artisan migrate --force`。迁移扫描实际存在的 `posts_数字` 表；日后新增分表必须包含 nullable、带索引的 `recording_id`（使用现有分表的 `CREATE TABLE ... LIKE` 可继承）。
2. 复用 `R2_ACCESS_ID`、`R2_ACCESS_KEY`、`R2_BUCKET`、`R2_ENDPOINT`、`R2_URL`。`R2_URL` 必须是已启用的公开域名根地址。
3. 使用有桶设置权限的凭据运行 `php artisan recordings:configure-storage` 查看合并后的生命周期与 CORS，再运行 `php artisan recordings:configure-storage --apply`。仅替换本功能两个固定 ID，保留其他规则及 APK 对象。若没有桶设置权限，在 Cloudflare 控制台添加 prefix=`recordings/`、14 天删除规则，并合并命令显示的 CORS。
4. 设置 `RECORDINGS_ENABLED=true`；可配置 `RECORDINGS_MAX_DURATION_MS=15000`、`RECORDINGS_UPLOADS_PER_MINUTE=6`、`RECORDINGS_UPLOADS_PER_DAY=100`。保留期固定为 14 天。按现有部署流程刷新配置缓存和长期 PHP worker。
5. 先发布后端，再发布 Web，最后发布新版 APK；旧 APK 未声明 recordingSupported，入口隐藏。

PHP 不需要媒体工具，不读取或下载音频。Content-MD5 及对象大小绑定到签名；HEAD 核对大小、Content-Type、ETag，以 LastModified 为 14 天起点。时长和实际编码只能由 Android 校验，后端不能证明声明真实。

## 端到端验收

- 真机允许/拒绝麦克风权限；长按、松手、15 秒自动停止；试听与真实振幅；锁屏、电话中断、后台再返回；上传失败后重试。
- 确认后重开，取消保留原附件；重录确认后替换；移除只解除草稿关联。账号、标签页、主题、页面重载隔离；成功提交清理私有缓存，验证码失败保留附件。
- 真实上传至 R2 并 HEAD 确认；回帖发布后 Android、PC 浏览器、iPhone Safari 播放、暂停、停止与拖动。
- 公开对象 GET 返回 `audio/mp4`；Range GET 应返回 206 和 Content-Range；带生产域 Origin 的 HEAD 应返回 Access-Control-Allow-Origin。播放器点击前没有音频请求。
- 到期显示“录音已失效”，删帖隐藏，恢复未到期附件重新显示；404 显示失效，网络错误可重试。
- Lifecycle 删除异步执行，公开 URL 缓存可能晚于元数据期限失效。不要给 recordings/ 添加无限缓存；检查现有规则是否有更短的全桶删除期限。

规则说明：https://developers.cloudflare.com/r2/buckets/object-lifecycles/

## 当前实现验证（2026-10-10）

- 相关 PHPUnit：46 项通过（246 个断言），覆盖真实 MySQL 并发附件行锁、事务回滚、签名请求头、HEAD-only 存储访问、UTC 上传时间在中国时区的持久化与桶规则合并。
- Docker Playwright：完整套件 38 项通过，其中录音专项 7 项。套件的音频控制使用媒体 API 模拟；本次另外通过真实 Android WebView 和 PC Chromium 验证 R2 上的实际 M4A 解码、播放和拖动。
- Android：Debug / Release JVM 各 67 项通过；`lintDebug`、`assembleDebug`、`assembleDebugAndroidTest` 通过。Windows ADB 连接 `emulator-5554` 后运行 AAC 编码裁帧及 WebView 桥接设备测试，7 项全部通过。
- R2 实测：使用现有对象读写密钥和应用签名代码，从 Node 客户端直传 8192 字节测试对象。PUT 200；重复 PUT 412；篡改签名 Content-Type 403；内容与 MD5 不符 400。认证 HEAD 的大小、类型和 ETag 一致。两个生产域及两个开发域的公开 HEAD 均返回对应 CORS；Range GET 206，Content-Range 与实际返回字节一致，所需响应头已暴露。
- 使用真实 R2 HEAD 调用后端确认逻辑，记录进入 ready；上传时间为 `2026-10-10T14:05:43Z`，到期为 `2026-10-24T14:05:43Z`，重复确认不延长。此次发现并修正 UTC HEAD 时间直接存入中国时区数据库造成提前 8 小时过期的问题。临时账号、会话、令牌与录音元数据已事务回滚；测试对象已删除，认证 HEAD 返回 404。
- 模拟器全链路：原生面板录音 → `RecordingAudio.prepare` 格式及时长核对 → `RecordingApi` 直传 R2 → HEAD 确认 → Vue 附件 → 普通回帖发布。首段 3251 ms / 42423 字节；持续按住超过 15 秒自动停止，替换上传后的录音为 14977 ms / 186331 字节。WebView 实际解码时长 14.976871 秒；PC Chromium 解码时长 14.97687074829932 秒，在 44.1 kHz AudioContext 中解码为单声道，并通过真实播放与拖动检查。
- 原生交互实测：拒绝及允许麦克风权限、松手停止、试听、重开取消保留原附件、成功上传后替换、移除附件、录音中切后台和锁屏后返回保留片段。断网失败后片段可重试，网络恢复后同一片段上传成功。网络错误已转换为中文重试提示。
- WebView 实测：点击播放前没有音频 src；播放、暂停、拖动、停止归零、切后台停止归零均通过。对独立测试录音临时缩短到期时间，页面播放中到期后自动停止归零，显示“录音已失效”。
- 断网重试检查时，临时拦截 Vite 客户端的 `location.reload()`，避免开发热更新在网络恢复时整页刷新；API、R2 上传和媒体请求均真实执行。测试后移除拦截。正常整页刷新仍按规则清理草稿。已清理临时主题、回帖、录音元数据和 3 个测试 R2 对象，并恢复本地录音开关及模拟器网络；新版 Debug APK 留在模拟器上。
- 用户已在控制台配置生命周期和 CORS；上述实测确认 CORS 生效。对象读写密钥仍不能读取桶生命周期，无法独立核对其前缀及期限。模拟器输入可能为静音，真机麦克风音质、真实来电打断和 iPhone Safari 验收仍待完成。
- 录音相关控制已改为圆形描边图标：网页播放、暂停、停止、重试、录音入口及附件入口；Android 试听、停止、长按录音、确认、移除和取消。保留无障碍名称、禁用状态和独立时长显示。网页按钮点击区域 44 px，Android 控制 48 dp、录音控制 64 dp；截图检查通过，样式修改后再次通过完整 38 项 Playwright、7 项设备测试、两个变体各 67 项 JVM 测试及 lint。
- `RECORDINGS_ENABLED` 默认 false；完成桶规则和真机验收后再启用。
