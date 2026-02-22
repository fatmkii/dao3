# 岛3 (dao3) 项目结构说明文档

本项目是一个基于 **Laravel 11** (后端) 和 **Vue 3** (前端 SPA) 架构构建的现代论坛系统。以下是当前仓库的核心结构分析及代码导航指南。

## 技术栈概述
- **后端**: PHP 8.2+, Laravel 11.0+
- **前端**: Vue 3.5, Vite 7, Naive UI (组件视图), Pinia (状态管理), Vue Router (前端路由)
- **前后端通信**: Axios / Alova (API 请求), Laravel Echo & Pusher (基于 WebSocket 的实时广播与事件推送)

## 目录结构速览

```text
c:\laragon\wwwroot\dao3\
├── app/                    # Laravel 核心后端代码目录
├── bootstrap/              # Laravel 启动与缓存文件
├── config/                 # 后端全局配置文件
├── database/               # 数据库迁移 (migrations) 和初始配置数据
├── docs/                   # 项目级说明文档与使用指南存放目录 (本文档所在地)
├── lang/                   # 语言提示包
├── public/                 # 本地运行或部署提供对外的公共资源与 SPA index.html 渲染总入口
├── resources/              # 前端 Vue 源码及关联资产的核心工作区
├── routes/                 # 后端路由（API 及控制台）定义表
├── storage/                # 服务器日志、文件上传存储、缓存等
├── tests/                  # 自动化测试代码存放区
├── composer.json           # PHP 库依赖配置文件
├── package.json            # Node.js 服务与前端包依赖配置文件
└── vite.config.js          # Vite (前端构建工具) 配置信息
```

---

## 核心后端机制 (`app/` & `routes/`)

项目利用 Laravel 作为纯 API 后端，主要负责业务逻辑以及数据交互。

- **`app/Http/Controllers/API/`**: 业务接口处理中心。绝大部分前端发起的请求由这里消化。
  - 核心论坛主干如 `ForumController.php`, `ThreadController.php`, `PostController.php`。
  - 用户、管理权控分管在 `UserController.php`, `AdminController.php`。
  - 特色分支功能则包含 `BattleController.php`, `HongbaoController.php`, `GambleController.php` 等模块。
- **`app/Models/`**: 基于 Eloquent 的数据模型定义层，映射到近 40 张各种业务数据表。
- **`app/Console/Commands/`**: Artisan 自定义控制台命令集，存放计划任务/定时逻辑（如 `DailyLoginCount.php`, `BattlePolling.php` 等）。
- **`app/Common/`**: 通用辅助类和工具包（如 `Captcha.php` 验证码机制，`WatermarkObfuscator.php` 流水水印混淆计算等）。
- **`routes/api.php`**: **极其重要**，所有供前端 Axios/Alova 调用通信的 RESTful 接口都在此注册。
- **`routes/console.php`**: 基于命令行的调度任务注册表，用于配合服务器的 Cron 启动后端计划任务。
- **`routes/channels.php`**: 涉及全站实时通知时的广播通讯鉴权频道定义。

---

## 核心前端结构 (`resources/`)

因前后端完全分离，Vue 所在的 `resources/` 是前端开发核心区。

- **`resources/vue/`**: 前端页面的 `.vue` 组件仓库。以业务模块分片：
  - `AdminCenter/`: 超管及后端管理主控界面。
  - `Forum/`, `Thread/`, `NewThread/`: 对应的版面、帖子详情与发帖动作页面。
  - `UserCenter/`, `Home/`, `TopBar/`: 包含玩家资料页、首页以及全站公用的导航条。
  - `EmojiContest/`, `Loudspeaker/` 等：各类限定或常驻特定子系统模块页面。
  - `Components/`, `Custom/`, `Modals/`: 共用业务组件（如发帖富文本组件，抽屉弹窗等）。
- **`resources/stores/`**: Pinia 状态树管理目录 (`user.ts`, `forums.ts`, `threads.ts` 等)，维护 SPA 运行全局下的用户信息、状态分发。
- **`resources/routes/`**: Vue Router 前端页面路由配置入口 (`routes.js`)。前端的页面跳转映射从此处开始。
- **`resources/api/`**: 前端发往后端的 API 请求封装层。在此定义请求载荷和拦截器逻辑。
- **`resources/js/`**:
  - `app.js` / `bootstrap.js`: 前端整体程序挂载点、环境注入区。
  - `func/`: 纯函数或组合式工具方法的集合 (`getUUID.ts`, `debounce.ts`, 触发前端通告等)。

---

## 数据库架构概览 (`database/migrations/`)

系统以关系型数据为主，结构在 `database/migrations/` 中按时间戳进行了建表分布。以下是主要业务对应关系：
- **核心模块**: 用户 (`users`, `user_actives`), 板块 (`forums`), 主题 (`threads`), 回复 (`posts`)。
- **富交互系统**:
  - 大乱斗 (`battles`, `battle_messages`, `my_battle_chara`)
  - 投票系统 (`vote_questions` 相关)
  - 菠菜/竞猜 (`gamble_questions` 相关)
  - 饼干红包池 (`hongbao`, `hongbao_pool`, `hongbao_post` 相关)
- **定制化个性设定**: 自定义头衔 (`user_custom`), 勋章系统 (`user_medals`), 表情包 (`my_emoji` 及相关比赛体系)、大喇叭 (`loudspeaker`)。

---

## 开发维护参考指南 (给 AI 辅助编码的备忘录)

如果在未来需要修改系统或拓展新功能，推荐采用以下路径：

1. **添加后端新接口**:
   - 若涉及数据变动，在 `database/migrations` 创建 Migration 并写迁移逻辑。
   - （如新增了表）在 `app/Models/` 初始化相应的 Eloquent 模型。
   - 在 `app/Http/Controllers/API` 中编写逻辑处理端点。
   - 在 `routes/api.php` 登记接口路由。
2. **拓展前端视图或交互**:
   - 在 `resources/vue/` 的对应功能子目录下编写 Vue 3 (Composition API / Setup) 组件代码。
   - 若产生新页面映射，在 `resources/routes/routes.js` 添加入口点。
   - 若涉及多组件间状态同步，则在 `resources/stores/` 里修改受管状态。
   - 请求新增的 API 数据须在 `resources/api/` 或对应组件内部使用预设封装的网络库发起。
3. **建立服务端常驻或定时任务**:
   - 编写新的 `Command` (`php artisan make:command`) 并放在 `app/Console/Commands/`。
   - 在 `routes/console.php` 中使用 `Schedule::command(...)` 定义运行周期。
