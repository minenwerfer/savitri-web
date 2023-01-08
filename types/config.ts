import type { RouteRecordRaw } from 'vue-router'
import type { RouterExtension } from '../core/router'

export type Plugin = {
  routerExtension?: RouterExtension
}

export type MenuSchema = Record<string, {
  roles?: Array<string>
  children: Array<string>
  shrink?: boolean
}>

export type AppOptions = {
  component: any
  i18n?: any
  menuSchema?: MenuSchema
  routerExtension?: RouterExtension
  modules?: Array<Plugin>
  routes?: Array<RouteRecordRaw>
}
