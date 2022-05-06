<template>
  <el-button class="cancel-btn" round size="small" v-bind="$attrs">
    {{ t('button.cancel') }}
  </el-button>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';

  defineOptions({
    name: 'CancelButton',
    inheritAttrs: false,
  });

  const { t } = useI18n();
</script>

<style lang="scss" scoped>
  .cancel-btn {
    background-color: #eff1ff;
    color: #6e8ed8;
    border-color: #ccdafc;

    &:hover {
      background-color: #ccdafc;
    }
  }
</style>
