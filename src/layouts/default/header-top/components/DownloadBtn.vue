<template>
  <a
    v-if="isTop"
    href="https://frontend-tms.obs.myhuaweicloud.com/import-template/TMS-Manual.docx"
    class="manual-btn mr-10px pl-8px pr-8px"
    target="_blank"
    p="2px"
    rel="noopener noreferrer"
  >
    {{ t('layout.header.dropdownItemDoc') }}
  </a>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useUserStore } from '@/store/modules/user';

  const { t } = useI18n();

  const userStore = useUserStore();

  const isTop = computed(() => userStore.getIsTop);
</script>

<style lang="scss" scoped>
  .manual-btn {
    border: 1px solid var(--el-color-primary);
    border-radius: 10px;
    transition: all 0.5s;

    &:hover {
      color: #fff;
      transition: all 0.5s;
      background-color: var(--el-color-primary);
    }
  }
</style>
