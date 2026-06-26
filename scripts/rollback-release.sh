#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/data/wwwroot/v3.cpttmm.com}"
PHP_FPM_SERVICE="${PHP_FPM_SERVICE:-php-fpm}"
WORKER_PROGRAM="${WORKER_PROGRAM:-Laravel-worker-3:*}"
REVERB_PROGRAM="${REVERB_PROGRAM:-Laravel-Reverb:*}"

RELEASES_DIR="$APP_DIR/releases"
CURRENT_LINK="$APP_DIR/current"

usage() {
    cat <<'USAGE'
Usage:
  scripts/rollback-release.sh              Roll back to the previous release
  scripts/rollback-release.sh <release>    Roll back to a specific release directory name
  scripts/rollback-release.sh --list       List releases, newest first

Environment overrides:
  APP_DIR=/data/wwwroot/v3.cpttmm.com
  PHP_FPM_SERVICE=php-fpm
  WORKER_PROGRAM='Laravel-worker-3:*'
  REVERB_PROGRAM='Laravel-Reverb:*'
USAGE
}

list_releases() {
    find "$RELEASES_DIR" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %f\n' \
        | sort -rn \
        | cut -d' ' -f2-
}

require_release_dir() {
    local release_dir="$1"

    if [[ ! -d "$release_dir" ]]; then
        echo "Release directory does not exist: $release_dir" >&2
        exit 1
    fi
}

resolve_target_release() {
    local requested="${1:-}"

    if [[ -n "$requested" ]]; then
        if [[ "$requested" = */* ]]; then
            echo "$requested"
        else
            echo "$RELEASES_DIR/$requested"
        fi
        return
    fi

    local current_realpath
    current_realpath="$(readlink -f "$CURRENT_LINK")"

    list_releases \
        | while IFS= read -r release_name; do
            local release_dir="$RELEASES_DIR/$release_name"
            if [[ "$(readlink -f "$release_dir")" != "$current_realpath" ]]; then
                echo "$release_dir"
                break
            fi
        done
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
    usage
    exit 0
fi

if [[ "${1:-}" == "--list" ]]; then
    list_releases
    exit 0
fi

if [[ ! -d "$RELEASES_DIR" ]]; then
    echo "Releases directory does not exist: $RELEASES_DIR" >&2
    exit 1
fi

if [[ ! -L "$CURRENT_LINK" ]]; then
    echo "Current release link does not exist or is not a symlink: $CURRENT_LINK" >&2
    exit 1
fi

TARGET_RELEASE="$(resolve_target_release "${1:-}")"

if [[ -z "$TARGET_RELEASE" ]]; then
    echo "No rollback target found. Available releases:" >&2
    list_releases >&2
    exit 1
fi

require_release_dir "$TARGET_RELEASE"

echo "Current release: $(readlink -f "$CURRENT_LINK")"
echo "Rollback target:  $(readlink -f "$TARGET_RELEASE")"

ln -sfn "$TARGET_RELEASE" "$CURRENT_LINK"
systemctl reload "$PHP_FPM_SERVICE"
supervisorctl restart "$WORKER_PROGRAM"
supervisorctl restart "$REVERB_PROGRAM"

echo "Rollback complete: $CURRENT_LINK -> $(readlink -f "$CURRENT_LINK")"
