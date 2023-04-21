import { checkToken } from '@/api/user'
import { useUserStore } from '@/stores/user'
import notice from '@/utils/notice'
import { MenuRouterItemsToMenus, MenuRouterItemsToRoutes } from '@/utils/routes'
import Gsession from '@/utils/sessionStorage'
import { ref } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { MenuRouterItem } from './menuRoutes/types'

const menuRoutesFiles: Record<string, any> = import.meta.glob(
  ['./menuRoutes/**/*.ts', '!./menuRoutes/**/types.ts'],
  {
    eager: true
  }
)

const noMenuRoutesFiles: Record<string, any> = import.meta.glob(['./noMenuRoutes/**/*.ts'], {
  eager: true
})

const noMenuBuiltInRoutesFiles: Record<string, any> = import.meta.glob(
  ['./noMenuBuiltInRoutes/**/*.ts'],
  {
    eager: true
  }
)

function getArrayFromFiles(records: Record<string, any>) {
  const result: any[] = []
  Object.keys(records).forEach((key) => {
    result.push(records[key].default)
  })
  return result
}

/* 存储从文件读取到的路由信息 */
const menuRoutes: MenuRouterItem[] = getArrayFromFiles(menuRoutesFiles)

export const routeMenus = MenuRouterItemsToMenus(menuRoutes)

const noMenuRoutes: RouteRecordRaw[] = getArrayFromFiles(noMenuRoutesFiles)

/**
 * 不在菜单显示，但属于内置路由显示在layout中
 */
const noMenuBuiltInRoutes: MenuRouterItem[] = getArrayFromFiles(noMenuBuiltInRoutesFiles)

export const noMenuRouteMenus = MenuRouterItemsToMenus(noMenuBuiltInRoutes)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layout/GlobalLayout.vue'),
      children: MenuRouterItemsToRoutes(menuRoutes).concat(
        MenuRouterItemsToRoutes(noMenuBuiltInRoutes)
      )
    },
    ...noMenuRoutes
  ]
})

export const currentRouteName = ref('')

export const GlobalLoading = ref(false)

/* 路由后置 */
router.afterEach((to) => {
  GlobalLoading.value = false
  currentRouteName.value = to.name?.toString() || ''
})

/* 路由前置 */
router.beforeEach((to, from, next) => {
  GlobalLoading.value = true
  const except = () => {
    if (to.matched.length === 0) next({ name: '404' })
    else if (to.name === 'login') next({ name: 'home' })
    else next()
  }

  const refuse = () => {
    if (to.name === 'login') next()
    else next({ name: 'login', query: { from: to.name?.toString() } })
  }

  // 鉴权
  if (useUserStore().check()) {
    if (!Gsession.get('no_check')) {
      checkToken()
        .then((res) => {
          if (res) {
            console.log('correct')

            Gsession.set('no_check', '1')
            except()
          } else refuse()
        })
        .catch((e) => {
          notice.error(e)
          return false
        })
    } else except()
  } else refuse()
})

export default router
