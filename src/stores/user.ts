import { userLogin, userLogout } from '@/api/user'
import { defineStore } from 'pinia'
import { parse, stringify } from 'zipson'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    accessToken: '',
    expires: 0
  }),
  actions: {
    clear() {
      this.username = ''
      this.accessToken = ''
      this.expires = 0
    },
    async login(data: { username: string; password: string }) {
      return new Promise((resolve, reject) => {
        userLogin(data)
          .then((res: ApiResponse) => {
            if (res.data.status === 200) {
              this.username = res.data.data['username']
              this.accessToken = res.data.data['access_token']
              this.expires = res.data.data['expires']
              resolve(1)
            } else {
              reject(res.data.message)
            }
          })
          .catch(() => {
            reject('网络错误')
          })
      })
    },
    async logOut() {
      return new Promise((resolve, reject) => {
        userLogout()
          .then((res) => {
            if (res.data.status === 200) {
              this.username = ''
              this.accessToken = ''
              this.expires = 0
              resolve(1)
            } else {
              reject(res.data.message)
            }
          })
          .catch(() => {
            reject('网络错误')
          })
      })
    },
    check() {
      if (this.accessToken === '' || this.expires === 0 || this.expires < Date.now() / 1000)
        return false
      else return true
    }
  },
  persist: {
    serializer: {
      deserialize: parse,
      serialize: stringify
    }
  }
})
