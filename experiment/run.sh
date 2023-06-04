# docker run -e BEGIN_PORT=10005 -e END_PORT=10300 --detach --name win-container windows-experiment
docker run -e BEGIN_PORT=10005 -e END_PORT=10300 --detach -t --name ubuntu-container ubuntu-experiment

# docker exec -it win-container cmd
docker exec -it ubuntu-container bash