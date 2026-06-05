# Repository Guidelines

## Project Structure & Module Organization
This repository is a Laravel 11 API + Vue 3 SPA.

- Backend app code: `app/` (`Http/Controllers`, `Models`, `Services`, `Jobs`, `Common`)
- Routes: `routes/api.php` and `routes/web.php`
- Frontend source: `resources/vue/`, `resources/js/`, `resources/stores/`, `resources/api/`, `resources/css/`
- Blade entry and static views: `resources/views/`
- Database migrations/seeders/factories: `database/`
- Tests: `tests/Feature`, `tests/Unit`
- Public build output/assets: `public/`

## Build, Test, and Development Commands
- Development runs in Docker Compose from WSL. Do not use `sudo` for normal project commands; fix script or Docker socket permissions instead.
- `./scripts/init.sh`: build/start containers, configure Laravel, install Composer/npm dependencies, generate `APP_KEY`, and run migrations.
- `./scripts/dev.sh`: start the full development stack with `docker-compose.yml` plus `docker-compose.dev.yml`.
- `./scripts/rebuild.sh`: rebuild and restart the base Docker Compose stack.
- In the development environment, `npm run dev` is already configured to run in Docker, so frontend code changes do not require `npm run build`.
- `docker compose exec php composer install`: install PHP dependencies inside the PHP container.
- `docker compose exec node npm install`: install frontend dependencies inside the Node container.
- `docker compose exec php php artisan migrate`: run database migrations.
- `docker compose exec php php artisan test`: run all tests.
- `docker compose exec php php artisan test --filter=AntiSpam`: run a focused subset.
- `npm run e2e:install`: install the local Playwright Chromium browser after npm dependencies are installed.
- `docker compose exec node npm run e2e:docker:install`: install Playwright Chromium and browser runtime dependencies in the Node container after it is created or rebuilt.
- `npm run e2e`: run Playwright smoke checks against `http://localhost:80` from WSL after local browser dependencies are installed.
- `docker compose exec node npm run e2e:docker`: run Playwright smoke checks from the Node container, mapping browser `localhost` requests back to the WSL host. Prefer this command in the Docker development environment.
- `docker compose exec node npm run build`: production frontend build.
- `docker compose exec node npm run staging`: staging-mode frontend build.
- Development services include nginx on port `80`, Vite on `5173`, Reverb on `8080`, and phpMyAdmin on `8081`.

## Coding Style & Naming Conventions
- Follow `.editorconfig`: UTF-8, LF, spaces, 4-space indent (2 for `*.yml`/`*.yaml`).
- PHP: PSR-4 autoloading (`App\\`, `Tests\\`), class names in `StudlyCase`.
- Vue SFC files and components use `PascalCase` names (example: `ThreadPage.vue`).
- TS/JS helpers use `camelCase` filenames/functions (example: `copyToClipboard.ts`).
- Run formatter/linter tools already configured in the stack before opening a PR (Laravel Pint for PHP where applicable).

## Testing Guidelines
- Framework: PHPUnit (via `php artisan test`).
- Frontend smoke checks use Playwright. After changes that affect Vue pages, routing, frontend assets, or page rendering, run `docker compose exec node npm run e2e:docker` with the local stack available at `http://localhost:80`.
- Place HTTP/integration tests in `tests/Feature`; pure logic tests in `tests/Unit`.
- Name test files with `*Test.php` suffix (example: `AntiSpamHttpTest.php`).
- Add or update tests for behavior changes in middleware, services, and API responses.

## Commit & Pull Request Guidelines
- Recent history favors Conventional Commit prefixes: `feat:`, `fix:`, `refactor:`, `chore:`.
- Keep commit subject lines short and action-oriented; group related changes only.
- PRs should include:
  - clear summary and scope,
  - linked issue/task (if available),
  - test evidence (`php artisan test`, targeted filters),
  - screenshots/GIFs for UI-visible Vue changes.
- Call out config/env changes explicitly (Redis/Reverb/queue-related settings).

# Terminal
Use bash commands instead of PowerShell.
Environment is WSL with Docker Compose.
Avoid PowerShell syntax.
