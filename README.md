# Dao3

匿名论坛，基于 **Laravel 11** (API) + **Vue 3** (SPA) 构建。

## 技术栈

- **后端**: Laravel 11, Sanctum, Reverb (WebSocket), Redis, Roadrunner/Octane
- **前端**: Vue 3 (Composition API), Naive UI, Pinia, Vite 7, Alova
- **实时**: Laravel Echo + Pusher 协议，通过 Reverb 推送新帖通知

## 本地开发

```bash
# 前端
npm install
npm run dev          # Vite 热更新开发服务器

# 后端
composer install
cp .env.example .env # 编辑数据库、Redis 等配置
php artisan key:generate
php artisan migrate
php artisan serve    # Laravel 开发服务器

# 队列 & WebSocket
php artisan queue:listen
php artisan reverb:start --debug
```

或使用 `dev.cmd` 一键启动前端 + 队列 + Reverb + 定时任务。

## 生产构建

```bash
npm run build         # 普通生产构建
npm run staging       # 预发布构建 (mode=staging)
```

生产环境使用 Roadrunner/Octane 运行。

## 测试

```bash
php artisan test
php artisan test --filter=ClassName
```

## 项目结构

| 目录 | 说明 |
|---|---|
| `app/Http/Controllers/API/` | API 控制器 |
| `app/Models/` | Eloquent 模型 |
| `app/Common/` | 公共工具 (ResponseCode, Medals 等) |
| `routes/api.php` | API 路由定义 (~110 条) |
| `resources/vue/` | Vue 组件 |
| `resources/stores/` | Pinia 状态管理 |
| `resources/api/` | 前端 API 请求层 |

## 认证

基于 `饼干` (binggan) 的自定义认证：用户"认领"饼干后设置密码，通过 Laravel Sanctum 签发 API Token。`CheckBinggan` 中间件控制读写权限。

## License

MIT
