#!/usr/bin/env zx

import { fs } from 'zx'

console.log()
console.log('compiling...')
if (!(await fs.exists('target'))) {
  await fs.mkdir('target')
} else {
  if (await fs.exists('target/index.js')) {
    await fs.rm('target/index.js')
  }
}
await $`rollup -c`

console.log()
console.log('debugging...')
cd('target')
$`electron .`