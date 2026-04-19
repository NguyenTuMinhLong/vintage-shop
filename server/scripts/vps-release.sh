#!/usr/bin/env bash

set -euo pipefail

: "${APP_ROOT:?APP_ROOT is required}"
: "${RELEASE:?RELEASE is required}"
: "${JWT_SECRET:?JWT_SECRET is required}"

PORT="${PORT:-5001}"
RELEASE_DIR="$APP_ROOT/releases/$RELEASE"

mkdir -p "$APP_ROOT/shared/data"

cd "$RELEASE_DIR"
unzip -oq server-deploy.zip
rm -f server-deploy.zip

cat > "$APP_ROOT/shared/.env" <<EOF
PORT=$PORT
NODE_ENV=production
DATABASE_URL=file:$APP_ROOT/shared/data/prod.db
JWT_SECRET=$JWT_SECRET
SERVE_CLIENT=false
ENABLE_SEED_ROUTE=false
EOF

ln -sfn ../../shared/.env "$RELEASE_DIR/.env"
ln -sfn "$RELEASE_DIR" "$APP_ROOT/current"

cd "$APP_ROOT/current"
npm ci
npx prisma migrate deploy

if pm2 describe vintage-inventory-server >/dev/null 2>&1; then
  pm2 restart vintage-inventory-server --update-env
else
  pm2 start "$APP_ROOT/current/src/index.js" --name vintage-inventory-server --cwd "$APP_ROOT/current"
fi

pm2 save
curl -fsS "http://127.0.0.1:$PORT/health"
