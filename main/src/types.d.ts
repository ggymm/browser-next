declare interface Bounds {
  x: number
  y: number
  width: number
  height: number
  maximized?: boolean
  fullscreen?: boolean
}

declare interface Margin {
  top: number
  left: number
  right: number
  bottom: number
  refresh?: boolean
}
