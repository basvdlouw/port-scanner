#!/bin/sh
node /app/public/server/app.js &
npx --yes ts-node /app/artificial-ports-server/app.ts &

# Infinite loop to keep the container running
while true; do
  sleep 1
done