import type { MenuRouterItem } from './types'

export default {
  path: '/archive',
  mate: {
    title: '内容'
  },
  children: [
    {
      path: 'write-art',
      name: 'write-art',
      mate: {
        title: '写文章',
        icon: 'solar:pen-2-linear'
      },
      component: () => import('@/views/archive/writeArt/WriteArt.vue')
    },
    {
      path: 'all-arts',
      name: 'all-arts',
      mate: {
        title: '文章总览',
        icon: 'solar:book-2-linear'
      },
      component: () => import('@/views/archive/allArts/AllArts.vue')
    },
    {
      path: 'category',
      name: 'category',
      mate: {
        title: '分类',
        icon: 'solar:inbox-line-linear'
      },
      component: () => import('@/views/archive/category/CateView.vue')
    }
  ]
} as MenuRouterItem
