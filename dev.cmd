@echo off
start cmd /k "npm run dev"
start cmd /k "php artisan queue:listen"
start cmd /k "php artisan reverb:start --debug"