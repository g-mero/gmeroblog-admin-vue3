import { genDesc, md2html } from '@/utils/article'
import http from './http'

export interface PostDiaryData {
  time: string
  desc: string
  content: string
  extra: string
}

// 获取单个日记
export async function apiGetDiary(time: string) {
  return new Promise<PostDiaryData>((resolve, reject) => {
    http
      .get(`diaries/${time}`)
      .then((res) => {
        if (res.data.status === 200) {
          resolve(res.data.data)
        } else {
          reject(res.data.message)
        }
      })
      .catch(() => {
        reject(`网络错误`)
      })
  })
}

// 获取多条日记
export async function apiGetDiaries(year: string, month: string) {
  return new Promise<PostDiaryData[]>((resolve, reject) => {
    http
      .get(`diaries?year=${year}&month=${month}`)
      .then((res) => {
        if (res.data.status === 200) {
          resolve(res.data.data)
        } else {
          reject(res.data.message)
        }
      })
      .catch(() => {
        reject(`网络错误`)
      })
  })
}

// 获取日记时间
export async function apiGetDiarydates(year: string, month: string) {
  return new Promise<string[]>((resolve, reject) => {
    http
      .get(`diaries/date?year=${year}&month=${month}`)
      .then((res) => {
        if (res.data.status === 200) {
          resolve(res.data.data)
        } else {
          reject(res.data.message)
        }
      })
      .catch(() => {
        reject(`网络错误`)
      })
  })
}

// 上传日记
export async function apiPostDiary(data: PostDiaryData) {
  const postData = {
    time: data.time,
    content: data.content,
    desc: data.desc || genDesc(md2html(data.content)),
    extra: data.extra
  }
  return new Promise<boolean>((resolve, reject) => {
    http
      .post(`diaries`, postData)
      .then((res) => {
        if (res.data.status === 200) {
          resolve(true)
        } else {
          reject(res.data.message)
        }
      })
      .catch(() => {
        reject(`网络错误`)
      })
  })
}

// 修改日记
export async function apiPutDiary(time: string, data: PostDiaryData) {
  const postData = {
    content: data.content,
    desc: data.desc || genDesc(md2html(data.content)),
    extra: data.extra
  }
  return new Promise<boolean>((resolve, reject) => {
    http
      .put(`diaries/${time}`, postData)
      .then((res) => {
        if (res.data.status === 200) {
          resolve(true)
        } else {
          reject(res.data.message)
        }
      })
      .catch(() => {
        reject(`网络错误`)
      })
  })
}

// 删除日记
export async function apiDelDiary(time: string) {
  return new Promise<boolean>((resolve, reject) => {
    http
      .delete(`diaries/${time}`)
      .then((res) => {
        if (res.data.status === 200) {
          resolve(true)
        } else {
          reject(res.data.message)
        }
      })
      .catch(() => {
        reject(`网络错误`)
      })
  })
}
