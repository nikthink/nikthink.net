#!/usr/bin/env bash

rm -r ./public/ &&
        hugo -b / --enableGitInfo

while inotifywait -e create,modify,delete -r --exclude .git/ .; do
    rm -r ./public/ &&
        hugo -b / --enableGitInfo
done
