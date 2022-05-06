<template>
  <div class="pagination-container" v-show="total">
    <el-pagination
      small
      background
      :current-page="current"
      :page-size="size"
      :page-sizes="pageSizes"
      layout="slot, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    >
      <span class="mr-10px text-secondary-600">共 {{ total }} 条记录</span>
    </el-pagination>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'BasicPagination',
    inheritAttrs: false,
  });
</script>

<script lang="ts" setup>
  interface Props {
    current: number;
    total: number;
    size?: number;
    pageSizes?: number[];
  }

  withDefaults(defineProps<Props>(), {
    size: 10,
    pageSizes: () => [10, 50, 100, 200, 500],
  });

  const emit = defineEmits(['update:current', 'update:size', 'size-change', 'current-change', 'page-change']);

  /**
   * @description current-change 改变时触发
   */
  const onCurrentChange = (val: number) => {
    emit('update:current', val);
    emit('current-change', val);
    emit('page-change', { pageNum: val });
  };

  /**
   * @description pageSize 改变时触发
   */
  const onSizeChange = (val: number) => {
    emit('update:size', val);
    emit('size-change', val);
    emit('page-change', { pageSize: val, pageNum: 1 });
  };
</script>

<style lang="scss" scoped>
  .pagination-container {
    display: flex;
    justify-content: center;
    padding: 35px 0 20px;
  }
</style>
