#!/bin/sh
set -e

export PORT="${PORT:-8080}"
echo "[entrypoint] PORT=${PORT}"

envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
echo "[entrypoint] nginx config written:"
cat /etc/nginx/conf.d/default.conf

echo "[entrypoint] launching: $@"
exec "$@"
