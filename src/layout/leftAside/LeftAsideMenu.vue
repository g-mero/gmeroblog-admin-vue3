<script setup lang="ts">
import GmMenu from '@/components/Menu/GmMenu.vue'
import type { MenuItem } from '@/components/Menu/menuItem'
import { routeMenus } from '@/router'
import { ref } from 'vue'

const width = ref('min(250px , 25%)')

const items = ref<MenuItem[]>([])

items.value = routeMenus
</script>

<template>
  <ElAside :width="width" class="left-aside">
    <ElScrollbar max-height="100vh">
      <div class="head">管理</div>
      <el-divider />
      <GmMenu :items="items"> </GmMenu>
    </ElScrollbar>
  </ElAside>
</template>

<style scoped lang="scss">
.left-aside {
  user-select: none;
  background-color: var(--el-bg-color);
  z-index: 9;

  height: 100vh;

  box-shadow: 0.6px 0px 2px rgba(0, 0, 0, 0.04), 5px 0px 16px rgba(0, 0, 0, 0.08);

  --el-menu-item-height: 3rem;
}

.head {
  text-align: center;
  font-size: 2rem;
  padding: 1rem;
  padding-bottom: 0;
}
</style>
