BEGIN_PORT=$1
END_PORT=$2
SCANNING_TECHNIQUE=$3
N_SCANS=$4
PARALLEL_SOCKETS=$5
SOCKET_TIMEOUT=$6

docker run -e BEGIN_PORT=$1 \
           -e END_PORT=$2 \
           -e SCANNING_TECHNIQUE=$3 \
           -e N_SCANS=$4 \
           -e PARALLEL_SOCKETS=$5 \
           -e SOCKET_TIMEOUT=$6 \
           --privileged=true \
           --security-opt seccomp=scripts/settings.json \
           --detach -t --name ubuntu-container \
           ubuntu-experiment