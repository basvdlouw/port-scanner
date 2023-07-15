#!/bin/sh
Xvfb -ac :99 -screen 0 1280x1024x16 > /dev/null 2>&1 &
# Start the first server
node /app/public/server/app.js > /dev/stdout 2>&1 &

# Start the second server
npx --yes ts-node /app/artificial-ports-server/app.ts > /dev/stdout 2>&1 &

# Wait for the servers to be ready
echo "Waiting for servers to be ready..."
sleep 20
# Add any necessary waiting logic here, e.g., polling an endpoint

# Start the Java command using the environment variables
java -DBEGIN_PORT="$BEGIN_PORT" -DEND_PORT="$END_PORT" -DN_SCANS="$N_SCANS" -DPARALLEL_SOCKETS="$PARALLEL_SOCKETS" -DSOCKET_TIMEOUT="$SOCKET_TIMEOUT" -DSCANNING_TECHNIQUE="$SCANNING_TECHNIQUE" -DCONTAINER_NAME="$CONTAINER_NAME" -jar /app/selenium-portscan.jar > /dev/stdout 2>&1