<script setup lang="ts">
import { apiGetSettings, apiPutSettings } from '@/api/settings'
import type { SettingsGroup } from '@/components/Setting/gmSetting'
import { ref } from 'vue'
import {
  AssignApiSetinngDataToSettingGroup,
  SettingsGroupToSetDateGroup,
  getBaseSets,
  type SetDataGroup,
  SettingItemsToApiPostSetDataContent
} from './baseSets'
import notice from '@/utils/notice'
import GmSetting from '@/components/Setting/GmSetting.vue'
import AppMain from '@/layout/appMain/AppMain.vue'
import messageBox from '@/utils/messageBox'

const sets = ref<SettingsGroup[]>(getBaseSets())

// 初始数据
let initSets: SetDataGroup[] = []

apiGetSettings('base')
  .then((res) => {
    AssignApiSetinngDataToSettingGroup(sets.value, res)
    initSets = SettingsGroupToSetDateGroup(sets.value)
  })
  .catch((e) => {
    notice.error(`获取设置项失败: ${e}`)
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
  console.log(changes.value)
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
        apiPutSettings({
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
              notice.success(`设置修改成功： ${tmp}`)
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
