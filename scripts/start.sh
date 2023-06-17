#!/bin/sh

node /app/public/server/app.js & # your first application
P1=$!
npx --yes ts-node /app/artificial-ports-server/app.ts & # your second application
P2=$!
java -jar /app/selenium-portscan.jar "$BEGIN_PORT" "$END_PORT" "$N_SCANS" "$PARALLEL_SOCKETS" "$SOCKET_TIMEOUT" "$SCANNING_TECHNIQUE"
P3=$!
wait $P1 $P2 $P3