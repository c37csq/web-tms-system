<template>
  <div class="basic-table">
    <el-table>
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :formatter="item.formatter"
      />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { TableColumnCtx } from 'element-plus/lib/components/table/src/table-column/defaults';
  defineOptions({
    name: 'BasicTable',
    inheritAttrs: false,
  });

  defineProps({
    columns: {
      type: Array as PropType<TableColumnCtx<any>[]>,
      required: true,
    },
  });
</script>
