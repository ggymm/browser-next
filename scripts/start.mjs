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
console.log('starting renderer...')

cd('renderer')
$`npm run start`
cd('..') // back to root

console.log()
console.log('starting electron...')

cd('app')
$`npm run start:dev`
cd('..') // back to root
