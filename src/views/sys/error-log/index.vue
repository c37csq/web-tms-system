<template>
  <div> error log page </div>
</template>

<script lang="ts" setup>
  import type { ErrorLogInfo } from '#/store';
  import { watch, ref, nextTick } from 'vue';
  import { useErrorLogStore } from '@/store/modules/errorLog';
  import { cloneDeep } from 'lodash-es';

  const rowInfo = ref<ErrorLogInfo>();
  console.log('🚀 ~ file: index.vue ~ line 13 ~ rowInfo', rowInfo);

  const errorLogStore = useErrorLogStore();

  watch(
    () => errorLogStore.getErrorLogInfoList,
    (list) => {
      nextTick(() => {
        console.log('🚀 ~ file: index.vue ~ line 22 ~ nextTick ~ cloneDeep(list)', cloneDeep(list));
      });
    },
    {
      immediate: true,
    },
  );
</script>
