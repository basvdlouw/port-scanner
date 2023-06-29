BASE_IMAGE=$1
BEGIN_PORT=$2
END_PORT=$3
SCANNING_TECHNIQUE=$4
N_SCANS=$5
PARALLEL_SOCKETS=$6
SOCKET_TIMEOUT=$7
TIMESTAMP=$8
BEGIN_ART_PORT=$9
END_ART_PORT=${10}
DOCKERFILE=${11}

metadataFile="C:/git/port-scanner/scan-results/$TIMESTAMP/metadata.txt"

mkdir -p "C:/git/port-scanner/scan-results/$TIMESTAMP"
touch $metadataFile

echo "TIMESTAMP=$TIMESTAMP" > $metadataFile
echo "BASE_IMAGE=$BASE_IMAGE" >> $metadataFile
echo "BEGIN_PORT=$BEGIN_PORT" >> $metadataFile
echo "END_PORT=$END_PORT" >> $metadataFile
echo "SCANNING_TECHNIQUE=$SCANNING_TECHNIQUE" >> $metadataFile
echo "N_SCANS=$N_SCANS" >> $metadataFile
echo "PARALLEL_SOCKETS=$PARALLEL_SOCKETS" >> $metadataFile
echo "SOCKET_TIMEOUT=$SOCKET_TIMEOUT" >> $metadataFile
echo "BEGIN_ARTIFICIAL_PORT_RANGE=$BEGIN_ART_PORT" >> $metadataFile
echo "END_ARTIFICIAL_PORT_RANGE=$END_ART_PORT" >> $metadataFile
echo "DOCKERFILE=$DOCKERFILE" >> $metadataFile
