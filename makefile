.POSIX:
.SUFFIXES:
.SUFFIXES: .mmd .png

all: checkDependencies mermaidjs hugo postHugoCopy websiteArchive

clean:
	rm -rf ./public/
	rm -fv content/notes/ir/irg.png

checkDependencies:
	@if [ ! -f /usr/bin/hugo ] || [ ! -f /usr/bin/npx ]; then \
		printf 'warning: %s\n' 'needed dependencies for a full build: hugo, npx (npm)' >> /dev/stderr; \
	fi

.mmd.png:
	npx -p @mermaid-js/mermaid-cli mmdc -i $< -o $@

mermaidjs: content/notes/ir/irg.png

hugo:
	hugo --enableGitInfo --panicOnWarning --printI18nWarnings --printPathWarnings

postHugoCopy:
	cp -a ./changelog.rss ./data/ ./public/

websiteArchive:
	mkdir -p ./public/archives/
	tar --exclude='./public/archives' --exclude='./wip' -zcf public/archives/nikthink-net-full-latest.tgz .editorconfig .gitignore .gitmodules .github/workflows/* ./*
