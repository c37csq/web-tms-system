<template>
  <el-button type="primary" round size="small" v-bind="$attrs">
    <slot>{{ t('button.search') }}</slot>
  </el-button>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';

  defineOptions({
    name: 'SearchButton',
    inheritAttrs: false,
  });

  const { t } = useI18n();
</script>
