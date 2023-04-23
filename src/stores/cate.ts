import {
  apiDelCate,
  apiGetCates,
  apiGetCateTree,
  apiPostCate,
  apiPutCate,
  type CateTree,
  type PostCateData
} from '@/api/categories'
import { defineStore } from 'pinia'
import { parse, stringify } from 'zipson/lib'

function postCateDatasToCateMap(postCates: PostCateData[]) {
  const cateMap = new Map<number, PostCateData>()

  postCates.forEach((v) => {
    cateMap.set(v.id, v)
  })

  return cateMap
}

function getGroupsFromCateTree(cateTree: CateTree[]) {
  const groupIDs: { label: string; value: string }[] = [{ label: '不分组', value: '0' }]
  cateTree.forEach((v) => {
    if (v.role === 1) {
      const tmp = {
        label: v.name,
        value: v.id.toString()
      }

      groupIDs.push(tmp)
    }
  })

  return groupIDs
}

export const useCateStore = defineStore('category', {
  state: () => ({
    cates: [] as PostCateData[],
    cateMap: new Map<number, PostCateData>(),
    cateTree: [] as CateTree[],
    groupIDs: [] as { label: string; value: string }[],
    needLoad: true,
    isLoading: false
  }),
  actions: {
    async reload() {
      if (!this.isLoading) {
        this.isLoading = true
        const apiCates = await apiGetCates().catch(() => {
          console.log('分类信息获取失败')
        })
        const cateTree = await apiGetCateTree().catch(() => {
          console.log('分类树获取失败')
        })

        if (apiCates && cateTree) {
          this.cates = apiCates
          this.cateMap = postCateDatasToCateMap(apiCates)
          this.cateTree = cateTree
          this.groupIDs = getGroupsFromCateTree(cateTree)
          this.needLoad = false
          this.isLoading = false
          return true
        } else {
          this.needLoad = true
          this.isLoading = false
          return false
        }
      } else {
        return false
      }
    },
    async delCate(id: number) {
      return apiDelCate(id)
        .then(() => {
          this.reload()
          return true
        })
        .catch((e: string) => {
          return e
        })
    },
    async postCate(data: PostCateData) {
      return apiPostCate(data)
        .then(() => {
          this.reload()
          return true
        })
        .catch((e: string) => {
          return e
        })
    },
    async putCate(id: number, data: PostCateData) {
      return apiPutCate(id, data)
        .then(() => {
          this.reload()
          return true
        })
        .catch((e: string) => {
          return e
        })
    }
  },
  persist: {
    serializer: {
      deserialize: parse,
      serialize: stringify
    },
    storage: sessionStorage,
    paths: ['cates', 'cateTree', 'groupIDs', 'needLoad'],
    afterRestore(context) {
      context.store.$state.cateMap = postCateDatasToCateMap(context.store.$state.cates)
    }
  }
})

export const cateStore = useCateStore()

if (cateStore.needLoad) {
  cateStore.reload()
}
