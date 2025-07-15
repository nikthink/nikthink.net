#!/usr/bin/env bash

hugoBuildFlags="--enableGitInfo --panicOnWarning --printI18nWarnings --printPathWarnings $1"

build() {
    rm -rf ./public/ &&
        hugo -b / $hugoBuildFlags &&
        cp -a ./legal-statements.html ./changelog.rss ./data/ ./public/ &&
        mkdir ./public/archives/ &&
        tar -zcf ./public/archives/nikthink-net-full.tgz \
            .editorconfig .github/workflows/* ./*
}

build

while inotifywait -e create,modify,delete,move -r --exclude .git/ .; do
    build
done
