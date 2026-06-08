# 生产服务器部署说明

本文记录当前生产服务器的部署结构、GitHub Actions 自动部署流程，以及从手动 `git pull` 迁移到 release/current 部署时遇到的问题。以后修改部署方式、构建方式、Reverb、队列、定时任务、Nginx 或 Supervisor 配置时，应先检查本文。

## 当前部署模型

生产服务器不再直接把可执行代码放在 `/data/wwwroot/v3.cpttmm.com` 根目录运行，而是使用 release 目录和 `current` 软链：

```text
/data/wwwroot/v3.cpttmm.com/
├── current -> /data/wwwroot/v3.cpttmm.com/releases/<run>-<sha>
├── releases/
│   └── <run>-<sha>/
└── shared/
    ├── .env
    └── storage/
```

每次 GitHub Actions 构建一个完整 release 包，上传到服务器后解压到 `releases/<run>-<sha>`，准备好缓存和权限后再切换 `current`。

`shared/.env` 和 `shared/storage` 不随 release 替换。每个 release 内通过软链使用它们：

```text
<release>/.env -> /data/wwwroot/v3.cpttmm.com/shared/.env
<release>/storage -> /data/wwwroot/v3.cpttmm.com/shared/storage
```

## GitHub Actions 流程

部署 workflow 位于：

```text
.github/workflows/build-release.yml
```

主要流程：

1. Checkout 源码。
2. 安装 PHP 8.2 和 Composer 生产依赖：
   ```bash
   composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader
   ```
3. 安装 Node 22 依赖：
   ```bash
   npm ci
   ```
4. 使用生产前端环境变量执行：
   ```bash
   npm run build
   ```
5. 打包 release，排除 `.git`、`node_modules`、`tests`、`.github`。
6. 上传 GitHub artifact。
7. 通过 SSH 上传到生产服务器。
8. 在服务器解压、链接 `.env/storage`、生成 Laravel 缓存、调整权限、切换 `current`。
9. reload PHP-FPM，重启 Supervisor 管理的 queue worker 和 Reverb。
10. 保留最近 5 个 release。

GitHub 仓库需要配置这些 Secrets：

```text
PROD_HOST
PROD_PORT
PROD_USER
PROD_SSH_KEY
VITE_REVERB_APP_KEY
```

`VITE_REVERB_APP_KEY` 必须和生产服务器 `shared/.env` 中的 `REVERB_APP_KEY` 一致。

## 服务器入口配置

所有长期入口必须指向 `current`，不能指向 `/data/wwwroot/v3.cpttmm.com/artisan` 或旧 release。

### Nginx

参考配置文件：

```text
tmp/v3.cpttmm.com.conf
```

普通 Web 请求的 root 应为：

```nginx
root /data/wwwroot/v3.cpttmm.com/current/public;
```

当前 Nginx 还在 `8090` 端口为 Reverb 做 WebSocket 代理：

```nginx
proxy_pass http://127.0.0.1:8080;
```

### Supervisor Queue Worker

参考配置文件：

```text
tmp/Laravel-worker-3.conf
```

命令应指向 `current/artisan`：

```ini
command=/usr/local/php/bin/php /data/wwwroot/v3.cpttmm.com/current/artisan queue:work --sleep=3 --tries=3
user=www
```

### Supervisor Reverb

参考配置文件：

```text
tmp/Laravel-Reverb.conf
```

命令应指向 `current/artisan`：

```ini
command=/usr/local/php/bin/php /data/wwwroot/v3.cpttmm.com/current/artisan reverb:start --host=127.0.0.1
user=www
```

### Crontab

Laravel scheduler 也必须指向 `current/artisan`：

```cron
* * * * * /usr/local/php/bin/php /data/wwwroot/v3.cpttmm.com/current/artisan schedule:run >> /dev/null 2>&1
```

旧路径会导致 `routes/console.php` 中的定时任务不执行：

```cron
* * * * * /usr/local/php/bin/php /data/wwwroot/v3.cpttmm.com/artisan schedule:run >> /dev/null 2>&1
```

## 关键部署顺序

服务器端部署脚本应保持这个顺序：

```text
1. 解压新 release
2. 链接 shared/.env 和 shared/storage
3. cd 到新 release
4. php artisan config:cache
5. php artisan route:cache
6. php artisan view:cache
7. php artisan storage:link
8. chown -R www:www 新 release
9. ln -sfn 新 release 到 current
10. systemctl reload php-fpm
11. supervisorctl restart queue worker 和 Reverb
12. 清理旧 release
```

`php artisan *:cache` 放在切换 `current` 前是正确的，因为脚本已经 `cd "$RELEASE_DIR"`，缓存会生成到新 release 的 `bootstrap/cache/`。先准备好新 release 再切换 `current`，可以减少半成品 release 被 Nginx/PHP-FPM 访问的窗口。

