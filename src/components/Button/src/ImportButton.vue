<template>
  <el-button class="import-btn" round size="small" v-bind="$attrs">
    <slot>{{ t('button.import') }}</slot>
  </el-button>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';

  defineOptions({
    name: 'ImportButton',
    inheritAttrs: false,
  });

  const { t } = useI18n();
</script>

<style lang="scss" scoped>
  .import-btn {
    background-color: #6e8ed8;
    border-color: #6e8ed8;
    color: #fff;

    &:hover {
      background-color: #5979c4;
    }
  }
</style>
