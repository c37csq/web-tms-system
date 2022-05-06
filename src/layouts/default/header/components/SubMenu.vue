<template>
  <div class="submenu">
    <slot name="title"></slot>
    <div class="submenu-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    name: 'SubMenu',
  });
</script>
