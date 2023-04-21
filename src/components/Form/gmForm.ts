export interface SettingItem {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'switch'
  value: string
  options?: {
    label: string
    value: string
  }[]
  placeholder?: string
  desc?: string
}

export function getValueFromSettings(name: string, settings: SettingItem[]) {
  for (let i = 0; i < settings.length; i++) {
    const set = settings[i]

    if (set.name === name) {
      return set.value
    }
  }

  return ''
}
