<template>
  <div class="scheduled">
    <div class="mb-20px">
      <add-button @click="operate('add')" />
      <search-button
        @click="operate('batchExecute')"
        :disabled="getBatchCommonBtnDisabled"
        :loading="executeBtnLoading"
      >
        执行任务
      </search-button>
      <danger-button
        @click="operate('batchPause')"
        :disabled="getBatchCommonBtnDisabled || getBatchPauseBtnDisabled"
        :loading="pauseBtnLoading"
      >
        暂停任务
      </danger-button>
      <import-button
        @click="operate('batchRecovery')"
        :disabled="getBatchCommonBtnDisabled || getBatchRecoveryBtnDisabled"
        :loading="recoveryBtnLoading"
      >
        恢复任务
      </import-button>
    </div>

    <el-table :data="list" size="small" border stripe @selection-change="onSelectTask">
      <el-table-column type="selection" width="50" />
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :formatter="item.formatter"
      />
      <el-table-column prop="operate" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="operate('apply', scope.row)"> 立即执行 </el-button>
          <el-button type="text" size="small" @click="operate('edit', scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="operate('del', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <basic-pagination
      :current="pageParams.pageNum"
      :size="pageParams.pageSize"
      :total="pageParams.total"
      @page-change="onPageChange"
    />

    <basic-dialog
      v-model="dialogVisible"
      width="600px"
      :title="getTitle"
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
    >
      <el-form
        size="small"
        :model="dialogFormData"
        :rules="dialogFormRules"
        label-width="120px"
        ref="dialogFormRef"
        v-loading="dialogFormLoading"
      >
        <el-form-item label="任务名称" prop="name">
          <el-input placeholder="请输入任务名称" v-model="dialogFormData.name" />
        </el-form-item>
        <el-form-item label="Cron表达式" prop="cron">
          <el-input placeholder="请输入Cron表达式" v-model="dialogFormData.cron">
            <template #append>
              <a href="https://cron.qqe2.com" target="_blank" rel="noopener noreferrer">cron Tip</a>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="Bean名称" prop="targetBean">
          <el-input placeholder="请输入Bean名称" v-model="dialogFormData.targetBean" />
        </el-form-item>
        <el-form-item label="方法名称" prop="targetMethod">
          <el-input placeholder="请输入方法名称" v-model="dialogFormData.targetMethod" />
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-radio-group v-model="dialogFormData.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">暂停</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息" prop="remarks">
          <el-input
            type="textarea"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="dialogFormData.remarks"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ImportButton } from '@/components/Button';

  export default defineComponent({
    name: 'ScheduledList',
    components: { ImportButton },
  });
</script>

