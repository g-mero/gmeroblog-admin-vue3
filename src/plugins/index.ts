interface PluginItem {
  name: string
  action: { [key: string]: () => void }
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

export function initPlugins() {
  const plugins = getPliginsFromFiles(pluginFiles) as PluginItem[]

  plugins.forEach((p) => {
    Object.keys(p.action).forEach((v) => {
      p.action[v]()
    })
  })
}
