<script setup lang="ts">
import { MdEditor } from '@/components/MdEditor'
import AppMain from '@/layout/appMain/AppMain.vue'
import { ref } from 'vue'

import { apiPostArt } from '@/api/articles'
import message from '@/utils/message'

import { ruleTitle } from '@/utils/validateRules'
import { ruleJson } from '@/utils/validateRules'
import type { FormInstance } from 'element-plus'
import router from '@/router'
import { cateStore } from '@/stores/cate'

const value = ref('')

const loading = ref(false)

const onPostArt = async (formEl: FormInstance | undefined) => {
  loading.value = true

  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      apiPostArt({
        cid: artSetsForm.value.cid,
        title: artSetsForm.value.title,
        content: value.value,
        desc: artSetsForm.value.desc
      })
        .then((res) => {
          if (res) {
            message.success('上传成功')
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
  <AppMain>
    <template #header
      ><ElButton type="primary" plain size="large" @click="dialogVisible = true"
        >发布</ElButton
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
                v-for="cate in cateStore.cates"
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
            <el-button type="primary" @click="onPostArt(ruleFormRef)" :loading="loading">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </AppMain>
</template>

<style scoped></style>
