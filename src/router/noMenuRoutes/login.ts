import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/login',
  name: 'login',
  component: () => import('@/views/login/LoginView.vue')
} as RouteRecordRaw
