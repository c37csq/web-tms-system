<template>
  <div class="task-log" v-loading="dataLoading">
    <el-table :data="list" size="small" border stripe>
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :formatter="item.formatter"
      />
    </el-table>

    <basic-pagination
      :current="pageParams.pageNum"
      :size="pageParams.pageSize"
      :total="pageParams.total"
      @page-change="onPageChange"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'ScheduledLog',
  });
</script>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { getTaskLogListByPage, TaskLogItem, TaskLogSearchParams } from '@/api/system';
  import { columns } from './data';

  const pageParams = pageData();
  const onPageChange = (params: PageChangeParams) => {
    params.pageSize && (pageParams.pageSize = params.pageSize);
    params.pageNum && (pageParams.pageNum = params.pageNum);
    loadList();
  };

  const list = ref<TaskLogItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    try {
      dataLoading.value = true;
      // 定义在 api 的model 中 可以参考 src/api/system/base/model/baseModel.ts
      const params: TaskLogSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
      };
      const { list: lists, total, pageNum } = await getTaskLogListByPage(params);
      list.value = lists;
      pageParams.total = total;
      pageParams.pageNum = pageNum;
    } catch (e) {
      console.error(e);
      pageParams.total = 0;
      list.value = [];
    } finally {
      dataLoading.value = false;
    }
  }

  onMounted(() => {
    loadList();
  });
</script>
