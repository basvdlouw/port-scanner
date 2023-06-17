BEGIN_PORT=$1
END_PORT=$2
SCANNING_TECHNIQUE=$3
N_SCANS=$4
PARALLEL_SOCKETS=$5
SOCKET_TIMEOUT=$6

docker run -e BEGIN_PORT=$BEGIN_PORT \
           -e END_PORT=$END_PORT \
           -e SCANNING_TECHNIQUE=$SCANNING_TECHNIQUE \
           -e N_SCANS=$N_SCANS \
           -e PARALLEL_SOCKETS=$PARALLEL_SOCKETS \
           -e SOCKET_TIMEOUT=$SOCKET_TIMEOUT \
           -e BEGIN_ART_PORT=5000 \
           -e END_ART_PORT=5005 \
           --privileged=true \
           --security-opt seccomp=scripts/settings.json \
           --detach -t --name ubuntu-container \
           ubuntu-experiment