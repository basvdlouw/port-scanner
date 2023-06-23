BEGIN_PORT=$1
END_PORT=$2
SCANNING_TECHNIQUE=$3
N_SCANS=$4
PARALLEL_SOCKETS=$5
SOCKET_TIMEOUT=$6
CONTAINER_NAME=$7
TAG=$8
BEGIN_ART_PORT=$9
END_ART_PORT=${10}

if [ "$CONTAINER_NAME" = "win-container" ]; then
    docker run -e BEGIN_PORT=$BEGIN_PORT \
               -e END_PORT=$END_PORT \
               -e SCANNING_TECHNIQUE=$SCANNING_TECHNIQUE \
               -e N_SCANS=$N_SCANS \
               -e PARALLEL_SOCKETS=$PARALLEL_SOCKETS \
               -e SOCKET_TIMEOUT=$SOCKET_TIMEOUT \
               -e BEGIN_ART_PORT=$BEGIN_ART_PORT \
               -e END_ART_PORT=$END_ART_PORT \
               --shm-size=2048m \
               --detach -t --name $CONTAINER_NAME \
               $TAG
elif [ "$CONTAINER_NAME" = "ubuntu-container" ]; then
    docker run -e BEGIN_PORT=$BEGIN_PORT \
               -e END_PORT=$END_PORT \
               -e SCANNING_TECHNIQUE=$SCANNING_TECHNIQUE \
               -e N_SCANS=$N_SCANS \
               -e PARALLEL_SOCKETS=$PARALLEL_SOCKETS \
               -e SOCKET_TIMEOUT=$SOCKET_TIMEOUT \
               -e BEGIN_ART_PORT=$BEGIN_ART_PORT \
               -e END_ART_PORT=$END_ART_PORT \
               --shm-size=2048m \
               --privileged=true \
               --security-opt seccomp=scripts/settings.json \
               --detach -t --name $CONTAINER_NAME \
               $TAG
fi