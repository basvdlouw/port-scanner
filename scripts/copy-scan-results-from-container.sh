TIMESTAMP=$1

docker cp $(docker ps -aqf "name=ubuntu-container"):/app/public/server/results "C:/git/port-scanner/scan-results/$TIMESTAMP"
