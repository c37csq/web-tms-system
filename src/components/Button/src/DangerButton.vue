<template>
  <el-button class="danger-btn" round size="small" v-bind="$attrs">
    <slot>{{ t('button.delete') }}</slot>
  </el-button>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';

  defineOptions({
    name: 'DangerButton',
    inheritAttrs: false,
  });

  const { t } = useI18n();
</script>

<style lang="scss" scoped>
  .danger-btn {
    border-color: #ed5d85;
    background-color: #ed5d85;
    color: #fff;

    &:hover {
      background-color: #dc406b;
    }
  }
</style>
