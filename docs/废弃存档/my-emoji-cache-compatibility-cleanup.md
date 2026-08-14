# 自定义表情包缓存兼容代码清理指南

本文记录自定义表情包 `my_emoji` 改为“localStorage 缓存 + 服务端版本号校验”时，为兼容新旧前后端混合部署而增加的临时代码。待生产数据库迁移、后端和新版前端稳定部署，并经过足够的旧页面淘汰窗口后，可按本文清理。

> 清理状态：已于26年8月14日实施清理。

## 当前协议

- `my_emoji.version` 使用 UUID 标识表情包内容版本；`my_emoji_set` 和 `my_emoji_add` 保存不同的 `emojis` 内容时自动生成新版本。
- 新前端调用 `POST /api/user/show` 时提交 `my_emoji_version_only: true`，只获取 `my_emoji_version`，不获取大型 `my_emoji` 数组。
- 本地没有缓存或版本不一致时，前端再调用 `GET /api/user/my_emoji` 获取完整数组并写入账号隔离的 localStorage。
- `emoji_excluded` 较小，继续随 `/api/user/show` 返回，不属于本次缓存兼容范围。

## 为兼容旧前端增加的后端逻辑

位置：`app/Http/Controllers/API/UserController.php` 的 `show()`。

1. 请求参数 `my_emoji_version_only` 使用 `sometimes|boolean`，因此旧前端不提交该参数仍可调用接口。
2. `$my_emoji_version_only` 控制两种数据库读取方式：
   - 新前端模式只查询 `version`、`emoji_excluded`。
   - 旧前端模式仍读取完整 `MyEmoji` 模型和 `emojis`。
3. 响应组装时仅在未启用版本模式的情况下追加 `data.my_emoji`，保证旧前端仍能直接从 `/api/user/show` 获得完整表情包。
4. 所有响应都会追加 `data.my_emoji_version`；旧前端会忽略这个新增字段。

相关测试：`tests/Feature/UserEmojiCacheTest.php` 中的 `test_legacy_user_data_response_still_contains_my_emoji` 专门锁定上述旧前端兼容行为。

## 为兼容旧后端增加的前端逻辑

### API 类型和协商参数

位置：`resources/api/methods/user.ts`。

1. `userData.my_emoji_version` 被声明为可选字段，允许解析尚未返回版本号的旧后端响应。
2. `userDataResponse` 保留可选的 `my_emoji?: string[]`，允许解析旧后端直接返回的完整数组。
3. `userDataGetter(binggan, myEmojiVersionOnly = false)` 保留布尔参数和默认值，由新 store 显式传入 `true`；这是新旧协议协商开关。
4. 请求体中的 `my_emoji_version_only` 仅为兼容期协议协商所需。

### Store 双响应解析

位置：`resources/stores/user.ts` 的 `userDataOnSuccess` 回调。

1. `Array.isArray(event.data.my_emoji)` 分支用于识别旧后端响应。
2. 命中旧响应时直接调用 `storeMyEmoji()`，把完整数组和可选版本写入新缓存结构。
3. `event.data.my_emoji_version ?? null` 中的空值回退同时容忍旧后端缺少版本字段。注意：用户没有 `MyEmoji` 记录时，新后端也会合法返回 `null`，因此清理后类型仍应保留 `string | null`，只是无需再设为可选。

### 仍使用旧响应形状的测试夹具

以下 Playwright 夹具仍可能返回 `my_emoji` 而不返回 `my_emoji_version`，当前依靠 store 的旧后端兼容分支通过：

- `tests/e2e/android-bridge.spec.ts` 顶部的 `userData`。
- `tests/e2e/smoke.spec.ts` 中举报中心等既有 `/api/user/show` mock。

删除前端兼容分支时，必须同步把这些夹具改为版本响应，并根据场景预置匹配的 `userMyEmoji:<binggan>` 缓存，或 mock `GET /api/user/my_emoji`。

## 数据库部署期兼容

位置：`database/migrations/2026_08_02_000001_add_version_to_my_emoji_table.php`。

- `version` 当前定义为 nullable，便于在已有表上先增加字段再回填，避免部署迁移期间出现无版本的旧记录。
- 迁移会为所有现有 `my_emoji` 记录回填版本；后续通过 `MyEmoji` 模型保存的新记录也一定会生成版本。
- 稳定部署后可先查询 `SELECT COUNT(*) FROM my_emoji WHERE version IS NULL;`。结果为 0 时，可另建迁移把数据库列改为非 nullable。
- API 的 `my_emoji_version` 仍需允许 `null`，因为完全没有 `my_emoji` 数据行的用户是合法状态；不要把“响应可为 null”和“表内已有记录的列可为 null”混为一谈。

## 生产稳定后的清理步骤

1. 确认生产迁移已完成，`my_emoji.version` 无空值；确认生产静态资源已切换到当前新版前端。
2. 等待旧浏览器页面、旧 release 静态资源和可能长期驻留的 Android WebView 基本淘汰。清理后旧页面将无法再从 `/api/user/show` 获得完整表情包。
3. 简化后端 `UserController::show()`：
   - 删除 `my_emoji_version_only` 参数验证和变量。
   - 永远只查询 `version`、`emoji_excluded`。
   - 删除 `$my_emoji_data` 和向响应追加 `data.my_emoji` 的条件分支。
   - `/api/user/show` 固定只返回 `my_emoji_version`。
4. 简化前端 API：
   - `userData.my_emoji_version` 改为必有的 `string | null`。
   - 从 `userDataResponse` 删除可选 `my_emoji`。
   - `userDataGetter` 删除 `myEmojiVersionOnly` 参数和请求体字段；store 改回只传 `binggan`。
5. 简化 store：
   - 删除 `Array.isArray(event.data.my_emoji)` 旧后端分支。
   - 直接使用必有的 `event.data.my_emoji_version` 做版本比较。
6. 更新 Playwright 的旧响应夹具；删除或改写 Feature 测试 `test_legacy_user_data_response_still_contains_my_emoji`，并新增断言确保 `/api/user/show` 永远不返回 `my_emoji`。
7. 视数据库核验结果增加 `version NOT NULL` 迁移。

## 不应删除的长期逻辑

以下代码不是兼容负担，而是新缓存方案本身或必要的容错，应予保留：

- `MyEmoji` 模型在 `emojis` 变化时生成新 UUID 的 `saving` 事件。
- `GET /api/user/my_emoji` 独立完整数据接口。
- `resources/js/func/myEmojiCache.ts` 的账号隔离、结构校验、损坏缓存删除和 localStorage 异常降级。
- store 中独立的 `myEmoji`、`myEmojiVersion`、`myEmojiReady` 状态及合并后的 `userData` computed。
- `pendingMyEmojiRequest` single-flight 请求去重。
- 表情包加载期间把 `myEmojiLoading` 合并进 `userDataLoading`，以及个人中心提交按钮的加载保护。
- 版本不一致时保留旧缓存直至新请求成功、请求失败后等待下次刷新重试的行为。

## 清理时的检索与验证

可先用以下检索定位所有兼容入口：

```bash
rg -n "my_emoji_version_only|Array\.isArray\(event\.data\.my_emoji\)|my_emoji\?:|my_emoji_version\?" app resources tests
```

清理后至少运行：

```bash
docker compose exec php php artisan test --filter=UserEmojiCacheTest
docker compose exec node npm run build
docker compose exec node npm run e2e:docker
```

验收标准：普通用户数据响应不再包含 `my_emoji`；缓存命中不请求完整接口；缓存缺失、损坏或版本落后时仅请求一次完整接口；旧兼容关键词检索无残留。
