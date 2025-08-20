#!/bin/sh

echo "Starting..."
(cd main && npm run build:main)
(cd preload && npm run build:preload)
(cd renderer && npm run start:renderer)
