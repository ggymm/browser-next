#!/bin/sh

echo "Building..."
(cd main && npm run build:main)
(cd preload && npm run build:preload)
(cd renderer && npm run build:renderer)

echo "Building electron..."
(cd app && npm run build:electron)