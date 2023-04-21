<script setup lang="ts">
import { MdEditor } from '@/components/MdEditor'
import AppMain from '@/layout/appMain/AppMain.vue'
import { ref } from 'vue'

import { apiGetArt, apiPutArt } from '@/api/articles'
import message from '@/utils/message'

import { categories } from '@/views/archive/category/category'
import { ruleTitle } from '@/utils/validateRules'
import { ruleJson } from '@/utils/validateRules'
import type { FormInstance } from 'element-plus'
import router from '@/router'
import notice from '@/utils/notice'

const value = ref('')

const loading = ref(false)

const id = Number(router.currentRoute.value.params.id)

const getArt = () => {
  loading.value = true
  apiGetArt(id)
    .then((res) => {
      value.value = res.content
      artSetsForm.value.cid = res.cid
      artSetsForm.value.desc = res.desc
      artSetsForm.value.title = res.title
      loading.value = false
    })
    .catch((e) => {
      notice.error(`读取id为${id}的文章失败：${e}`)
      router.push({ name: 'all-arts' })
    })
}

getArt()

const onPutArt = async (formEl: FormInstance | undefined) => {
  loading.value = true

  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      apiPutArt(id, {
        cid: artSetsForm.value.cid,
        title: artSetsForm.value.title,
        content: value.value,
        desc: artSetsForm.value.desc
      })
        .then((res) => {
          if (res) {
            message.success('更新成功')
            router.push({ name: 'all-arts' })
          }
        })
        .catch((e) => {
          message.error(e)
        })
        .finally(() => {
          loading.value = false
          dialogVisible.value = false
        })
    } else {
      loading.value = false
      return fields
    }
  })
}

const onChange = () => {
  console.log(value.value)
}

const artSetsForm = ref({
  title: '',
  cid: 1,
  desc: '',
  extra: ''
})

const rules = {
  title: ruleTitle,
  extra: ruleJson
}
const ruleFormRef = ref<FormInstance>()

const dialogVisible = ref(false)
</script>

<template>
  <AppMain v-loading="true">
    <template #header
      ><ElButton type="primary" plain size="large" @click="dialogVisible = true"
        >更新</ElButton
      ></template
    >
    <div>
      <MdEditor height="600px" v-model="value" theme="light" @change="onChange"></MdEditor>
      <el-dialog v-model="dialogVisible" title="发布文章" width="30%">
        <ElForm :model="artSetsForm" label-width="auto" :rules="rules" ref="ruleFormRef">
          <ElFormItem label="标题" prop="title" required>
            <ElInput v-model="artSetsForm.title" />
          </ElFormItem>
          <ElFormItem label="分类" required>
            <ElSelect v-model="artSetsForm.cid">
              <ElOption
                v-for="cate in categories"
                :value="cate.id"
                :label="cate.name"
                :key="cate.id"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="描述">
            <ElInput v-model="artSetsForm.desc" />
          </ElFormItem>
          <ElFormItem label="额外数据" prop="extra">
            <ElInput v-model="artSetsForm.extra" />
          </ElFormItem>
        </ElForm>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="onPutArt(ruleFormRef)" :loading="loading">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </AppMain>
</template>

<style scoped></style>
