<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps<{
  icon: string
  size?: string
}>()
</script>

<template>
  <ElIcon :size="size">
    <Icon :icon="props.icon" class="icon"></Icon>
  </ElIcon>
</template>

<style scoped>
.icon {
  user-select: none;
  pointer-events: none;
}
</style>
