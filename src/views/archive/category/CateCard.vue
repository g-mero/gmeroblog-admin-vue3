<script setup lang="ts">
import type { PostCateData } from '@/api/categories'
import GmIcon from '@/components/Icon/GmIcon.vue'
import messageBox from '@/utils/messageBox'

const props = defineProps<{
  title: string
  items: PostCateData[]
  onEditCate: (cate: PostCateData) => void
  onDelCate: (cate: PostCateData) => void
}>()

const onDelClick = (cate: PostCateData) => {
  messageBox.confirm(`你确定要删除分类 ${cate.name} 吗？这是不可逆的`, (confirm) => {
    if (confirm) {
      props.onDelCate(cate)
    }
  })
}
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>{{ props.title }}</span>
        <div>
          <slot name="operate"></slot>
        </div>
      </div>
    </template>
    <div v-for="item in props.items" :key="item.slug" class="item">
      <div>
        {{ item.name }} <el-tag round size="small" effect="dark">{{ item.total }}</el-tag>
      </div>
      <div>
        <el-popover placement="bottom" trigger="hover">
          <template #reference>
            <el-button text><gm-icon icon="solar:menu-dots-linear" /></el-button>
          </template>
          <div class="cate-operate">
            <el-button text @click="onEditCate(item)"
              ><gm-icon icon="solar:settings-linear" />编辑</el-button
            >
            <el-button type="danger" text @click="onDelClick(item)" :disabled="item.id === 1"
              ><gm-icon icon="solar:trash-bin-2-linear" />删除</el-button
            >
          </div>
        </el-popover>
      </div>
    </div>
    <div v-if="props.items.length == 0" class="item">该分组下没有分类</div>
  </el-card>
</template>

<style scoped lang="scss">
.box-card {
  margin-bottom: 1rem;

  --el-card-padding: 0;

  .card-header {
    padding: 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: var(--el-border-color-lighter);
  }

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }

  .item:not(:last-child) {
    border-bottom: 1px solid var(--el-card-border-color);
  }
}

.cate-operate {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .el-button {
    margin: 0;
    width: 100%;
  }
}
</style>
