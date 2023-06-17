UBUNTU_BASE_IMAGE=library/ubuntu:22.04
BEGIN_PORT=1
END_PORT=1000
SCANNING_TECHNIQUE=fetch
N_SCANS=1
PARALLEL_SOCKETS=1
SOCKET_TIMEOUT=500

./scripts/build.sh $UBUNTU_BASE_IMAGE
./scripts/remove-containers.sh
./scripts/run.sh $BEGIN_PORT $END_PORT $SCANNING_TECHNIQUE $N_SCANS $PARALLEL_SOCKETS $SOCKET_TIMEOUT $current_time
while true; do
    container_status=$(docker inspect -f '{{.State.Running}}' "$(docker ps -aqf "name=ubuntu-container")")
    if [[ "$container_status" == "true" ]]; then
        echo "Container is still running."
    else
        echo "Container has stopped."
        break
    fi
    # Wait for some time before checking again
    sleep 5  # Adjust the sleep duration as needed
done
echo "Finished Running"
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
./scripts/save-metadata.sh $UBUNTU_BASE_IMAGE $BEGIN_PORT $END_PORT $SCANNING_TECHNIQUE $N_SCANS $PARALLEL_SOCKETS $SOCKET_TIMEOUT $current_time
./scripts/copy-scan-results-from-container.sh $current_time