#!/usr/bin/env zx

console.log()
console.log('building main...')

cd('main')
await $`npm run build`
cd('..') // back to root

console.log()
console.log('building preload...')

cd('preload')
await $`npm run build`
cd('..') // back to root

console.log()
console.log('building renderer...')

cd('renderer')
await $`npm run build`
cd('..') // back to root

console.log()
console.log('building electron...')

cd('app')
await $`npm run build`
cd('..') // back to root
