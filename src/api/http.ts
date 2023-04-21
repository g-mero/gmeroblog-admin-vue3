import { useUserStore } from '@/stores/user'
import { getConfig } from '@/utils/config'
import { getToken } from '@/utils/token'
import axios from 'axios'

const http = axios.create({
  timeout: 5000
})

http.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${getToken()}`
    return config
  },
  (error) => {
    return error
  }
)

const isTokenError = (status: number) => {
  if (status >= 1004 && status <= 1007) return true
  return false
}

http.interceptors.response.use(
  (res) => {
    if (res.data.status && isTokenError(res.data.status)) {
      useUserStore().clear()
      window.location.reload()
    }
    return res
  },
  (error) => {
    return Promise.reject(error)
  }
)

export function httpInit() {
  http.defaults.baseURL = getConfig().Api
}

export default http
