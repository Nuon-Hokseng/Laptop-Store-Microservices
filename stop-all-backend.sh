#!/usr/bin/env bash
set -euo pipefail

# Stops all backend services (auth, item, cart, order, api-gateway)
# Usage: bash stop-all-backend.sh
# Reads PID files from: ./logs/<service>.pid

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
LOG_DIR="$ROOT/logs"

stop_service() {
  local svc="$1"
  local pid_file="$LOG_DIR/${svc}.pid"

  if [[ ! -f "$pid_file" ]]; then
    echo "[skip] $svc - no PID file found"
    return
  fi

  local pid=$(cat "$pid_file")
  
  if kill -0 "$pid" 2>/dev/null; then
    echo "[stop] $svc (PID: $pid)"
    kill "$pid"
    
    # Wait for process to stop (max 5 seconds)
    local count=0
    while kill -0 "$pid" 2>/dev/null && [ $count -lt 50 ]; do
      sleep 0.1
      count=$((count + 1))
    done
    
    # Force kill if still running
    if kill -0 "$pid" 2>/dev/null; then
      echo "[force stop] $svc (PID: $pid)"
      kill -9 "$pid" 2>/dev/null || true
    fi
    
    rm -f "$pid_file"
  else
    echo "[skip] $svc - process not running (PID: $pid)"
    rm -f "$pid_file"
  fi
}

stop_service "api-gateway"
stop_service "order-service"
stop_service "cart-service"
stop_service "item-service"
stop_service "auth-service"

echo "All services stopped."
