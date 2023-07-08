export BEGIN_PORT=49900
export END_PORT=50200
export BEGIN_ART_PORT=50000
export END_ART_PORTS=(50009 50032 50049 50099)
export SCANNING_TECHNIQUES=("fetch" "websocket" "xhr")
export N_SCANS=1
export PARALLEL_SOCKETS=50
export SOCKET_TIMEOUT=200

# BASE_IMAGE=library/ubuntu:22.04
# DOCKERFILE="Dockerfile.ubuntu"
# CONTAINER_NAME="ubuntu-container"
# BEGIN_PORT=49900
# END_PORT=50200
# BEGIN_ART_PORT=50000
# END_ART_PORTS=(50009 50032 50049 50099)
# SCANNING_TECHNIQUES=("fetch" "websocket" "xhr")
# N_SCANS=1
# PARALLEL_SOCKETS=50
# SOCKET_TIMEOUT=200
# TAG="ubuntu-chrome"

node ./dist/server/app.js > /dev/stdout 2>&1 &
sleep 10

for TECHNIQUE in "${SCANNING_TECHNIQUES[@]}"; do 
  for END_ART_PORT in "${END_ART_PORTS[@]}"; do
    # Start the first server

    # Start the second server
    # npx --yes ts-node /artificial-ports-server/app.ts > /dev/stdout 2>&1 &

    # Add any necessary waiting logic here, e.g., polling an endpoint

    # Start the Java command using the environment variables
    java -DBEGIN_PORT="$BEGIN_PORT" -DEND_PORT="$END_PORT" -DN_SCANS="$N_SCANS" -DPARALLEL_SOCKETS="$PARALLEL_SOCKETS" -DSOCKET_TIMEOUT="$SOCKET_TIMEOUT" -DSCANNING_TECHNIQUE="$SCANNING_TECHNIQUE" -DCONTAINER_NAME="$CONTAINER_NAME" -jar ./selenium-portscan/target/selenium-portscan-1.0.0-jar-with-dependencies.jar > /dev/stdout 2>&1
  done
done