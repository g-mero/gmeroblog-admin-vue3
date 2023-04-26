<script setup lang="ts">
defineProps<{
  loading?: boolean
  currentPage: number
  pageCount: number
  data: any[]
  onSelectionChange: (...payload: any[]) => void
}>()

defineEmits<{
  (event: 'update:currentPage', value: number): void
}>()
</script>

<template>
  <div class="data-table-wrapper">
    <el-table
      :data="data"
      max-height="85vh"
      style="width: 100%"
      @selection-change="onSelectionChange"
      v-loading="loading"
      class-name="data-table"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column align="left">
        <template #header>
          <slot name="header-left">test-left</slot>
        </template>
        <template #default="scope">
          <slot name="cell-left" :row="scope.row">test-left</slot>
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template #header>
          <slot name="header-right">test</slot>
        </template>
        <template #default="scope">
          <slot name="cell-right" :row="scope.row">test</slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      @current-change="(value) => $emit('update:currentPage', value)"
      :page-count="pageCount"
      hide-on-single-page
    />
  </div>
</template>

<style scoped>
.data-table {
  --el-table-header-bg-color: var(--el-border-color-lighter);
}

.data-table-wrapper {
  border: 1px solid var(--el-border-color-light);
}
</style>
