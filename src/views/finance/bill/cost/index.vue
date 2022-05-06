<template>
  <div class="cost-bill">
    <bill-body :bill-type="2" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import BillBody from '../components/BillBody.vue';

  export default defineComponent({
    name: 'CostBill',
    components: { BillBody },
  });
</script>
