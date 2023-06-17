#!/bin/bash
UBUNTU_BASE_IMAGE=$1
# WINDOWS_BASE_IMAGE="mcr.microsoft.com/windows:20H2-amd64"

docker build --build-arg BASE_IMAGE="$UBUNTU_BASE_IMAGE" \
             -f Dockerfile.ubuntu . -t ubuntu-experiment