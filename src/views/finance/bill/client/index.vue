<template>
  <div class="client-bill">
    <bill-body :bill-type="1" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import BillBody from '../components/BillBody.vue';

  export default defineComponent({
    name: 'ClientBill',
    components: { BillBody },
  });
</script>
