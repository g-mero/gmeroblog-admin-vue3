import { genDesc, md2html } from '@/utils/article'
import http from './http'

export interface ArticleData {
  id: number
  cid: number
  updated_at: string
  title: string
  desc: string
  img: string
  text_count: number
  sees: number
  extra: string
}

export interface PostArticleData {
  cid: number
  title: string
  desc: string
  content: string
}

/**
 * 获取单个文章
 * @param id 文章id
 * @returns {Promise<PostArticleData>}
 */
export async function apiGetArt(id: number): Promise<PostArticleData> {
  return new Promise<PostArticleData>((resolve, reject) => {
    http
      .get(`articles/${id}`)
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

/**
 * 获取文章列表
 * @param ps 页长 最大20
 * @param pn 页码
 * @param cid 分类 0 代表所有
 * @param tops 置顶的id数组
 * @returns
 */
export async function apiGetArts(
  ps: Number = 20,
  pn: Number = 1,
  cid: Number = 0,
  tops: Number[] = []
) {
  const topsStr = tops.length > 0 ? tops.join(',') : ''
  return new Promise<{ data: ArticleData[]; total: number }>((resolve, reject) => {
    http
      .get(`articles?pagesize=${ps}&pagenum=${pn}&cid=${cid}&tops=${topsStr}`)
      .then((res) => {
        if (res.data.status === 200) {
          resolve({ data: res.data.data, total: res.data.total })
        } else {
          reject(res.data.message)
        }
      })
      .catch(() => {
        reject(`网络错误`)
      })
  })
}

/**
 * 上传文章
 * @param data 文章内容
 * @returns {Promise<boolean>}
 */
export async function apiPostArt(data: PostArticleData): Promise<boolean> {
  const html_content = md2html(data.content)
  return new Promise<boolean>((resolve, reject) => {
    http
      .post('articles', {
        id: 0,
        cid: data.cid,
        title: data.title,
        content: data.content,
        html_content: html_content,
        desc: data.desc || genDesc(html_content)
      })
      .then((res) => {
        if (res.data.status === 200) {
          resolve(true)
        } else {
          reject(res.data.message)
        }
      })
      .catch((e) => {
        reject('网络错误' + e)
      })
  })
}

/**
 * 修改文章
 * @param data 文章内容
 * @returns
 */
export async function apiPutArt(id: number, data: PostArticleData) {
  const html_content = md2html(data.content)
  return new Promise<boolean>((resolve, reject) => {
    http
      .put(`articles/${id}`, {
        id: 0,
        cid: data.cid,
        title: data.title,
        content: data.content,
        html_content: html_content,
        desc: data.desc || genDesc(html_content)
      })
      .then((res) => {
        if (res.data.status === 200) {
          resolve(true)
        } else {
          reject(res.data.message)
        }
      })
      .catch((e) => {
        reject('网络错误' + e)
      })
  })
}

/**
 * 删除文章
 * @param id 文章id
 * @returns
 */
export async function apiDeleteArt(id: number) {
  return new Promise<boolean>((resolve, reject) => {
    http
      .delete(`articles/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          resolve(true)
        } else {
          reject(res.data.message)
        }
      })
      .catch(() => {
        reject('网络错误')
      })
  })
}

/**
 * 更新文章某个字段，不会引起updated_at时间的更新
 * @param id 文章id
 * @param data 要更新的内容
 * @returns
 */
export async function apiPatchArt(
  id: number,
  data: {
    title?: string
    html_content?: string
    text_count?: number
    sees?: number
    desc?: string
    cid?: number
  }
) {
  return new Promise<boolean>((resolve, reject) => {
    http
      .patch(`articles/${id}`, data)
      .then((res) => {
        if (res.data.status === 200) {
          resolve(true)
        } else {
          reject(res.data.message)
        }
      })
      .catch(() => {
        reject('网络错误')
      })
  })
}
