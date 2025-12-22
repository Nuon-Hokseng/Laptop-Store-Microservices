#!/usr/bin/env bash
set -euo pipefail

# Runs all backend services (auth, item, cart, order, api-gateway)
# Usage: bash run-all-backend.sh
# Logs: ./logs/<service>.log

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"

start_service() {
  local svc="$1";
  local entry="$2";
  local dir="$ROOT/$svc";

  if [[ ! -d "$dir" ]]; then
    echo "[skip] $svc not found at $dir";
    return;
  fi

  pushd "$dir" >/dev/null
  if [[ ! -d node_modules ]]; then
    echo "[init] installing dependencies for $svc";
    npm install --silent;
  fi

  local log_file="$LOG_DIR/${svc}.log";
  echo "[start] $svc -> node $entry (log: $log_file)";
  nohup node "$entry" >"$log_file" 2>&1 &
  echo $! >"$LOG_DIR/${svc}.pid";
  popd >/dev/null
}

start_service "auth-service" "app.js"
start_service "item-service" "app.js"
start_service "cart-service" "src/app.js"
start_service "order-service" "src/app.js"
start_service "api-gateway" "src/server.js"

echo "All services launched. Check $LOG_DIR for logs and PID files."
