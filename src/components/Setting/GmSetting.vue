<script setup lang="ts">
import GmForm from '../Form/GmForm.vue'
import type { SettingsGroup } from './gmSetting'

defineProps<{
  sets: SettingsGroup[]
}>()

defineEmits<{
  (event: 'change', item: SettingsGroup): void
}>()
</script>

<template>
  <div class="card">
    <GmForm
      v-if="sets.length == 1"
      :items="sets[0].content"
      @change="$emit('change', sets[0])"
    ></GmForm>
    <ElTabs v-else>
      <ElTabPane v-for="set in sets" :key="set.id" :label="set.label">
        <GmForm :items="set.content" @change="$emit('change', set)"></GmForm>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style scoped></style>
