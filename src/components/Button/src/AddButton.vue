<template>
  <el-button class="add-btn" round size="small" v-bind="$attrs">
    <slot>{{ t('button.add') }}</slot>
  </el-button>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';

  defineOptions({
    name: 'AddButton',
    inheritAttrs: false,
  });

  const { t } = useI18n();
</script>

<style lang="scss" scoped>
  .add-btn {
    border-color: #2f9b98;
    background-color: #2f9b98;
    color: #fff;

    &:hover {
      background-color: #218a88;
    }
  }
</style>
