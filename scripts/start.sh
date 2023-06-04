#!/bin/sh
node /app/public/server/app.js &
npx --yes ts-node app/artificial-ports-server/app.ts