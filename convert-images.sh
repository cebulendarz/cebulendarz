#!/bin/bash

convert docs/cebula.png -resize 100 docs/cebula-100.png
cwebp docs/cebula-100.png -q 90 -alpha_q 100 -m 6 -o apps/webapp/src/assets/cebula.webp
