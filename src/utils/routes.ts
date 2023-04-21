import type { MenuItem, MenuItemWithTo, MenuItemWithChild } from '@/components/Menu/menuItem'
import type { MenuRouterItem, MenuRouterItemWithOutChild } from '@/router/menuRoutes/types'
import { orderBy } from 'lodash-es'
import type { RouteRecordRaw } from 'vue-router'

export function MenuRouterItemsToRoutes(menuRouteItems: MenuRouterItem[]): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = []

  function childTochild(children: MenuRouterItemWithOutChild[]): RouteRecordRaw[] {
    const res: RouteRecordRaw[] = []
    children.forEach((v) => {
      const tmp: RouteRecordRaw = {
        path: v.path,
        name: v.name,
        component: v.component
      }

      res.push(tmp)
    })

    return res
  }

  menuRouteItems.forEach((item) => {
    if (item.children) {
      const tmp: RouteRecordRaw = {
        path: item.path || '/',
        children: childTochild(item.children)
      }

      result.push(tmp)
    } else if (item.component) {
      const tmp: RouteRecordRaw = {
        path: item.path || '/',
        name: item.name,
        component: item.component
      }
      result.push(tmp)
    }
  })

  return result
}

export function MenuRouterItemsToMenus(menuRouteItems: MenuRouterItem[]): MenuItem[] {
  const result: MenuItem[] = []

  function childTochild(children: MenuRouterItemWithOutChild[]): MenuItemWithTo[] {
    const res: MenuItemWithTo[] = []
    children.forEach((v) => {
      const tmp: MenuItemWithTo = {
        title: v.mate.title,
        icon: v.mate.icon,
        rank: v.mate.rank || 0,
        to: v.name
      }

      res.push(tmp)
    })

    return orderBy(res, ['rank'], ['desc'])
  }

  menuRouteItems.forEach((item) => {
    if (item.children) {
      const tmp: MenuItemWithChild = {
        title: item.mate.title,
        rank: item.mate.rank || 0,
        children: childTochild(item.children)
      }

      result.push(tmp)
    } else if (item.mate.icon) {
      const tmp: MenuItemWithTo = {
        title: item.mate.title,
        icon: item.mate.icon,
        rank: item.mate.rank || 0,
        to: item.name || '/'
      }
      result.push(tmp)
    }
  })

  // 根据rank重新排序
  const sortRes = orderBy(result, ['rank'], ['desc'])

  return sortRes
}

/**
 * 
 * @param name 路由的name属性
 * @param menuItems 菜单对象一维数组
 * @returns 
 */
export function findMenuItemByName(name: string, menuItems: MenuItemWithTo[]) {
  for (let i = 0; i < menuItems.length; i += 1) {
    const menuItem = menuItems[i]

    if (menuItem.to === name) return menuItem
  }
}

/**
 * 把嵌套菜单拍成一维
 * @param menuItems 菜单项数组
 * @returns {MenuItemWithTo[]}
 */
export function MenuItemsToMenuItemsWithTo(menuItems: MenuItem[]): MenuItemWithTo[] {
  const result: MenuItemWithTo[] = []

  menuItems.forEach((v) => {
    if (v.children) {
      result.push(...v.children)
    } else {
      result.push(v)
    }
  })

  return result
}
