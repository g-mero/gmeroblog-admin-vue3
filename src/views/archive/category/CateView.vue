<script setup lang="ts">
import AppMain from '@/layout/appMain/AppMain.vue'
import { getDefaultCateSettings, getDefaultGroupSettings } from './category'
import { ref, watch } from 'vue'
import { apiDelCate, apiPostCate, type CateTree } from '@/api/categories'
import type { PostCateData } from '@/api/categories'
import CateCard from './CateCard.vue'
import { getValueFromSettings, type SettingItem } from '@/components/Form/gmForm'
import GmForm from '@/components/Form/GmForm.vue'
import notice from '@/utils/notice'
import messageBox from '@/utils/messageBox'
import { apiPutCate } from '@/api/categories'
import { cateStore } from '@/stores/cate'

const cateTreeWithChild = ref<CateTree[]>([])
const cateTreeNoChild = ref<{
  name: string
  children: PostCateData[]
}>({
  name: '未分组',
  children: []
})

watch(
  () => {
    return cateStore.cateTree
  },
  (cateTree) => {
    cateTreeWithChild.value = []
    cateTreeNoChild.value.children = []

    cateTree.forEach((v) => {
      if (v.role === 1) {
        cateTreeWithChild.value.push(v)
      } else {
        cateTreeNoChild.value.children.push(v)
      }
    })
  },
  { immediate: true }
)

const dialogVisible = ref(false)
const loading = ref(false)

const dialog = ref<{
  title: string
  type: 'cate' | 'group'
  method: 'post' | 'put'
  cateID: number
}>({
  title: '',
  type: 'cate',
  method: 'post',
  cateID: 0
})

let currentCateSettings = getDefaultCateSettings()

let currentGroupSettings = getDefaultGroupSettings()

const currentSettings = ref<SettingItem[]>(currentCateSettings)

// 重新设置currentSettings
const resetSets = (groupID = 0) => {
  if (dialog.value.method === 'post') {
    if (dialog.value.type === 'cate') {
      currentCateSettings = getDefaultCateSettings(groupID)
      currentSettings.value = currentCateSettings
    }
    if (dialog.value.type === 'group') {
      currentGroupSettings = getDefaultGroupSettings()
      currentSettings.value = currentGroupSettings
    }
  } else {
    if (dialog.value.type === 'cate') {
      currentSettings.value = currentCateSettings
    }
    if (dialog.value.type === 'group') {
      currentSettings.value = currentGroupSettings
    }
  }
}

const handelPostPutCateGroup = () => {
  loading.value = true
  const currentSets = currentSettings.value
  const getVal = (name: string) => {
    return getValueFromSettings(name, currentSets)
  }
  const data: PostCateData = {
    id: 0,
    name: getVal('name'),
    slug: getVal('slug'),
    desc: getVal('desc'),
    group_id: Number(getVal('group_id')),
    cover_img: getVal('cover_img'),
    total: 0,
    role: 0
  }

  if (dialog.value.type === 'group') data.role = 1

  if (dialog.value.method === 'post') {
    apiPostCate(data)
      .then(() => {
        notice.success(`新增${data.role ? '分组' : '分类'} ${data.name} 成功`)
        dialogVisible.value = false
        cateStore.reload()
      })
      .catch((e) => {
        notice.error(`新增${data.role ? '分组' : '分类'} ${data.name} 失败：${e}`)
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    apiPutCate(dialog.value.cateID, data)
      .then(() => {
        notice.success(`修改${data.role ? '分组' : '分类'} ${data.name} 成功`)
        dialogVisible.value = false
        cateStore.reload()
      })
      .catch((e) => {
        notice.error(`修改${data.role ? '分组' : '分类'} ${data.name} 失败：${e}`)
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const handelPostGroup = () => {
  dialogVisible.value = true
  dialog.value.title = '新增分组'
  dialog.value.method = 'post'
  dialog.value.type = 'group'
  resetSets()
}

const handelPostCate = (groupID = 0) => {
  dialogVisible.value = true
  dialog.value.title = '新增分类'
  dialog.value.method = 'post'
  dialog.value.type = 'cate'
  resetSets(groupID)
}

const handelPutGroup = (group: PostCateData) => {
  dialogVisible.value = true
  dialog.value.title = `编辑分组-${group.name}`
  dialog.value.method = 'put'
  dialog.value.type = 'group'
  dialog.value.cateID = group.id
  const keys = Object.keys(group)
  currentGroupSettings.forEach((v) => {
    if (keys.includes(v.name)) {
      v.value = group[v.name as keyof PostCateData].toString()
    }
  })
  resetSets()
}

const handelPutCate = (cate: PostCateData) => {
  dialogVisible.value = true
  dialog.value.title = `编辑分类-${cate.name}`
  dialog.value.method = 'put'
  dialog.value.type = 'cate'
  dialog.value.cateID = cate.id
  const keys = Object.keys(cate)
  currentCateSettings.forEach((v) => {
    if (keys.includes(v.name)) {
      v.value = cate[v.name as keyof PostCateData].toString()
    }
  })
  resetSets()
}

const handelDelCate = (cate: PostCateData) => {
  apiDelCate(cate.id)
    .then(() => {
      notice.success(`删除分类${cate.name}成功`)
      cateStore.reload()
    })
    .catch((e) => {
      notice.error(e)
    })
}

const handelDelGroup = (group: PostCateData) => {
  messageBox.confirm(`你确定要删除分组 ${group.name} 吗? 这是不可逆的`, (confirm) => {
    if (confirm) {
      apiDelCate(group.id)
        .then(() => {
          notice.success(`删除分组${group.name}成功`)
          cateStore.reload()
        })
        .catch((e) => {
          notice.error(e)
        })
    }
  })
}
</script>

<template>
  <AppMain>
    <template #header>
      <ElButton @click="handelPostGroup">新增分组</ElButton>
    </template>
    <template v-for="group in cateTreeWithChild" :key="group.slug">
      <CateCard
        :on-del-cate="handelDelCate"
        :on-edit-cate="handelPutCate"
        :title="group.name"
        :items="group.children || []"
      >
        <template #operate>
          <el-button type="primary" round size="small" @click="handelPutGroup(group)"
            >修改分组</el-button
          >
          <el-button type="primary" round size="small" @click="handelPostCate(group.id)"
            >添加分类</el-button
          >
          <el-button
            type="danger"
            round
            size="small"
            :disabled="!!group.children"
            @click="handelDelGroup(group)"
            >删除</el-button
          >
        </template>
      </CateCard>
    </template>
    <CateCard
      :on-del-cate="handelDelCate"
      :on-edit-cate="handelPutCate"
      :title="cateTreeNoChild.name"
      :items="cateTreeNoChild.children"
    >
      <template #operate>
        <el-button type="primary" round size="small" @click="handelPostCate()">添加分类</el-button>
      </template>
    </CateCard>

    <el-dialog v-model="dialogVisible" :title="dialog.title" width="30%">
      <GmForm :items="currentSettings" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handelPostPutCateGroup" :loading="loading">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </AppMain>
</template>

<style scoped></style>
