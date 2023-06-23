#!/bin/sh

# Start the first server
Start-Job -ScriptBlock { & node "C:/app/public/server/app.js" }

# Start the second server
Start-Job -ScriptBlock { & npx --yes ts-node "C:/app/artificial-ports-server/app.ts" }

# Wait for the servers to be ready
Write-Host "Waiting for servers to be ready..."
Start-Sleep -Seconds 20

# Start the Java command using the environment variables
& java -DBEGIN_PORT="$env:BEGIN_PORT" -DEND_PORT="$env:END_PORT" -DN_SCANS="$env:N_SCANS" -DPARALLEL_SOCKETS="$env:PARALLEL_SOCKETS" -DSOCKET_TIMEOUT="$env:SOCKET_TIMEOUT" -DSCANNING_TECHNIQUE="$env:SCANNING_TECHNIQUE" -DCONTAINER_NAME="$env:CONTAINER_NAME" -jar "C:/app/selenium-portscan.jar"