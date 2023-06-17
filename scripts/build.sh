#!/bin/bash
BASE_IMAGE=$1
DOCKERFILE=$2
TAG=$3
# WINDOWS_BASE_IMAGE="mcr.microsoft.com/windows:20H2-amd64"

docker build --build-arg BASE_IMAGE="$BASE_IMAGE" \
             -f $DOCKERFILE . -t $TAG