<template>
  <span v-if="~~status === 0">草稿</span>
  <span class="text-publish" v-else-if="~~status === 1">已发布</span>
  <span class="text-delete" v-else>作废</span>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'StatusText',
    props: {
      status: {
        type: [Number, String],
        required: true,
      },
    },
  });
</script>
