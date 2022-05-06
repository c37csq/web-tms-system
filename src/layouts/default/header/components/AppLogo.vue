<template>
  <router-link to="/" custom>
    <div class="logo">
      <img class="logo-img" :src="logoUrl" alt="OneTounch" />
    </div>
  </router-link>
</template>

<script setup lang="ts">
  import logoUrl from '@/assets/logo.png';
</script>

<style scoped lang="scss">
  .logo {
    flex: 0 0 140px;
    width: 140px;
    height: 30px;
    margin-right: 40px;

    &-img {
      width: 100%;
      height: 100%;
    }
  }
</style>
