import { tryOnMounted, tryOnUnmounted, useDebounceFn } from '@vueuse/core'

export function useWindowSizeFn(fn, wait = 150, options) {
  let handler = () => {
    fn()
  }
  handler = useDebounceFn(handler, wait)

  const start = () => {
    if (options && options.immediate) {
      handler()
    }
    window.addEventListener('resize', handler)
  }

  const stop = () => {
    window.removeEventListener('resize', handler)
  }

  tryOnMounted(() => {
    start()
  })

  tryOnUnmounted(() => {
    stop()
  })
  return [start, stop]
}
