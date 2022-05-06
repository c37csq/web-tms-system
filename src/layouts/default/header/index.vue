<template>
  <header class="layout-header">
    <header-top />
    <div class="layout-header-content">
      <app-logo />

      <navbar-item v-for="route in permissionRoutes" :key="route.path" :item="route" />
    </div>
  </header>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import HeaderTop from '../header-top/index.vue';
  import { AppLogo, NavbarItem } from './components';
  import { usePermissionStore } from '@/store/modules/permission';

  export default defineComponent({
    name: 'LayoutHeader',
    components: { HeaderTop, AppLogo, NavbarItem },
    setup() {
      const permissionStore = usePermissionStore();

      return {
        permissionRoutes: permissionStore.getBackMenuList,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .layout-header-content {
    height: 60px;
    background-color: #192232;
    color: #fff;
    flex: 0 0 60px;
    display: flex;
    align-items: center;
    padding: 0 40px;
  }
</style>
