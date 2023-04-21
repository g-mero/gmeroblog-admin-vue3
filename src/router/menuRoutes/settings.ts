import type { MenuRouterItem } from './types'

export default {
  path: '/setting',
  mate: {
    title: '设置'
  },
  children: [
    {
      path: 'base',
      name: 'base-set',
      mate: {
        title: '博客设置',
        icon: 'solar:settings-linear'
      },
      component: () => import('@/views/settings/baseSetting/BaseSetting.vue')
    },
    {
      path: 'theme',
      name: 'theme-set',
      mate: {
        title: '主题设置',
        icon: 'solar:pallete-2-linear'
      },
      component: () => import('@/views/settings/themeSetting/ThemeSetting.vue')
    }
  ]
} as MenuRouterItem
