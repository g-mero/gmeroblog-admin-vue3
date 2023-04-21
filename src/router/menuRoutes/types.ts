import type { RouteComponent } from 'vue-router'

export interface MenuRouterItem {
  path?: string
  name?: string
  mate: {
    title: string
    icon?: string
    rank?: number
  }
  children?: Array<MenuRouterItemWithOutChild>
  component?: RouteComponent
}

export interface MenuRouterItemWithOutChild {
  path: string
  name: string
  mate: {
    title: string
    icon: string
    rank?: number
  }
  component: RouteComponent
}
