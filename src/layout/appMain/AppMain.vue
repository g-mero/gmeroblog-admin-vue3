<script setup lang="ts">
import GmIcon from '@/components/Icon/GmIcon.vue'
import { currentRouteName, noMenuRouteMenus, routeMenus } from '@/router'
import { MenuItemsToMenuItemsWithTo } from '@/utils/routes'
import { findMenuItemByName } from '@/utils/routes'
import { GlobalLoading } from '@/router'

const menuItem = findMenuItemByName(
  currentRouteName.value,
  MenuItemsToMenuItemsWithTo(routeMenus).concat(MenuItemsToMenuItemsWithTo(noMenuRouteMenus))
)

if (menuItem) {
  document.title = menuItem.title + '--博客后台'
}
</script>

<template>
  <el-header class="header">
    <div class="header-main">
      <div class="header-title">
        <template v-if="menuItem"><GmIcon :icon="menuItem.icon" /> {{ menuItem.title }}</template>
        <template v-else>Admin</template>
      </div>

      <div><slot name="header"></slot></div>
    </div>
    <div class="gloab-loading">
      <el-progress
        v-if="GlobalLoading"
        :percentage="100"
        indeterminate
        :show-text="false"
        :duration="2"
      />
    </div>
  </el-header>
  <el-main><slot></slot></el-main>
</template>

<style lang="scss" scoped>
.header {
  padding: 0;
  .header-main {
    box-shadow: 0 2px 4px #00000014;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 20px;

    background-color: var(--el-bg-color);
  }

  .header-title {
    font-size: 1.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
