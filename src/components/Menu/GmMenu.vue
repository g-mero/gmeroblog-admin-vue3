<script setup lang="ts">
import { currentRouteName } from '@/router'
import type {MenuItem} from './menuItem'

const props = defineProps<{
  items: MenuItem[]
}>()
</script>

<template>
  <ElMenu class="menu" router :default-active="currentRouteName?.toString()">
    <template v-for="(item, index) in props.items">
      <template v-if="item.children">
        <ElMenuItemGroup :title="item.title" :key="index">
          <ElMenuItem
            v-for="(child, childIndex) in item.children"
            :key="index + '-' + childIndex"
            :index="child.to"
            :route="{ name: child.to }"
          >
            <GmIcon :icon="child.icon || 'solar:add-circle-outline'"></GmIcon> {{ child.title }}
          </ElMenuItem>
        </ElMenuItemGroup>
      </template>
      <template v-else>
        <ElMenuItem :key="index" :index="item.to" :route="{ name: item.to }">
          <GmIcon :icon="item.icon || 'solar:add-circle-outline'"></GmIcon>{{ item.title }}
        </ElMenuItem>
      </template>
    </template>
  </ElMenu>
</template>

<style scoped>
.link {
  text-decoration: none;
  color: inherit;
}

.menu {
  border: none;
}

.el-menu-item.is-active {
  background-color: rgba(0, 0, 0, 0.1);
  color: inherit;
}

.el-menu-item {
  margin: 0.3rem;
  border-radius: 0.5rem;
}
</style>
