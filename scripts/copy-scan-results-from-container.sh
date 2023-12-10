TIMESTAMP=$1
CONTAINER_NAME=$2
LOCALDIR="C:/git/port-scanner/scan-results"

if [ "$CONTAINER_NAME" = "win-container" ]; then
docker cp $(docker ps -aqf "name=$CONTAINER_NAME"):C:/app/public/server/results "$LOCALDIR/$TIMESTAMP"
docker cp $(docker ps -aqf "name=$CONTAINER_NAME"):C:/app/chromedriver.log "$LOCALDIR/$TIMESTAMP"
docker cp $(docker ps -aqf "name=$CONTAINER_NAME"):C:/app/geckodriver.log "$LOCALDIR/$TIMESTAMP"
elif [ "$CONTAINER_NAME" = "ubuntu-container" ]; then
docker cp $(docker ps -aqf "name=$CONTAINER_NAME"):/app/public/server/results "$LOCALDIR/$TIMESTAMP"
docker cp $(docker ps -aqf "name=$CONTAINER_NAME"):/app/chromedriver.log "$LOCALDIR/$TIMESTAMP"
docker cp $(docker ps -aqf "name=$CONTAINER_NAME"):/app/geckodriver.log "$LOCALDIR/$TIMESTAMP"
fi