#!/bin/sh

# Start the first server
node "C:/app/public/server/app.js" > /dev/stdout 2>&1 &

# Start the second server
npx --yes ts-node "C:/app/artificial-ports-server/app.ts" > /dev/stdout 2>&1 &

# Wait for the servers to be ready
echo "Waiting for servers to be ready..."
"C:\Windows\System32\timeout.exe" 20

# Start the Java command using the environment variables
java -DBEGIN_PORT="$BEGIN_PORT" -DEND_PORT="$END_PORT" -DN_SCANS="$N_SCANS" -DPARALLEL_SOCKETS="$PARALLEL_SOCKETS" -DSOCKET_TIMEOUT="$SOCKET_TIMEOUT" -DSCANNING_TECHNIQUE="$SCANNING_TECHNIQUE" -jar "C:/app/selenium-portscan.jar" > /dev/stdout 2>&1
