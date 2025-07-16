#!/usr/bin/env bash

main() {
    scriptTag="<!-- SCRIPT_ADD_ITEMS_HERE  -->"
    messageTmpFile=$(mktemp) || fatal "error creating temporary file #1"
    gitStagedFiles=$(git status --porcelain | grep -Ev '^( |\?)') || fatal "error getting git staged files"

    printf 'TITLE_TO_CHANGE\nURL_TO_CHANGE\n%s\n' "$gitStagedFiles" >> "$messageTmpFile"

    "$EDITOR" "$messageTmpFile" || fatal "error calling editor"

    title=$(cut -d $'\n' -f 1 < "$messageTmpFile") || fatal "error getting title from tmp file"
    url=$(cut -d $'\n' -f 2 < "$messageTmpFile") || fatal "error getting url from tmp file"
    description=$(cut -d $'\n' -f 3- < "$messageTmpFile") || fatal "error getting description from tmp file"
    descriptionForChangelogXmlEntry=$(cut -d $'\n' -f 3- < "$messageTmpFile" | sed -E 's/^/                /') || fatal "error getting description from tmp file"
    dateText=$(date -R) || fatal "error getting date"
    uuid=$(< /proc/sys/kernel/random/uuid) || fatal "error getting uuid"

    changelogEntry=$(cat <<EOF
        <item>
            <title>$title</title>
            <link>$url</link>
            <description>
$descriptionForChangelogXmlEntry
            </description>
            <pubDate>$dateText</pubDate>
            <guid isPermaLink="false">urn:uuid:$uuid</guid>
        </item>
EOF
)

    changelogEntryFile=$(mktemp) || fatal "error creating temporary file #2"
    printf '        %s\n%s\n' "$scriptTag" "$changelogEntry" > "$changelogEntryFile" || fatal "error writing changelog entry to tmp file"

    sed -i -e "/$scriptTag/ {
            r $changelogEntryFile
            d
        }" \
        ./changelog.rss

    git add ./changelog.rss || fatal "error adding changelog to files to commit"
    git commit -F - <<<"$title"$'\n'"$description" || fatal "error during git commit"
}

fatal() {
    error "$1"
    exit 1
}

error() {
    printf 'error: \e[31m%s\e[0m\n' "$1" >> /dev/stderr
}

info() {
    printf 'info: \e[34m%s\e[0m\n' "$1" >> /dev/stderr
}

main "$@"
