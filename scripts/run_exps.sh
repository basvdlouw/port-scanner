# BASE_IMAGE="library/ubuntu:22.04"
# DOCKERFILE="Dockerfile.ubuntu-firefox"
# CONTAINER_NAME="ubuntu-container"
# BEGIN_PORT=49900
# END_PORT=50200
# BEGIN_ART_PORT=50000
# END_ART_PORTS=(50099)
# SCANNING_TECHNIQUES=("fetch" "websocket" "xhr")
# N_SCANS=1
# PARALLEL_SOCKETS=50
# SOCKET_TIMEOUTS=(100 150 200 250 300 350 400)
# TAG="ubuntu-firefox"

# BASE_IMAGE="mcr.microsoft.com/windows:20H2-amd64"
# DOCKERFILE="Dockerfile.windows-firefox"
# CONTAINER_NAME="win-container"
# BEGIN_PORT=49900
# END_PORT=50200
# BEGIN_ART_PORT=50000
# END_ART_PORTS=(50099)
# SCANNING_TECHNIQUES=("fetch" "websocket" "xhr")
# N_SCANS=1
# PARALLEL_SOCKETS=50
# SOCKET_TIMEOUTS=(100 150 200 250 300 350 400)
# TAG="windows-firefox"

# BASE_IMAGE="mcr.microsoft.com/windows:20H2-amd64"
# DOCKERFILE="Dockerfile.windows-chrome"
# CONTAINER_NAME="win-container"
# BEGIN_PORT=49900
# END_PORT=50200
# BEGIN_ART_PORT=50000
# END_ART_PORTS=(50099)
# SCANNING_TECHNIQUES=("fetch" "websocket" "xhr")
# N_SCANS=1
# PARALLEL_SOCKETS=50
# SOCKET_TIMEOUTS=(100 150 200 250 300 350 400)
# TAG="windows-chrome"

BASE_IMAGE=library/ubuntu:22.04
DOCKERFILE="Dockerfile.ubuntu-chrome"
CONTAINER_NAME="ubuntu-container"
BEGIN_PORT=49900
END_PORT=50200
BEGIN_ART_PORT=50000
END_ART_PORTS=(50099)
SCANNING_TECHNIQUES=("fetch" "websocket" "xhr")
N_SCANS=1
PARALLEL_SOCKETS=50
SOCKET_TIMEOUTS=(100 150 200 250 300 350 400)
TAG="ubuntu-chrome"

for TECHNIQUE in "${SCANNING_TECHNIQUES[@]}"; do
    for SOCKET_TIMEOUT in "${SOCKET_TIMEOUTS[@]}"; do
        for END_ART_PORT in "${END_ART_PORTS[@]}"; do
            ./scripts/build-and-run.sh $BASE_IMAGE $DOCKERFILE $CONTAINER_NAME $BEGIN_PORT $END_PORT $BEGIN_ART_PORT $END_ART_PORT $TECHNIQUE $N_SCANS $PARALLEL_SOCKETS $SOCKET_TIMEOUT $TAG
        done
    done
done