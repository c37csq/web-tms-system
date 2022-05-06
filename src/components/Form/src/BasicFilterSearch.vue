<template>
  <search-button @click="onSearch" />
  <reset-button @click="onReset" />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'BasicFilterSearch',
    emits: ['search', 'reset'],
    setup(_, { emit }) {
      function onSearch() {
        emit('search');
      }
      function onReset() {
        emit('reset');
      }

      return {
        onSearch,
        onReset,
      };
    },
  });
</script>
