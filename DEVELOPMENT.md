Development docs
================

Set of scripts to easily build webfonts from SVG images.
For a detailed description of how Typicons were made, see [here](http://www.typicons.com/more/making-typicons/).

Installation
------------

### Ubuntu

**(!)** Use Ubuntu **12.04**. Or you will have to manually install fresh freetype library, to build ttfautohint.

Install dependencies (fontforge & python modules):

    sudo make dev-deps

Build additional software (ttf2eot, ttfautohint):

    make support


### Mac

See the font-builder README for additional steps to build for OSX.


### Windows

TBD. Anyone, please help.


Making font
-----------

### Steps

1. Place images into `/src/svg` folder.
2. Add image info to `config.yml` (see comments in it)
3. Edit css/html templates, if needed.
4. Run `make`

Generated data will be placed in `./font`

You can rebuild css/html only with `make html`

### SVG image requirements

Any image will be proportionnaly scaled, to fit height in ascent-descent
It's convenient to make height = 1000px. Default font baseline will be 20% from
the bottom.

In most cases it's ok to visually allign icons to middle line, not to baseline.
If you are not sure, how to start - make image with 10% top/bottom padding.
Then generate demo page and tune scale/offset.
