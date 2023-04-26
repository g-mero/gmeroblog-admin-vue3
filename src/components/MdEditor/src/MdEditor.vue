<script lang="ts" setup>
import { Editor } from 'solidjs-md-editor'
import { onMounted } from 'vue'

import 'solidjs-md-editor/dist/style.css'
import { ref } from 'vue'
import { watch } from 'vue'
import { mdPreview } from '@/utils/article'

const target = ref<HTMLElement>()

const props = defineProps<{
  height: string
  theme: 'light' | 'dark'
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'change', value: string): void
  (e: 'update:modelValue', value: string): void
}>()

onMounted(() => {
  if (!target.value) return
  const editor = Editor({
    target: target.value,
    onChange: (v) => {
      emit('update:modelValue', v)
      emit('change', v)
    },
    handelPreview(v) {
      return mdPreview(v)
    },
    height: props.height,
    theme: props.theme
  })
  if (!editor) return
  watch(
    () => props.modelValue,
    (str) => {
      editor.setVal(str)
    },
    {
      immediate: true
    }
  )

  watch(
    () => props.theme,
    () => {
      editor.setTheme(props.theme)
    }
  )
})
</script>

<template>
  <div ref="target" />
</template>