<script lang="ts" setup>
  import { ref, onMounted, computed, unref, Ref } from 'vue';
  import { PageChangeParams, pageData } from '@/components/Pagination';

  import { columns } from './data';
  import {
    getTaskListByPage,
    executeTask,
    pauseTask,
    recoverTask,
    TaskItem,
    TaskSearchParams,
    delTask,
    TaskParams,
    addTask,
    updateTask,
  } from '@/api/system';

  import { useMessage } from '@/hooks/web/useMessage';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { pick } from 'lodash-es';

  const { createConfirm, createBriefSuccessMsg } = useMessage();

  const pageParams = pageData();
  const onPageChange = (params: PageChangeParams) => {
    params.pageSize && (pageParams.pageSize = params.pageSize);
    params.pageNum && (pageParams.pageNum = params.pageNum);
    loadList();
  };

  const list = ref<TaskItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    try {
      dataLoading.value = true;
      const params: TaskSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
      };
      const { list: lists, total, pageNum } = await getTaskListByPage(params);
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

  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const curTask = ref({}) as Ref<TaskItem>;
  const getTitle = computed(() => (unref(isEdit) ? '编辑' : '新增'));
  const dialogFormData = ref({}) as Ref<TaskParams>;
  const dialogFormRules = {
    name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
    cron: [{ required: true, message: '请输入Cron表达式', trigger: 'blur' }],
    targetBean: [{ required: true, message: '请输入Bean名称', trigger: 'blur' }],
    targetMethod: [{ required: true, message: '请输入方法名称', trigger: 'blur' }],
    status: [{ required: true, message: '请选择任务状态', trigger: 'change' }],
    remarks: [{ required: true, message: '请输入备注信息', trigger: 'blur' }],
  };
  const dialogFormRef = ref();
  const dialogFormLoading = ref(false);

  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(dialogFormRef);
    showLoading && showLoading();
    try {
      if (unref(isEdit)) {
        await updateTask({ ...unref(dialogFormData), id: unref(curTask).id });
        createBriefSuccessMsg('编辑成功');
      } else {
        await addTask(unref(dialogFormData));
        createBriefSuccessMsg('新建成功');
      }
      await loadList();
      closeDialog && closeDialog();
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading && closeLoading();
    }
  }
  function onClose() {
    formResetFields(dialogFormRef);
  }
  function onOpened() {
    if (unref(isEdit)) {
      dialogFormData.value = pick(unref(curTask), 'targetBean', 'targetMethod', 'name', 'cron', 'remarks', 'status');
    }
    dialogFormLoading.value = false;
  }

  const selectTaskList = ref<TaskItem[]>([]);
  function onSelectTask(val: TaskItem[]) {
    selectTaskList.value = val;
  }

  const getBatchCommonBtnDisabled = computed((): boolean => !unref(selectTaskList).length);
  const getBatchPauseBtnDisabled = computed((): boolean => !unref(selectTaskList).every((e) => e.status === 0));
  const getBatchRecoveryBtnDisabled = computed((): boolean => !unref(selectTaskList).every((e) => e.status === 1));
  // 1 表示暂停  0表示正常
  const executeBtnLoading = ref(false);
  const pauseBtnLoading = ref(false);
  const recoveryBtnLoading = ref(false);

  const batchMap = {
    execute: async (ids) => {
      executeBtnLoading.value = true;
      await executeTask(ids);
      executeBtnLoading.value = false;
      createBriefSuccessMsg('批量执行成功');
    },
    pause: async (ids) => {
      pauseBtnLoading.value = true;
      await pauseTask(ids);
      pauseBtnLoading.value = false;
      createBriefSuccessMsg('批量暂停成功');
    },
    recovery: async (ids) => {
      recoveryBtnLoading.value = true;
      await recoverTask(ids);
      recoveryBtnLoading.value = false;
      createBriefSuccessMsg('批量恢复成功');
    },
  };
  type BatchOperateType = 'execute' | 'pause' | 'recovery';
  async function batchCommonRun(type: BatchOperateType, ids) {
    await batchMap[type](ids);
  }

  type OperateType = 'add' | 'edit' | 'del' | 'apply' | 'batchExecute' | 'batchPause' | 'batchRecovery';
  async function operate(type: OperateType, item?: TaskItem) {
    if (type.startsWith('batch')) {
      const ids = unref(selectTaskList).map((e) => e.id);
      const batchType = type.substr(5).toLocaleLowerCase() as BatchOperateType;
      await batchCommonRun(batchType, ids);
      await loadList();
    } else {
      switch (type) {
        case 'add':
        case 'edit':
          isEdit.value = type === 'edit';
          if (unref(isEdit)) {
            curTask.value = item!;
          }
          dialogFormLoading.value = true;
          dialogVisible.value = true;
          break;
        case 'apply':
          await executeTask([item!.id]);
          createBriefSuccessMsg('立即执行成功');
          break;
        case 'del':
          createConfirm({
            title: '删除定时任务',
            message: `请确认是否删除《${item!.name}》定时任务`,
            type: 'info',
            beforeClose: async (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                try {
                  await delTask(item!.id);
                  createBriefSuccessMsg('删除成功');
                } catch (e) {
                  console.error(e);
                } finally {
                  done();
                  instance.confirmButtonLoading = false;
                }
              } else {
                done();
              }
            },
          })
            .then(() => {
              loadList();
            })
            .catch(() => {});
          break;
      }
    }
  }
</script>
