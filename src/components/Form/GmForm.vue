<script setup lang="ts">
import type { SettingItem } from './gmForm'

const props = defineProps<{
  items: SettingItem[]
}>()

defineEmits<{
  (event: 'change', item: SettingItem): void
}>()
</script>

<template>
  <el-form label-position="top">
    <el-form-item v-for="item in props.items" :key="item.name" :label="item.label">
      <ElInput
        v-if="item.type === 'text'"
        v-model="item.value"
        @update:model-value="$emit('change', item)"
      />
      <ElInput
        v-else-if="item.type === 'textarea'"
        v-model="item.value"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 10 }"
        @update:model-value="$emit('change', item)"
      />
      <ElSelect
        v-else-if="item.options && item.type === 'select'"
        v-model="item.value"
        @update:model-value="$emit('change', item)"
      >
        <ElOption
          v-for="opt in item.options"
          :key="opt.value"
          :value="opt.value"
          :label="opt.label"
        />
      </ElSelect>
      <ElSwitch
        v-else-if="item.type === 'switch'"
        active-value="1"
        inactive-value="0"
        v-model="item.value"
        @update:model-value="$emit('change', item)"
      />
      <div v-else><ElText size="small" type="danger">无法识别的配置项</ElText></div>

      <ElText size="small">{{ item.desc }}</ElText>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
