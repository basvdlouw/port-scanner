#!/bin/bash
BASE_IMAGE=$1
DOCKERFILE=$2
TAG=$3

docker build --build-arg BASE_IMAGE="$BASE_IMAGE" \
             -f $DOCKERFILE . -t $TAG