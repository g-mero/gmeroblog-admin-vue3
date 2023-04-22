import type { SettingItem } from '@/components/Form/gmForm'
import { cateStore } from '@/stores/cate'

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
      options: cateStore.groupIDs
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
