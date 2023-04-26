import { apiGetSettings, apiPostPluginSettings } from '@/api/settings'
import { useUserStore } from '@/stores/user'

export interface PluginItem {
  name: string
  init: () => void
  enabled: boolean
}

const pluginFiles: Record<string, any> = import.meta.glob(['./modules/*/index.ts'], {
  eager: true
})

function getPliginsFromFiles(records: Record<string, any>) {
  const result: any[] = []
  Object.keys(records).forEach((key) => {
    result.push(records[key].default)
  })
  return result
}

export const plugins = getPliginsFromFiles(pluginFiles) as PluginItem[]

async function reSetPlugins() {
  await apiGetSettings('plugins').then((res) => {
    plugins.forEach((plug) => {
      let isExist = false
      if (res) {
        res.forEach((v) => {
          if (v.name === plug.name) {
            isExist = true
            Object.keys(v.content).forEach((key) => {
              if (key === 'enabled') {
                plug.enabled = v.content[key] === '1'
              }
            })
          }
        })
      }

      if (!isExist && useUserStore().check()) {
        apiPostPluginSettings({
          name: plug.name,
          id: 0,
          content: { enabled: plug.enabled ? '1' : '0' }
        })
      }
    })
  })
}

export async function initPlugins() {
  await reSetPlugins()
  plugins.forEach((p) => {
    if (p.enabled) p.init()
  })
}
