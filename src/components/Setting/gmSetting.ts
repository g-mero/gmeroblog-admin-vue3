import type { SettingItem } from '../Form/gmForm'

export interface SettingsGroup {
  id: number
  name: string
  label: string
  content: SettingItem[]
}
