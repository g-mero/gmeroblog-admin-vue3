<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title?: string
  data: {
    success: number
    error: number
    total: number
  }
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const finished = () => {
  return props.data.success + props.data.error === props.data.total
}

const status = () => {
  const { success, error, total } = props.data

  if (success === total) return 'success'
  if (error === total) return 'exception'
  if (success + error === total) return 'warning'
  return ''
}
</script>

<template>
  <div>
    <el-dialog
      :model-value="modelValue"
      :title="title || '加载中...'"
      width="30%"
      :show-close="finished()"
      :close-on-click-modal="finished()"
      :close-on-press-escape="finished()"
      @close="$emit('update:modelValue', false)"
      append-to-body
    >
      <div class="content-center">
        <el-progress
          type="circle"
          :percentage="Math.floor(((data.success + data.error) / data.total) * 100)"
          :status="status()"
        />
        <slot name="bottom">{{
          `成功: ${data.success} 失败: ${data.error} 待完成: ${
            data.total - data.success - data.error
          }`
        }}</slot>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.content-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
