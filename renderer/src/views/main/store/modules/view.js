import { defineStore } from 'pinia'

export const useViewStore = defineStore({
  id: 'view-store',
  state: () => ({
    url: 'http://localhost:8080',

    canBack: false,
    canForward: false,
    canReload: true
  }),
  actions: {}
})
