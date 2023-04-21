import { useUserStore } from '@/stores/user'

export function getToken() {
  return useUserStore().accessToken
}
