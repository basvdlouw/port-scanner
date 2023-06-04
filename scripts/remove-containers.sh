if docker ps -a --filter "name=win-container" | grep -q "win-container"; then
  docker ps -a --filter "name=win-container" -q | xargs docker rm -f
fi

if docker ps -a --filter "name=ubuntu-container" | grep -q "ubuntu-container"; then
  docker ps -a --filter "name=ubuntu-container" -q | xargs docker rm -f
fi