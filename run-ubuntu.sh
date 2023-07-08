export BEGIN_PORT=1
export END_PORT=65535
export BEGIN_ART_PORT=50000
export END_ART_PORTS=50001
export SCANNING_TECHNIQUES=("fetch" "websocket" "xhr")
export N_SCANS=1
export PARALLEL_SOCKETS=(1 5 10 20 50 70 100 50 100 250)
# export PARALLEL_SOCKETS=(250) 
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

for TECHNIQUE in "${SCANNING_TECHNIQUES[@]}"; do 
  for PARALLEL_SOCKET in "${PARALLEL_SOCKETS[@]}"; do
  for END_ART_PORT in "${END_ART_PORTS[@]}"; do
    export SCANNING_TECHNIQUE=$TECHNIQUE
    export PARALLEL_SOCKET=$PARALLEL_SOCKET
    export END_ART_PORT=$END_ART_PORT
    # Start the first server

    # Start the second server
    # npx --yes ts-node /artificial-ports-server/app.ts > /dev/stdout 2>&1 &

    # Add any necessary waiting logic here, e.g., polling an endpoint

    # Start the Java command using the environment variables
    java -DBEGIN_PORT="$BEGIN_PORT" -DEND_PORT="$END_PORT" -DN_SCANS="$N_SCANS" -DPARALLEL_SOCKETS="$PARALLEL_SOCKET" -DSOCKET_TIMEOUT="$SOCKET_TIMEOUT" -DSCANNING_TECHNIQUE="$SCANNING_TECHNIQUE" -DCONTAINER_NAME="$CONTAINER_NAME" -jar ./selenium-portscan/target/selenium-portscan-1.0.0-jar-with-dependencies.jar > /dev/stdout 2>&1
    TIMESTAMP=$(date "+%Y.%m.%d-%H.%M.%S")
    metadataFile="scan-results/$TIMESTAMP/metadata.txt"
    mkdir -p "scan-results/$TIMESTAMP/results"
    mv ./dist/server/results/scan-results.json scan-results/$TIMESTAMP/results/scan-results.json
    touch $metadataFile

    echo "TIMESTAMP=$TIMESTAMP" > $metadataFile
    echo "BASE_IMAGE=Ubuntu 22.04 LTS" >> $metadataFile
    echo "BEGIN_PORT=$BEGIN_PORT" >> $metadataFile
    echo "END_PORT=$END_PORT" >> $metadataFile
    echo "SCANNING_TECHNIQUE=$SCANNING_TECHNIQUE" >> $metadataFile
    echo "N_SCANS=$N_SCANS" >> $metadataFile
    echo "PARALLEL_SOCKETS=$PARALLEL_SOCKETS" >> $metadataFile
    echo "SOCKET_TIMEOUT=$SOCKET_TIMEOUT" >> $metadataFile
    echo "BEGIN_ARTIFICIAL_PORT_RANGE=$BEGIN_ART_PORT" >> $metadataFile
    echo "END_ARTIFICIAL_PORT_RANGE=$END_ART_PORT" >> $metadataFile
  done
done
done