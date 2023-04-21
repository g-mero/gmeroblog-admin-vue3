import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/diary',
  name: 'diary',
  component: () => import('@/views/diary/diaryShowcase/DiaryView.vue')
} as RouteRecordRaw
