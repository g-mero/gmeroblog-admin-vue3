import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/404',
  name: '404',
  component: () => import('@/views/error/ErrorNotFound.vue')
} as RouteRecordRaw
