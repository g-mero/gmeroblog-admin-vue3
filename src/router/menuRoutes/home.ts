import type { MenuRouterItem } from './types'

export default {
  path: '/',
  name: 'home',
  mate: {
    title: '概况',
    icon: 'solar:window-frame-linear',
    rank: 99
  },
  component: () => import('@/views/home/HomeView.vue')
} as MenuRouterItem
