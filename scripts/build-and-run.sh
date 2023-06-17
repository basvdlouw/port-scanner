UBUNTU_BASE_IMAGE=library/ubuntu:22.04
BEGIN_PORT=1000
END_PORT=3000
SCANNING_TECHNIQUE=fetch
N_SCANS=1
PARALLEL_SOCKETS=200
SOCKET_TIMEOUT=300

./scripts/build.sh $UBUNTU_BASE_IMAGE
./scripts/remove-containers.sh
./scripts/run.sh

echo "Finished Running"
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
./scripts/save-metadata.sh $UBUNTU_BASE_IMAGE $BEGIN_PORT $END_PORT $SCANNING_TECHNIQUE $N_SCANS $PARALLEL_SOCKETS $SOCKET_TIMEOUT $current_time
./scripts/copy-scan-results-from-container.sh $current_time