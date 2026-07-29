# docker/entrypoint.sh
#!/bin/sh
set -e

# Railway provides PORT; default to 8080 for local/dev use
export PORT="${PORT:-8080}"

envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
