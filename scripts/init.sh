#!/usr/bin/env bash
set -euo pipefail

docker compose up -d --build

docker compose exec php git config --global --add safe.directory /var/www
docker compose exec php chmod -R 777 storage bootstrap/cache
docker compose exec php composer install
docker compose exec node npm install

docker compose exec php sh -lc "grep -q '^APP_KEY=base64:' .env || php artisan key:generate"
docker compose exec php php artisan migrate --force
