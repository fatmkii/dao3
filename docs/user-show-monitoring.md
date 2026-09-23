# 用户信息接口诊断

仅监控 `POST /api/user/show`，不改变响应 JSON、认证行为或 Android 页面提示。
全局中间件在认证之前开始计时，在 Laravel 渲染响应后记录结果。

日志位置：`storage/logs/user-show-YYYY-MM-DD.log`，按日轮转，保留 14 天。
仅失败或异常请求记录一条 warning 级别的 `user_show_completed`，成功请求不写日志。
HTTP 200 但业务失败或附带异常的响应仍会记录。无需新增环境变量。

## 关联请求

响应头 `X-Request-ID` 是本次诊断 ID。客户端传入合法 UUID 时沿用，否则服务端生成。
可按故障时间、内部 `user_id` 或 `request_id` 查找日志。
认证失败时 `user_id` 可能为空，不能仅按用户 ID 搜索。

```bash
rg 'user_show_completed' storage/logs/user-show-*.log
rg '具体诊断UUID' storage/logs/user-show-*.log
```

## 字段与判断

- `http_status` / `business_code`：同时检查。数据库异常在现有处理逻辑下可能返回 HTTP 200。
- `reason`：`unauthenticated`、`binggan_mismatch`、`user_banned`、`validation_failed`、`server_exception` 或 `unexpected_response`。
- `user_id`：认证后的内部用户 ID；`binggan_matches`：请求饼干与认证用户是否一致。
- `client_type`：从认证 token 读取，无法识别时为 unknown。
- `android_webview`：User-Agent 是否包含现有的 CpttmmAndroid 标记，仅作诊断线索，不能作为可信身份。
- `expects_json`：是否期望 JSON；false 且出现 RouteNotFoundException 时，检查认证失败重定向路径。
- `has_bearer_token`：是否提交 Bearer 凭据，不记录其内容。
- `duration_ms`：服务端处理耗时，不包含客户端网络传输和渲染时间。
- `exception_class` / `exception_file` / `exception_line`：定位异常，不记录异常消息、堆栈或 SQL 参数。

专用日志不保存完整饼干、token、请求体、余额、IP 或原始 User-Agent。
该接口的原有数据库异常附加日志也不再记录请求体，改用诊断 ID；框架原有异常报告机制仍然保留。
诊断写入失败不会改变接口响应。

## 排查边界

成功请求仍返回 `X-Request-ID`，但不写诊断日志；已有的历史 success 记录不作清理。
无对应记录不代表请求未到达或客户端显示正常，结合 Nginx access/error log 判断请求是否成功、是否被代理拒绝，或 PHP 是否中途退出。
本次没有添加前端监控或用户提示。
