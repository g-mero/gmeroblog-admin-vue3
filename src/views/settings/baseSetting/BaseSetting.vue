<script setup lang="ts">
import { apiGetSettings, apiPutSettings } from '@/api/settings'
import { apiCheckSearch, apiResetSearch } from '@/api/search'

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
import AppMain from '@/layout/appMain/AppMain.vue'
import messageBox from '@/utils/messageBox'
import GmForm from '@/components/Form/GmForm.vue'

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

// 判断是否与初始值相同
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

// 更新初始值
const updateInitSet = (setGroups: SettingsGroup[]) => {
  for (let i = 0; i < initSets.length; i += 1) {
    const set = initSets[i]

    for (let j = 0; j < setGroups.length; j++) {
      const newSet = setGroups[j]

      if (set.id === newSet.id) {
        for (let index = 0; index < newSet.content.length; index++) {
          set.content[index].value = newSet.content[index].value
        }
      }
    }
  }
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
              updateInitSet(saveSets)
              changes.value = []
            } else if (success + error === total) {
              notice.error(`设置项修改出现错误：成功${success},失败${error}`)
            }
          })
      })
    }
  })
}

const checkSearch = () => {
  apiCheckSearch()
    .then(() => {
      notice.success('搜索引擎测试通过')
    })
    .catch((e) => {
      notice.error(`测试失败： ${e}`)
    })
}

const loading = ref(false)

const resetSearch = () => {
  loading.value = true
  apiResetSearch()
    .then(() => {
      notice.success('重置成功')
    })
    .catch((e) => {
      notice.error(`重置失败: ${e}`)
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <AppMain>
    <template #header>
      <ElButton @click="handelSave" :disabled="changes.length === 0">保存</ElButton>
    </template>
    <div class="card">
      <ElTabs>
        <ElTabPane v-for="set in sets" :key="set.id" :label="set.label">
          <GmForm
            :items="set.content"
            @change="
              () => {
                onSaveSet(set)
              }
            "
          ></GmForm>
          <div v-if="set.id === 5">
            <ElButton @click="checkSearch">测试algolia</ElButton>
            <ElButton @click="resetSearch" :loading="loading">重置索引</ElButton>
          </div>
        </ElTabPane>
      </ElTabs>
    </div>
  </AppMain>
</template>

<style scoped></style>
