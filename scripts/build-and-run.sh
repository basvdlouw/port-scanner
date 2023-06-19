# BASE_IMAGE="mcr.microsoft.com/windows:20H2-amd64"
# DOCKERFILE="Dockerfile.windows"
# CONTAINER_NAME="win-container"
# BEGIN_PORT=1
# END_PORT=65535
# SCANNING_TECHNIQUE=websocket
# N_SCANS=1
# PARALLEL_SOCKETS=250
# SOCKET_TIMEOUT=200
# TAG="windows-chrome"

BASE_IMAGE=library/ubuntu:22.04
DOCKERFILE="Dockerfile.ubuntu"
CONTAINER_NAME="ubuntu-container"
BEGIN_PORT=1
END_PORT=65535
SCANNING_TECHNIQUE=xhr
N_SCANS=1
PARALLEL_SOCKETS=250
SOCKET_TIMEOUT=200
TAG="ubuntu-chrome"

./scripts/build.sh $BASE_IMAGE $DOCKERFILE $TAG
./scripts/remove-containers.sh
./scripts/run.sh $BEGIN_PORT $END_PORT $SCANNING_TECHNIQUE $N_SCANS $PARALLEL_SOCKETS $SOCKET_TIMEOUT $current_time $CONTAINER_NAME $TAG
while true; do
    container_status=$(docker inspect -f '{{.State.Running}}' "$(docker ps -aqf "name=$CONTAINER_NAME")")
    if [[ "$container_status" == "true" ]]; then
        echo "Container is still running."
    else
        echo "Container has stopped."
        break
    fi
    sleep 5
done
echo "Finished Running"
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
./scripts/save-metadata.sh $BASE_IMAGE $BEGIN_PORT $END_PORT $SCANNING_TECHNIQUE $N_SCANS $PARALLEL_SOCKETS $SOCKET_TIMEOUT $current_time
./scripts/copy-scan-results-from-container.sh $current_time $CONTAINER_NAME