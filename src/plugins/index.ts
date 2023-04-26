import { apiGetSettings } from '@/api/settings'

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
    res.forEach((v) => {
      if (v.name === 'plugins_enable') {
        Object.keys(v.content).forEach((key) => {
          plugins.forEach((plug) => {
            if (plug.name === key) {
              plug.enabled = v.content[key] === '1'
            }
          })
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
