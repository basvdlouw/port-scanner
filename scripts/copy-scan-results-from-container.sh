TIMESTAMP=$1
CONTAINER_NAME=$2

if [ "$CONTAINER_NAME" = "win-container" ]; then
docker cp $(docker ps -aqf "name=$CONTAINER_NAME"):C:/app/public/server/results "C:/git/port-scanner/scan-results/$TIMESTAMP"
docker cp $(docker ps -aqf "name=$CONTAINER_NAME"):C:/app/chromedriver.log "C:/git/port-scanner/scan-results/$TIMESTAMP"
elif [ "$CONTAINER_NAME" = "ubuntu-container" ]; then
docker cp $(docker ps -aqf "name=$CONTAINER_NAME"):/app/public/server/results "C:/git/port-scanner/scan-results/$TIMESTAMP"
docker cp $(docker ps -aqf "name=$CONTAINER_NAME"):/app/chromedriver.log "C:/git/port-scanner/scan-results/$TIMESTAMP"
fi