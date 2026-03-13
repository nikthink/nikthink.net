#!/usr/bin/env bash

hugoBuildFlags="--enableGitInfo --panicOnWarning --printI18nWarnings --printPathWarnings $1"

build() {
    rm -rf ./public/
    make all
}

build

while inotifywait -e create,modify,delete,move -r --exclude .git/ .; do
    build
done
