docker run -e BEGIN_PORT=10005 -e END_PORT=10300 --detach --name win-container windows-experiment
docker exec -it win-container cmd