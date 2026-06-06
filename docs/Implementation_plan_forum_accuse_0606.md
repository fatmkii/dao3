# 举报系统板块分类与鉴权实施计划

对应需求文档：`docs/feat-accuse-system.md`

## 1. 数据和现状核验
- 核验 `admins.forums` 样例、`accuses.forum_id` 写入逻辑、现有管理员 token ability 要求。
- 验证标准：本地只读查询确认 `admins.forums` 为 JSON 数组；现有测试能说明举报创建时已有 `forum_id`。

## 2. 后端列表接口调整
- `GET /api/accuses` 返回 `forum_id` 和 `can_manage`。
- 新增或重命名筛选参数，实现“只显示我的待处理”：`status = pending` 且 `forum_id in admins.forums`。
- 待处理数量按最终 UI 需要决定是否新增 `my_pending_count`。
- 验证标准：Feature Test 覆盖有权限管理员、无权限管理员、普通用户三种列表返回。

## 3. 后端管理员操作鉴权收紧
- 复核 `hint`、`handle`、`uncertain` 使用举报自身 `forum_id` 鉴权。
- 确认 `ban` 等高权限操作同时满足等级/ability 和板块范围。
- 验证标准：无该 `forum_id` 权限的管理员调用上述接口返回 `ADMIN_UNAUTHORIZED`，且举报状态和帖子状态不变。

## 4. 前端类型与数据流调整
- 更新 `resources/api/methods/accuse.ts` 类型：增加 `forum_id`、`can_manage`、筛选参数。
- `AccusePage.vue` 将开关文案改为“只显示我的待处理”，请求参数改为新语义。
- `AccusePage.vue` 传给 `AccuseItem.vue` 的管理员态改为按条判断，优先使用后端 `can_manage`；必要时以 `userStore.checkAdminForums(item.forum_id)` 作为本地补充。
- 验证标准：一个有部分板块权限的管理员只在有权限举报项上看到处理入口。

## 5. 前端板块名称展示
- `AccuseItem.vue` 使用 `useForumsStore()` 根据 `item.forum_id` 解析 `forum.name`。
- 找不到 forum 时显示 `#forum_id` 降级，不阻断页面渲染。
- 验证标准：举报项显示“板块：板块名”，不直接把 `forum_id` 当名称展示。

## 6. 测试与回归
- 后端运行 `docker compose exec php php artisan test --filter=AccuseTest`。
- 前端涉及页面渲染后，运行 `docker compose exec node npm run e2e:docker`。
- 若改动触及构建类型，运行 `docker compose exec node npm run build` 或项目现有等价检查。
