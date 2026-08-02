#!/usr/bin/env bash

makeTarget="all"

if ! [[ "$1" =~ ^\- ]]; then
    makeTarget="$1"
    shift
fi

hugoBuildFlags="$1"

build() {
    rm -rf ./public/
    make "HUGO_OPTS=$hugoBuildFlags" "$makeTarget"
}

build

while inotifywait -e create,modify,delete,move -r --exclude .git/ .; do
    build
done
