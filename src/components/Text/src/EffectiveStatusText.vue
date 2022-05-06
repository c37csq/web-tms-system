<template>
  <span v-if="~~effectiveState === 0">未生效</span>
  <span class="text-active" v-else-if="~~effectiveState === 1">生效</span>
  <span class="text-invalid" v-else>过期</span>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'EffectiveStatusText',
    props: {
      effectiveState: {
        type: [Number, String],
        required: true,
      },
    },
  });
</script>
