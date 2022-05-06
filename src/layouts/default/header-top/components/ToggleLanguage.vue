<template>
  <div class="flex toggle-language ml-8px">
    <span
      v-for="item in localeList"
      :key="item.value"
      @click="onLocaleChange(item.value)"
      class="toggle-language-btn"
      :class="{ active: getLocale === item.value }"
    >
      {{ item.label }}
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { unref } from 'vue';
  import { localeList } from '@/settings/localeSetting';
  import type { LocaleType } from '#/config';
  import { useLocale } from '@/locales/useLocale';

  const { changeLocale, getLocale } = useLocale();
  async function onLocaleChange(lang: LocaleType) {
    if (unref(getLocale) === lang) {
      return;
    }
    await changeLocale(lang);
  }
</script>

<style lang="scss">
  .toggle-language {
    height: 20px;
    background-color: #e4ecef;
    border-radius: 10px;

    &-btn {
      color: #666;
      padding: 0 8px;
      cursor: pointer;

      &.active {
        color: #fff;
        background-color: var(--el-color-primary);
        padding: 0 8px;
        border-radius: 10px;
      }
    }
  }
</style>
