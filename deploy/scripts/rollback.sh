#!/bin/bash
# Rollback deployment (สลับ symlink current → release ก่อนหน้า แล้ว restart systemd)

set -e

APP_NAME="${APP_NAME:-summer-camp-2026}"
SERVER_ROOT="${SERVER_ROOT:-/opt/summer-camp-2026}"
service="${service:-summer-camp-2026}"

echo "Rolling back $APP_NAME..."

PREVIOUS_RELEASES=$(ls -1 "$SERVER_ROOT/releases" | sort | tail -n 2 | head -n 1)

if [ -z "$PREVIOUS_RELEASES" ]; then
  echo "No previous releases found for rollback"
  exit 1
fi

echo "Rolling back to release: $PREVIOUS_RELEASES"

sudo ln -sfn "$SERVER_ROOT/releases/$PREVIOUS_RELEASES" "$SERVER_ROOT/current"

echo "Restarting service..."
sudo systemctl restart "$service"

echo "Waiting for service..."
sleep 5

STATUS=$(systemctl is-active "$service")

if [ "$STATUS" = "active" ]; then
  echo "Rollback successful. Service: $STATUS"
else
  echo "Rollback failed. Service: $STATUS"
  exit 1
fi
