<template>
  <div class="*flex-btc-ac h-30px header-top">
    <div class="pl-4">
      <span>版本 {{ version }} </span>
      <span class="ml-4" v-auth="['sys:lastBuildTime']">最后更新时间: {{ lastBuildTime }}</span>
    </div>

    <div class="flex items-center">
      <download-btn />
      <user-dropdown />
      <toggle-language />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { UserDropdown, ToggleLanguage, DownloadBtn } from './components';

  export default defineComponent({
    name: 'HeaderTop',
    components: {
      UserDropdown,
      ToggleLanguage,
      DownloadBtn,
    },
    setup() {
      const { pkg, lastBuildTime } = __APP_INFO__;
      const version = pkg.version;
      return {
        version,
        lastBuildTime,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .header-top {
    font-size: 12px;
  }
</style>
