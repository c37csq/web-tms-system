<template>
  <basic-dialog
    title="请确认是否发布"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="onClose"
    @submit="onSubmit"
    submit-text="发布"
    :ok-loading="okLoading"
    :model-value="modelValue"
    width="800px"
  >
    <el-table :data="data" size="small" border stripe>
      <el-table-column prop="id" label="id" width="60" />
      <el-table-column prop="oldStartTime" label="旧开始时间" />
      <el-table-column prop="oldEndTime" label="旧结束时间" />
      <el-table-column prop="newStartTime" label="新开始时间">
        <template #default="{ row }">
          <span :class="{ 'text-primary font-medium': [1, 2].includes(row.action) }">
            {{ row.newStartTime || '/' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="newEndTime" label="新结束时间">
        <template #default="{ row }">
          <span :class="{ 'text-primary font-medium': [1, 2].includes(row.action) }">
            {{ row.newEndTime || '/' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="状态" width="100">
        <template #default="{ row }">
          <span
            :class="{
              'text-publish': [1, 2].includes(row.action),
              'color-delete': row.action === 3,
            }"
          >
            {{ row.action === 1 ? '新增' : row.action === 2 ? '更新' : row.action === 3 ? '废弃' : '发布' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </basic-dialog>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PubTableItem } from './typing';
  import type { PropType } from 'vue';

  export default defineComponent({
    name: 'PubDialog',
    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
      data: {
        type: Array as PropType<PubTableItem[]>,
        required: true,
      },
    },
    emits: ['update:modelValue', 'pub'],
    setup(_, { emit }) {
      function updateVisible(visible: boolean) {
        emit('update:modelValue', visible);
      }

      const okLoading = ref(false);
      const onClose = () => {
        okLoading.value = false;
        updateVisible(false);
      };
      const onSubmit = async () => {
        okLoading.value = true;
        emit('pub', {
          closeLoading: () => {
            okLoading.value = false;
          },
          closeDialog: () => {
            updateVisible(false);
          },
        });
      };

      return {
        okLoading,

        onClose,
        onSubmit,
      };
    },
  });
</script>
