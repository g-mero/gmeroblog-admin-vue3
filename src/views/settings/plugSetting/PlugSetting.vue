<script setup lang="ts">
import AppMain from '@/layout/appMain/AppMain.vue'
import DataShowTable from '@/components/DataShowTable/DataShowTable.vue'
import { plugins } from '@/plugins'
import { ref } from 'vue'
import { apiPutSettings } from '@/api/settings'
import notice from '@/utils/notice'

const data = plugins

let apiData = ref<{ [key: string]: string }>({})

data.forEach((v) => {
  apiData.value[v.name] = v.enabled ? '1' : '0'
})

const currentPage = ref(1)

const pageSize = 10

const onSelectionChange = () => {}

const onSave = () => {
  apiPutSettings({ id: 9, name: 'plugins_enable', content: apiData.value })
    .then((res) => {
      if (res) {
        notice.success('保存成功')
        window.location.reload()
      }
    })
    .catch((e) => {
      notice.error(`保存失败：${e}`)
    })
}
</script>

<template>
  <AppMain>
    <template #header>
      <el-button type="primary" @click="onSave">保存</el-button>
    </template>
    <DataShowTable
      :data="data"
      :current-page="currentPage"
      :page-count="Math.ceil(data.length / pageSize)"
      :on-selection-change="onSelectionChange"
    >
      <template #header-left>插件名</template>
      <template #header-right>开启状态</template>
      <template #cell-left="scope">
        <el-text truncated>{{ scope.row.name }}</el-text>
      </template>
      <template #cell-right="scope">
        <el-switch v-model="apiData[scope.row.name]" :active-value="'1'" :inactive-value="'0'" />
      </template>
    </DataShowTable>
  </AppMain>
</template>

<style scoped></style>
