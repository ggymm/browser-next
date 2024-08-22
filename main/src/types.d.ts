declare interface IBounds {
  x: number
  y: number
  width: number
  height: number
  maximized?: boolean
  fullscreen?: boolean
}

declare interface IMargin {
  top: number
  left: number
  right: number
  bottom: number
  refresh?: boolean
}

declare interface IFavicon {
  url: string
  favicon: string
}

declare interface IHistory {
  url: string
  title: string
  favicon: string
  timestamp?: number
}
