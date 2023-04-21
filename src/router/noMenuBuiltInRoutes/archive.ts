import type { MenuRouterItem } from '../menuRoutes/types'

export default {
  path: '/archive',
  mate: {
    title: ''
  },
  children: [
    {
      path: 'edit-arts/:id',
      name: 'edit-arts',
      mate: {
        title: '编辑文章',
        icon: 'solar:pen-new-round-broken'
      },
      component: () => import('@/views/archive/editArt/EditArt.vue')
    }
  ]
} as MenuRouterItem
