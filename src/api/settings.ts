import type { SettingsGroup } from '@/components/Setting/gmSetting'
import http from './http'

export interface ApiSetinngData {
  id: number
  name: string
  content: { [key: string]: string }
}

// 获取设置项
export async function apiGetSettings(role: string) {
  return new Promise<ApiSetinngData[]>((resolve, reject) => {
    http
      .get(`settings?role=${role}`)
      .then((res) => {
        if (res.data.status === 200) resolve(res.data.data)
        else reject(res.data.message)
      })
      .catch(() => {
        reject('网络错误')
      })
  })
}

// 更新设置项
export async function apiPutSettings(data: ApiSetinngData) {
  return new Promise<boolean>((resolve, reject) => {
    http
      .put(`settings`, data)
      .then((res) => {
        if (res.data.status === 200) resolve(true)
        else reject(res.data.message)
      })
      .catch(() => {
        reject('网络错误')
      })
  })
}

// 获取当前主题设置项
export async function apiGetThemeSettings() {
  return new Promise<SettingsGroup[]>((resolve, reject) => {
    http
      .get(`theme`)
      .then((res) => {
        if (res.data.status === 200) resolve(res.data.data)
        else reject(res.data.message)
      })
      .catch(() => {
        reject('网络错误')
      })
  })
}

// 更新当前主题设置项
export async function apiPutThemeSettings(data: ApiSetinngData) {
  return new Promise<boolean>((resolve, reject) => {
    http
      .put(`theme`, data)
      .then((res) => {
        if (res.data.status === 200) resolve(true)
        else reject(res.data.message)
      })
      .catch(() => {
        reject('网络错误')
      })
  })
}

// 上传插件设置项
export async function apiPostPluginSettings(data: ApiSetinngData) {
  return new Promise<boolean>((resolve, reject) => {
    http
      .post(`settings/plugins`, data)
      .then((res) => {
        if (res.data.status === 200) resolve(true)
        else reject(res.data.message)
      })
      .catch(() => {
        reject('网络错误')
      })
  })
}

// 删除插件设置项
export async function apiDelPluginSettings(name: string) {
  return new Promise<boolean>((resolve, reject) => {
    http
      .delete(`settings/plugins/${name}`)
      .then((res) => {
        if (res.data.status === 200) resolve(true)
        else reject(res.data.message)
      })
      .catch(() => {
        reject('网络错误')
      })
  })
}

// 更新插件项
export async function apiPutPlugSettings(data: ApiSetinngData) {
  return new Promise<boolean>((resolve, reject) => {
    http
      .put(`settings/plugins`, data)
      .then((res) => {
        if (res.data.status === 200) resolve(true)
        else reject(res.data.message)
      })
      .catch(() => {
        reject('网络错误')
      })
  })
}
