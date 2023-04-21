import http from './http'

export interface PostCateData {
  id: number
  name: string
  slug: string
  group_id: number
  desc: string
  cover_img: string
  total: number
  role: number
}

export interface CateTree extends PostCateData {
  children: PostCateData[] | null
}

// 获取所有分类
export async function apiGetCates() {
  return new Promise<PostCateData[]>((resolve, reject) => {
    http
      .get(`categories`)
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

// 获取分类及分组树
export async function apiGetCateTree() {
  return new Promise<CateTree[]>((resolve, reject) => {
    http
      .get(`categories/tree`)
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

// 新增分类
export async function apiPostCate(data: {
  name: string
  slug: string
  group_id: number
  desc: string
  cover_img: string
  role: number
}) {
  return new Promise<boolean>((resolve, reject) => {
    http
      .post(`categories`, data)
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

// 编辑分类
export async function apiPutCate(
  id: number,
  data: {
    name: string
    slug: string
    group_id: number
    desc: string
    cover_img: string
  }
) {
  return new Promise<boolean>((resolve, reject) => {
    http
      .put(`categories/${id}`, data)
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

// 删除分类
export async function apiDelCate(id: number) {
  return new Promise<boolean>((resolve, reject) => {
    http
      .delete(`categories/${id}`)
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
