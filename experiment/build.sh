#!/bin/bash

UBUNTU_BASE_IMAGE="library/ubuntu:22.04"
WINDOWS_BASE_IMAGE="mcr.microsoft.com/windows:20H2-amd64"

# docker build --build-arg BASE_IMAGE="$WINDOWS_BASE_IMAGE" -f ./Dockerfile.windows . -t windows-experiment
docker build --build-arg BASE_IMAGE="$UBUNTU_BASE_IMAGE" -f ./Dockerfile.ubuntu . -t ubuntu-experiment