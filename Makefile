PROJECT     := $(notdir ${PWD})
FONT_NAME   := typicons

################################################################################
## ! DO NOT EDIT BELOW THIS LINE, UNLESS YOU REALLY KNOW WHAT ARE YOU DOING ! ##
################################################################################

TMP_PATH    := /tmp/${PROJECT}-$(shell date +%s)
REMOTE_NAME ?= origin
REMOTE_REPO ?= $(shell git config --get remote.${REMOTE_NAME}.url)
FONTBUILDER ?= ./support/font-builder/bin/

# Add local versions of ttf2eot and ttfautohint to the PATH
PATH := $(PATH):./support/font-builder/support/ttf2eot/ttf2eot
PATH := $(PATH):./support/font-builder/support/ttfautohint/ttfautohint
PATH := $(PATH):./support/font-builder/bin

dist: font html


dump:
	rm -r ./src/svg/
	mkdir ./src/svg/
	font-dump.js --hcrop -c config.yml -f -i ./src/original/Typicons.svg -o ./src/svg/ -d diff.yml

font:
	@if test ! -d support/font-builder/bin ; then \
		echo "font-builder binaries not found. run:" >&2 ; \
		echo "  make support" >&2 ; \
		exit 128 ; \
		fi
	@if test ! `which ttf2eot` ; then \
		echo "ttf2eot not found. run:" >&2 ; \
		echo "  make support" >&2 ; \
		exit 128 ; \
		fi
	@if test ! `which ttfautohint` ; then \
		echo "ttfautohint not found. run:" >&2 ; \
		echo "  make support" >&2 ; \
		exit 128 ; \
		fi
	$(FONTBUILDER)fontbuild.py -c ./config.yml -t ./src/font_template.sfd -i ./src/svg -o ./src/font/$(FONT_NAME).ttf
	ttfautohint --latin-fallback --hinting-limit=200 --hinting-range-max=50 --symbol ./src/font/$(FONT_NAME).ttf ./src/font/$(FONT_NAME)-hinted.ttf
	mv ./src/font/$(FONT_NAME)-hinted.ttf ./src/font/$(FONT_NAME).ttf
	$(FONTBUILDER)fontconvert.py -i ./src/font/$(FONT_NAME).ttf -o ./src/font
	ttf2eot < ./src/font/$(FONT_NAME).ttf >./src/font/$(FONT_NAME).eot


npm-deps:
	@if test ! `which npm` ; then \
		echo "Node.JS and NPM are required for html demo generation." >&2 ; \
		echo "This is non-fatal error and you'll still be able to build font," >&2 ; \
		echo "however, to build demo with >> make html << you need:" >&2 ; \
		echo "  - Install Node.JS and NPM" >&2 ; \
		echo "  - Run this task once again" >&2 ; \
		else \
		npm install -g jade js-yaml.bin ; \
		fi


support:
	git submodule init support/font-builder
	git submodule update support/font-builder
	which ttf2eot ttfautohint > /dev/null || (cd support/font-builder && $(MAKE))
	which js-yaml jade > /dev/null || $(MAKE) npm-deps


html:
	$(FONTBUILDER)tpl-render.js --locals config.yml --input ./src/demo/demo.jade --output ./src/font/demo.html
	$(FONTBUILDER)tpl-render.js --locals config.yml --input ./src/demo/font.css.jade --output ./src/font/typicons.css
	$(FONTBUILDER)tpl-minify.js --locals config.yml --input ./src/demo/font.css.jade --output ./src/font/typicons.min.css


gh-pages:
	@if test -z ${REMOTE_REPO} ; then \
		echo 'Remote repo URL not found' >&2 ; \
		exit 128 ; \
		fi
	cp -r ./src/font ${TMP_PATH} && \
		touch ${TMP_PATH}/.nojekyll
	cd ${TMP_PATH} && \
		git init && \
		git add . && \
		git commit -q -m 'refreshed gh-pages'
	cd ${TMP_PATH} && \
		git remote add remote ${REMOTE_REPO} && \
		git push --force remote +master:gh-pages
	rm -rf ${TMP_PATH}


.PHONY: font npm-deps support
