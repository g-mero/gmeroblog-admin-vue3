import type { MenuRouterItem } from './types'

export default {
  path: '/diary',
  mate: {
    title: '日记'
  },
  children: [
    {
      path: 'write-diary',
      name: 'write-diary',
      mate: {
        title: '写日记',
        icon: 'solar:pen-new-square-linear'
      },
      component: () => import('@/views/diary/writeDiary/WriteDiary.vue')
    }
  ]
} as MenuRouterItem
