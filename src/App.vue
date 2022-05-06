<template>
  <el-config-provider :locale="getEpLocale" :button="{ autoInsertSpace: true }">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
  import { useLocale } from '@/locales/useLocale';
  import { useTitle } from '@/hooks/web/useTitle';

  const { getEpLocale } = useLocale();

  useTitle();
</script>
