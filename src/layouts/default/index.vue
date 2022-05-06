<template>
  <div class="layout">
    <LayoutHeader />

    <div class="layout-body">
      <MultipleTabs />

      <el-scrollbar
        class="page-scrollbar"
        view-class="page-wrapper"
        :class="{ 'page-scrollbar-home': route.name === 'AdminHome' }"
      >
        <LayoutContent />
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useRoute } from 'vue-router';

  import LayoutHeader from './header/index.vue';
  import LayoutContent from './content/index.vue';
  import MultipleTabs from './tabs/index.vue';

  export default defineComponent({
    name: 'DefaultLayout',
    components: { LayoutHeader, LayoutContent, MultipleTabs },
    setup() {
      const route = useRoute();

      return {
        route,
      };
    },
  });
</script>

<style lang="scss">
  .layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    background-color: #f1f5f7;

    &-header {
      height: 90px;
    }

    &-body {
      flex: 0 0 calc(100vh - 90px - 32px);
      margin: 16px;
      overflow: hidden;
    }

    .page-scrollbar {
      height: calc(100vh - 90px - 32px - 56px);
      background-color: #fff;
      margin-top: 16px;
      border-radius: 12px;
      padding: 16px;

      &-home {
        padding: 0;
        background: #f1f5f7;
      }
    }
  }
</style>
