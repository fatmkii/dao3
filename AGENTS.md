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
- `composer install`: install PHP dependencies.
- `npm install`: install frontend dependencies.
- `php artisan key:generate`: generate app key after `.env` setup.
- `php artisan migrate`: run database migrations.
- `php artisan serve`: run Laravel locally.
- `npm run dev`: run Vite dev server (`vite --host localhost`).
- `npm run build`: production frontend build.
- `npm run staging`: staging-mode frontend build.
- `php artisan test`: run all tests.
- `php artisan test --filter=AntiSpam`: run a focused subset.
- `dev.cmd`: convenience script to start core local processes.

## Coding Style & Naming Conventions
- Follow `.editorconfig`: UTF-8, LF, spaces, 4-space indent (2 for `*.yml`/`*.yaml`).
- PHP: PSR-4 autoloading (`App\\`, `Tests\\`), class names in `StudlyCase`.
- Vue SFC files and components use `PascalCase` names (example: `ThreadPage.vue`).
- TS/JS helpers use `camelCase` filenames/functions (example: `copyToClipboard.ts`).
- Run formatter/linter tools already configured in the stack before opening a PR (Laravel Pint for PHP where applicable).

## Testing Guidelines
- Framework: PHPUnit (via `php artisan test`).
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
