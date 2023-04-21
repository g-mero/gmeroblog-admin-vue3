import { apiGetCates, apiGetCateTree, type CateTree, type PostCateData } from '@/api/categories'
import { ref } from 'vue'
import type { SettingItem } from '@/components/Form/gmForm'

const categories = ref<PostCateData[]>([])

const cateTree = ref<CateTree[]>([])

const groupIDs: { label: string; value: string }[] = [{ label: '不分组', value: '0' }]

export async function reloadCates() {
  categories.value = await apiGetCates()
  cateTree.value = await apiGetCateTree()
  groupIDs.splice(1)
  cateTree.value.forEach((v) => {
    if (v.role === 1) {
      const tmp = {
        label: v.name,
        value: v.id.toString()
      }

      groupIDs.push(tmp)
    }
  })
}

reloadCates()

export function getDefaultCateSettings(groupID = 0) {
  const cateSettings: SettingItem[] = [
    {
      name: 'name',
      label: '名称',
      type: 'text',
      value: ''
    },
    {
      name: 'group_id',
      label: '分组',
      type: 'select',
      value: `${groupID}`,
      options: groupIDs
    },
    {
      name: 'slug',
      label: '唯一标识',
      type: 'text',
      value: ''
    },
    {
      name: 'desc',
      label: '描述',
      type: 'text',
      value: ''
    },
    {
      name: 'cover_img',
      label: '图片',
      type: 'text',
      value: ''
    }
  ]

  return cateSettings
}

export function getDefaultGroupSettings() {
  const groupSettings: SettingItem[] = [
    {
      name: 'name',
      label: '名称',
      type: 'text',
      value: ''
    },
    {
      name: 'slug',
      label: '唯一标识',
      type: 'text',
      value: ''
    }
  ]

  return groupSettings
}

export { categories, cateTree }
