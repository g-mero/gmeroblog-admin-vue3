import type { ApiSetinngData } from '@/api/settings'
import type { SettingItem } from '@/components/Form/gmForm'
import type { SettingsGroup } from '@/components/Setting/gmSetting'

export interface SetDataGroup {
  id: number
  content: {
    name: string
    value: string
  }[]
}

export function SettingsGroupToSetDateGroup(setGroups: SettingsGroup[]) {
  const result: SetDataGroup[] = []
  setGroups.forEach((v) => {
    const group: SetDataGroup = {
      id: v.id,
      content: []
    }

    v.content.forEach((item) => {
      const temp = {
        name: item.name,
        value: item.value
      }
      group.content.push(temp)
    })

    result.push(group)
  })

  return result
}

export function SettingItemsToApiPostSetDataContent(setItems: SettingItem[]) {
  const result: { [key: string]: string } = {}

  setItems.forEach((item) => {
    result[item.name] = item.value
  })

  return result
}

export function getBaseSets() {
  const baseSet: SettingItem[] = [
    { name: 'site_name', label: '站点名称', value: '', type: 'text' },
    { name: 'site_url', label: '站点地址', value: '', type: 'text' },
    { name: 'site_logo', label: '站点Logo', value: '', type: 'text' }
  ]

  const seoSet: SettingItem[] = [
    { name: 'seo_keywords', label: '站点关键词', value: '', type: 'text' },
    { name: 'seo_desc', label: '站点介绍', value: '', type: 'textarea' }
  ]

  const adminSet: SettingItem[] = [
    { name: 'admin_path', label: '管理后台地址', value: '', type: 'text' },
    { name: 'admin_github_id', label: '管理员githubID', value: '', type: 'text' },
    {
      name: 'admin_github_client_id',
      label: 'githubClientID',
      value: '',
      type: 'text'
    },
    {
      name: 'admin_github_client_secret',
      label: 'githubClientSecret',
      value: '',
      type: 'text'
    }
  ]

  const mailSet: SettingItem[] = [
    { name: 'mail_host', label: 'SMTP地址', value: '', type: 'text' },
    { name: 'mail_port', label: 'SMTP端口', value: '', type: 'text' },
    { name: 'mail_username', label: 'SMTP用户名', value: '', type: 'text' },
    { name: 'mail_password', label: 'SMTP密码', value: '', type: 'text' }
  ]

  const searchSet: SettingItem[] = [
    { name: 'search_app_id', label: 'algolia appID', value: '', type: 'text' },
    { name: 'search_api_key', label: 'algolia apiKey', value: '', type: 'text' },
    { name: 'search_index_name', label: 'algolia 索引库名', value: '', type: 'text' }
  ]

  const BaseSets: SettingsGroup[] = [
    { id: 0, name: 'base_settings', content: baseSet, label: '基本设置' },
    { id: 0, name: 'seo_settings', content: seoSet, label: 'Seo设置' },
    { id: 0, name: 'admin_settings', content: adminSet, label: '管理后台设置' },
    { id: 0, name: 'mail_settings', content: mailSet, label: '邮件系统设置' },
    { id: 0, name: 'search_settings', content: searchSet, label: '搜索引擎设置' }
  ]

  return BaseSets
}

// 从api返回的数据合并
export function AssignApiSetinngDataToSettingGroup(
  setGroups: SettingsGroup[],
  apiSets: ApiSetinngData[]
) {
  apiSets.forEach((apiSet) => {
    setGroups.forEach((set) => {
      if (set.name === apiSet.name) {
        set.id = apiSet.id

        const tmp = apiSet.content

        // 遍历json键值对并assgin
        Object.keys(tmp).forEach((key) => {
          set.content.forEach((item) => {
            if (key === item.name) {
              item.value = tmp[key]
            }
          })
        })
      }
    })
  })
}
