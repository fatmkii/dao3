# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Frontend
npm run dev              # Start Vite dev server with hot reload
npm run build            # Production build
npm run staging          # Staging build (mode=staging)

# Backend (all require PHP 8.2+)
php artisan serve        # Start Laravel dev server
php artisan queue:listen # Start queue worker (Redis-backed)
php artisan reverb:start --debug  # Start WebSocket server
php artisan schedule:work        # Run scheduled tasks

# Testing
php artisan test         # Run all tests (PHPUnit 10.5)
php artisan test --filter=ClassName  # Run a specific test

# Code quality
./vendor/bin/pint        # Laravel Pint (PHP code style fixer)

# Quick dev startup (Windows batch)
dev.cmd                  # Starts Vite + queue + reverb + schedule concurrently
```

## Architecture Overview

**Laravel 11** API backend + **Vue 3** SPA frontend. The backend serves as a pure API; all frontend rendering is client-side. Laravel Octane (Roadrunner) is used for production.

### Tech Stack
- **Backend**: Laravel 11, Sanctum (API auth), Reverb (WebSocket broadcasting), Redis (cache/queue/sessions)
- **Frontend**: Vue 3.5 (Composition API/`<script setup>`), Naive UI, Pinia, Vue Router (history mode), Alova (HTTP client), Vite 7
- **Real-time**: Laravel Echo + Pusher protocol via Reverb for live post updates

### Key Architectural Patterns

**Authentication flow**: Users authenticate via "binggan" (`饼干`, a custom cookie-based token concept). Laravel Sanctum issues API tokens, stored in `personal_access_tokens`. No traditional login — users "claim" a binggan, then set a password. The `CheckBinggan` middleware (with modes `create`/`show`) gates all write/read actions beyond auth.

**Post table sharding**: The `posts` table is horizontally sharded by `thread_id`. The `ModelWithSuffix` base class (`app/Models/ModelWithSuffix.php`) dynamically appends `_N` to table names — e.g., `Post::suffix(2)` queries `posts_2`. The suffix is `intval(thread_id / 10000)`. Both `Post` and `Thread` extend this.

**Response codes**: All API responses use custom HTTP-like codes in the 2xxxx range (`app/Common/ResponseCode.php`). Success = 200, errors follow pattern `2{entity_type}{status}` (e.g., 21404 = user not found, 24404 = post not found). Check `ResponseCode::$codeMap` for the full map.

**Rate limiting** (defined in `AppServiceProvider`):
- General API: 480 req/min per IP (`api` limiter)
- New posts: 4 per second per IP (`new_post` limiter)
- Login attempts: 3 per minute per IP (`login` limiter)

**Anti-spam constants** are in `User` model: `NEW_POST_NUMBER = 10` per 60s per binggan, `NEW_POST_NUMBER_IP = 100` per 3600s per IP.

**Frontend routing** is SPA-only: `routes/web.php` catches all paths and serves `index.blade.php`, which mounts the Vue app. Vue Router in `resources/routes/routes.js` handles all page navigation. `KeepAlive` caches `ThreadPage` and `NewThread` components.

**WebSocket broadcasting**: When a post is created, a `NewPostBroadcast` event fires. The frontend Echo instance connects via Reverb to receive real-time new-post notifications on `thread.{id}` channels.

### Directory Map

| Directory | Purpose |
|---|---|
| `app/Http/Controllers/API/` | All API controllers (15 controllers, heavily feature-rich) |
| `app/Models/` | Eloquent models (~33 models, with `User` and `UserMedalRecord` being the largest) |
| `app/Common/` | Shared utilities: `ResponseCode`, `Medals` (achievement logic, 26KB), `BattleChara` (48KB character data), `Captcha`, `WatermarkObfuscator` |
| `app/Console/Commands/` | Artisan scheduled commands (daily cleanup, battle polling, login stats, etc.) |
| `app/Jobs/` | Queued jobs for async processing (income statements, gamble/crowd settlement, admin logging) |
| `routes/api.php` | All ~110 API route definitions — the single source of truth for the API surface |
| `routes/console.php` | Schedule definitions for cron tasks |
| `resources/vue/` | Vue components organized by feature (Forum, Thread, NewThread, UserCenter, etc.) |
| `resources/stores/` | Pinia stores: `common.ts`, `user.ts`, `forums.ts`, `threads.ts`, `theme.ts` |
| `resources/api/` | Alova-based API request layer with typed methods |
| `resources/js/func/` | Utility functions (UUID generation, debounce, clipboard, icon rendering) |
| `config/app.php` | App config including custom keys: OSS credentials, freeimg token, password salt |

### Scheduled Tasks (via `routes/console.php`)

- `sanctum:prune-expired` — daily at 4:00
- `DatabaseAlterTable:run` — weekly Thursday 5:00 (cleans up old data)
- `BattlePolling:run` — every minute (expires stale battles)
- `DailyNissinHandle:run` — daily at 8:00 ("日清" daily cleanup)
- `DelayThreadHandle:run` — daily at 8:00 (processes delayed-release threads)
- `DailyLoginCount:run` — daily at midnight (stats)
- Expired loudspeaker cleanup — every minute
- Global search Redis TTL monitor — every minute

### Environment Notes

- `.env.example` at project root is the template; `.env` is git-ignored
- Production/staging have `.env.production` and `.env.staging` (also git-ignored)
- `PASSWORD_SALT=dao` is the bcrypt salt for binggan passwords
- Reverb config uses port 8080 (ws) and 8090 (wss)
- Octane server is Roadrunner, HTTPS enabled
