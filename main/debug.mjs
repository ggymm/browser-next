#!/usr/bin/env zx

$`rollup -c`
cd('target')
$`electron .`
