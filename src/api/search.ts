import http from './http'

/**
 * 检查引擎情况
 */
export async function apiCheckSearch() {
  return new Promise<boolean>((resolve, reject) => {
    http
      .get(`search/check`)
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

// ! 重置索引, 该操作会清空原始索引，并在数据库获取所有文章再写入索引
export async function apiResetSearch() {
  return new Promise<boolean>((resolve, reject) => {
    http
      .post(`search/reset`)
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
