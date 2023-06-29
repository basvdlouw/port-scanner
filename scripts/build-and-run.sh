BASE_IMAGE=$1
DOCKERFILE=$2
CONTAINER_NAME=$3
BEGIN_PORT=$4
END_PORT=$5
BEGIN_ART_PORT=$6
END_ART_PORT=$7
SCANNING_TECHNIQUE=$8
N_SCANS=$9
PARALLEL_SOCKETS=${10}
SOCKET_TIMEOUT=${11}
TAG=${12}

./scripts/build.sh $BASE_IMAGE $DOCKERFILE $TAG
./scripts/remove-containers.sh
./scripts/run.sh $BEGIN_PORT $END_PORT $SCANNING_TECHNIQUE $N_SCANS $PARALLEL_SOCKETS $SOCKET_TIMEOUT $current_time $CONTAINER_NAME $TAG $BEGIN_ART_PORT $END_ART_PORT
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
./scripts/save-metadata.sh $BASE_IMAGE $BEGIN_PORT $END_PORT $SCANNING_TECHNIQUE $N_SCANS $PARALLEL_SOCKETS $SOCKET_TIMEOUT $current_time $BEGIN_ART_PORT $END_ART_PORT $DOCKERFILE
./scripts/copy-scan-results-from-container.sh $current_time $CONTAINER_NAME