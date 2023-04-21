<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores/user'
import message from '@/utils/message'
import notice from '@/utils/notice'
import { rulePassword } from '@/utils/validateRules'
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

const ruleFormRef = ref<FormInstance>()
const loading = ref(false)

const form = ref({
  username: '',
  password: ''
})

let fallback = ''

const from = router.currentRoute.value.query.from

if (typeof from === 'string') {
  notice.info('登录信息过期，需要重新登录')
  fallback = from
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  loading.value = true
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      useUserStore()
        .login(form.value)
        .then(() => {
          message.success('登录成功')
          if (fallback) {
            router.push({ name: fallback })
          } else {
            router.push({ name: 'home' })
          }
        })
        .catch((reason) => {
          loading.value = false
          message.error(reason)
        })
    } else {
      loading.value = false
      return fields
    }
  })
}

const loginRules = {
  password: rulePassword
}
</script>

<template>
  <ElContainer class="warpper">
    <el-form :model="form" class="glass-container" ref="ruleFormRef" :rules="loginRules">
      <ElFormItem label="账号"><ElInput v-model="form.username" /></ElFormItem>
      <ElFormItem label="密码" prop="password"
        ><ElInput v-model="form.password" type="password"
      /></ElFormItem>
      <ElFormItem>
        <el-button :loading="loading" type="primary" @click="onSubmit(ruleFormRef)">登录</el-button>
      </ElFormItem>
    </el-form>
  </ElContainer>
</template>

<style scoped>
.warpper {
  height: 100%;
  background-image: linear-gradient(120deg, #fccb90 0%, #d57eeb 100%);
  align-items: center;
  justify-content: center;
}

.glass-container {
  padding: 2rem;
  padding-top: 4rem;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  border-radius: 22px;
  backdrop-filter: blur(6px);
  background-color: rgba(0, 191, 255, 0.1);
  box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
}
</style>
