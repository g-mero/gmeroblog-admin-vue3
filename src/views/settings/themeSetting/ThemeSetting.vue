<script setup lang="ts">
import { apiGetThemeSettings, apiPutThemeSettings } from '@/api/settings'
import type { SettingsGroup } from '@/components/Setting/gmSetting'
import { ref } from 'vue'
import GmSetting from '@/components/Setting/GmSetting.vue'
import AppMain from '@/layout/appMain/AppMain.vue'
import notice from '@/utils/notice'
import {
  SettingsGroupToSetDateGroup,
  type SetDataGroup,
  SettingItemsToApiPostSetDataContent
} from '../baseSetting/baseSets'
import messageBox from '@/utils/messageBox'

const sets = ref<SettingsGroup[]>([])

// 保存初始数据
let initSets: SetDataGroup[] = []

apiGetThemeSettings()
  .then((res) => {
    sets.value = res
    initSets = SettingsGroupToSetDateGroup(res)
  })
  .catch((e) => {
    notice.error(`获取主题设置项失败: ${e}`)
  })

const changes = ref<SettingsGroup[]>([])

const updateChanges = (setGroup: SettingsGroup) => {
  let isExist = false
  changes.value.forEach((v, i) => {
    if (setGroup === v) {
      isExist = true
      if (isInitSet(setGroup)) {
        changes.value.splice(i, 1)
      }
    }
  })
  if (!isExist) changes.value.push(setGroup)
}

const isInitSet = (setGroup: SettingsGroup) => {
  let result = false
  for (let i = 0; i < initSets.length; i += 1) {
    const set = initSets[i]

    if (set.id === setGroup.id) {
      let tmp = true
      for (let index = 0; index < set.content.length; index++) {
        const item = set.content[index]
        if (item.value !== setGroup.content[index].value) {
          tmp = false
          break
        }
      }
      result = tmp
      break
    }
  }

  return result
}

const onSaveSet = (setGroup: SettingsGroup) => {
  updateChanges(setGroup)
}

const handelSave = () => {
  let saveSets = changes.value

  let tmp: string[] = []

  saveSets.forEach((v) => {
    tmp.push(v.label)
  })

  messageBox.confirm(`你修改了设置项 ${tmp} ,确定保存吗？`, (confirm) => {
    let success = 0
    let error = 0
    let total = saveSets.length
    if (confirm) {
      saveSets.forEach((v) => {
        apiPutThemeSettings({
          id: v.id,
          name: v.name,
          content: SettingItemsToApiPostSetDataContent(v.content)
        })
          .then(() => {
            success += 1
          })
          .catch(() => {
            error += 1
          })
          .finally(() => {
            if (success === total) {
              notice.success(`主题设置修改成功： ${tmp}`)
            } else if (success + error === total) {
              notice.error(`设置项修改出现错误：成功${success},失败${error}`)
            }
          })
      })
    }
  })
}
</script>

<template>
  <AppMain>
    <template #header>
      <ElButton @click="handelSave" :disabled="changes.length === 0">保存</ElButton>
    </template>
    <GmSetting :sets="sets" @change="onSaveSet"></GmSetting>
  </AppMain>
</template>

<style scoped></style>
