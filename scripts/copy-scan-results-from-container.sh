TIMESTAMP=$1

docker cp $(docker ps -aqf "name=ubuntu-container"):/app/public/server/results "C:/git/port-scanner/scan-results/$TIMESTAMP"
docker cp $(docker ps -aqf "name=ubuntu-container"):/home/chromedriver.log "C:/git/port-scanner/scan-results/$TIMESTAMP"
