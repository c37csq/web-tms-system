<template>
  <div class="layout-content" v-loading="getOpenPageLoading && getPageLoading">
    <PageLayout />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import PageLayout from '/@/layouts/page/index.vue';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useTransitionSetting } from '@/hooks/setting/useTransitionSetting';
  import { useContentViewHeight } from './useContentViewHeight';

  export default defineComponent({
    name: 'LayoutContent',
    components: { PageLayout },
    setup() {
      const { getOpenPageLoading } = useTransitionSetting();
      const { getPageLoading } = useRootSetting();

      useContentViewHeight();
      return {
        getOpenPageLoading,
        getPageLoading,
      };
    },
  });
</script>
