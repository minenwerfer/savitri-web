/// <reference types="vue/macros-global" />

/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'variables' {
  const strict: boolean
  const bundleName: string
  const workingDir: string
  const productName: string
  const productLogo: string
  const defaultTheme: string
}

declare module 'vue-unicons/dist/icons' {
}

declare module '@savitri/ui' {
  export { default as routes } from '../ui/router'
}

declare var ROUTER: any
declare var I18N: any
declare var STORES: Record<string, any>
declare var QUERY_CACHE: Record<string, {
  items: Array<any>
  satisfied: boolean
}>