切换 `current` 后必须 reload PHP-FPM：

```bash
systemctl reload php-fpm
```

如果不 reload，PHP-FPM/OPcache 可能继续持有旧 release 的 PHP 文件或 manifest 结果，导致 HTML 引用旧 hash，而 Nginx 静态文件已经从新 release 读取，出现 `/build/assets/app-*.js` 404。

## 已遇到的问题

### Reverb 前端连接失效

迁移前，本地或生产服务器执行 `npm run build` 时会读取本机 `.env` 中的 `VITE_REVERB_*`。迁移后，前端构建发生在 GitHub Actions，服务器上的 `shared/.env` 不会参与 Vite 构建。

如果 Actions 没有提供 `VITE_REVERB_*`，普通页面可能正常，但 Echo/Reverb 会连接错误端口或使用错误 key。

当前生产需要：

```yaml
VITE_REVERB_APP_KEY: ${{ secrets.VITE_REVERB_APP_KEY }}
VITE_REVERB_PORT: '8090'
VITE_REVERB_SCHEME: 'https'
```

前端实际 WebSocket 应连接：

```text
wss://cpttmm.com:8090
wss://cpttmm.love:8090
```

排查命令：

```bash
supervisorctl status
ss -lntp | grep 8080
tail -n 200 /var/log/Laravel-Reverb.err.log
tail -n 200 /var/log/Laravel-Reverb.out.log
```

浏览器 DevTools 的 Network/WS 里也应确认连接地址和端口。

### 静态资源 app-hash.js 404

实际现象：

```bash
curl -I https://cpttmm.com/build/assets/app-CqPrYkoq.js
```

返回 404。执行：

```bash
systemctl reload php-fpm
```

后恢复。

原因是 symlink 切换后，PHP-FPM/OPcache 仍可能使用旧 release 的 PHP/manifest 结果。解决方案是部署脚本在切换 `current` 后 reload PHP-FPM。

注意，下面命令只能证明 HTML 引用了某个 JS，不能证明文件真实存在：

```bash
curl -s https://cpttmm.love | grep -o '/build/assets/[^"]*\.js'
```

确认静态文件存在应直接请求资源：

```bash
curl -I https://cpttmm.com/build/assets/app-xxxx.js
ls -l /data/wwwroot/v3.cpttmm.com/current/public/build/assets/app-xxxx.js
```

### 定时任务失效

实际原因是 crontab 仍指向旧入口：

```cron
* * * * * /usr/local/php/bin/php /data/wwwroot/v3.cpttmm.com/artisan schedule:run >> /dev/null 2>&1
```

修正为：

```cron
* * * * * /usr/local/php/bin/php /data/wwwroot/v3.cpttmm.com/current/artisan schedule:run >> /dev/null 2>&1
```

验证命令：

```bash
/usr/local/php/bin/php /data/wwwroot/v3.cpttmm.com/current/artisan schedule:list
/usr/local/php/bin/php /data/wwwroot/v3.cpttmm.com/current/artisan schedule:run -vvv
```

如果 cron 以 `www` 用户运行，应按 `www` 用户验证。

## 部署后检查清单

每次修改部署逻辑后，至少检查：

```bash
readlink -f /data/wwwroot/v3.cpttmm.com/current
curl -I https://cpttmm.com
curl -I https://cpttmm.com/build/manifest.json
supervisorctl status
/usr/local/php/bin/php /data/wwwroot/v3.cpttmm.com/current/artisan schedule:list
```

还应在浏览器中检查：

- 首页和帖子页是否正常加载。
- Network 中 `app-*.js` 和主要 chunk 是否 200。
- 使用 Reverb 的功能是否能连接 `:8090` WebSocket。
- 新回复广播、queue worker、定时任务相关功能是否正常。

## 修改部署相关代码时的注意事项

- 任何 Web、queue、Reverb、cron 入口都必须使用 `current`。
- 前端 `VITE_*` 是构建时变量。只改生产服务器 `.env` 不会改变已构建 JS。
- release 包需要包含 `vendor/`、`public/build/`、`bootstrap/`、`app/`、`routes/`、`resources/views/`、`config/`、`database/migrations/`、`artisan`、`composer.json`、`composer.lock`。
- `shared/storage` 应在服务器上保持 `www:www` 权限，不建议每次部署递归修改整个 shared storage。
- 部署用户需要有写入 release 目录、执行 `chown`、`systemctl reload php-fpm`、`supervisorctl restart` 的权限。
- 如果更换 PHP-FPM 服务名，必须同步修改 workflow 中的 reload 命令。
