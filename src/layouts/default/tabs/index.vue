<template>
  <div class="multiple-tab">
    <el-tabs v-model="activeKeyRef" type="card" @edit="onTabEdit" @tab-click="onTabClick">
      <template v-for="item in getTabsState" :key="item.query ? item.fullPath : item.path">
        <el-tab-pane :closable="!(item && item.meta && item.meta.affix)" :name="item.path" :label="item.meta.title" />
      </template>
    </el-tabs>
  </div>
</template>

<script lang="ts">
  import type { RouteLocationNormalized, RouteMeta } from 'vue-router';
  import { defineComponent, ref, unref, computed } from 'vue';

  import { useGo } from '@/hooks/web/usePage';

  import { useMultipleTabStore } from '@/store/modules/multipleTab';
  import { useUserStore } from '@/store/modules/user';

  import { initAffixTabs, useTabsDrag } from './useMultipleTabs';

  import { REDIRECT_NAME } from '@/router/constant';
  import { listenerRouteChange } from '@/logics/mitt/routeChange';

  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'MultipleTabs',
    setup() {
      const affixTextList = initAffixTabs();
      const activeKeyRef = ref('');

      useTabsDrag(affixTextList);

      const tabStore = useMultipleTabStore();
      const userStore = useUserStore();
      const router = useRouter();

      const go = useGo();

      const getTabsState = computed(() => tabStore.getTabList);

      listenerRouteChange((route) => {
        activeKeyRef.value = route.path;
        const { name } = route;
        if (name === REDIRECT_NAME || !route || !userStore.getToken) {
          return;
        }

        const { meta = {} } = route;
        const { currentActiveMenu, hideTab } = meta as RouteMeta;
        const isHide = !hideTab ? null : currentActiveMenu;

        if (isHide) {
          const findParentRoute = router.getRoutes().find((item) => item.path === currentActiveMenu);

          findParentRoute && tabStore.addTab(findParentRoute as unknown as RouteLocationNormalized);
        } else {
          tabStore.addTab(unref(route));
        }
      });

      const unClose = computed(() => unref(getTabsState).length === 1);
      function onTabEdit(targetName: string) {
        if (unref(unClose)) {
          return;
        }

        tabStore.closeTabByKey(targetName, router);
      }

      function onTabClick() {
        go(unref(activeKeyRef), false);
      }

      return {
        activeKeyRef,
        getTabsState,
        onTabEdit,
        onTabClick,
      };
    },
  });
</script>

<style lang="scss">
  @import './index.scss';
</style>
