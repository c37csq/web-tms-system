<template>
  <el-button class="reset-btn" round size="small" v-bind="$attrs">
    {{ t('button.reset') }}
  </el-button>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';

  defineOptions({
    name: 'ResetButton',
    inheritAttrs: false,
  });

  const { t } = useI18n();
</script>

<style lang="scss" scoped>
  .reset-btn {
    background-color: #eff1ff;
    color: #6e8ed8;

    &:hover {
      background-color: #ccdafc;
    }
  }
</style>
