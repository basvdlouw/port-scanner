BASE_IMAGE=library/ubuntu:22.04
DOCKERFILE="Dockerfile.ubuntu"
CONTAINER_NAME="ubuntu-container"
BEGIN_PORT=49900
END_PORTS=(50010 50033 50050 50100)
BEGIN_ART_PORT=50000
END_ART_PORT=50050
SCANNING_TECHNIQUES=("fetch" "websocket" "xhr")
N_SCANS=1
PARALLEL_SOCKETS=250
SOCKET_TIMEOUT=200
TAG="ubuntu-chrome"

for END_PORT in "${END_PORTS[@]}"; do
  for TECHNIQUE in "${SCANNING_TECHNIQUES[@]}"; do 
    ./scripts/build-and-run.sh $BASE_IMAGE $DOCKERFILE $CONTAINER_NAME $BEGIN_PORT $END_PORT $BEGIN_ART_PORT $END_ART_PORT $TECHNIQUE $N_SCANS $PARALLEL_SOCKETS $SOCKET_TIMEOUT $TAG
  done
done