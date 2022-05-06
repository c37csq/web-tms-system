<template>
  <div class="dict-management" v-loading="dataLoading">
    <el-form inline size="small" :model="form" ref="filterFormRef" class="filter-form">
      <el-form-item label="类型" prop="type">
        <el-input placeholder="请输入类型" v-model.trim="form.type" clearable />
      </el-form-item>
      <el-form-item label="标签" prop="label">
        <el-input placeholder="请输入标签" v-model.trim="form.label" clearable />
      </el-form-item>
      <el-form-item>
        <basic-filter-search @search="onSearch" @reset="onReset" />
        <el-button round @click="operate('add')">新增</el-button>
        <el-button round @click="operate('refresh')">刷新变量</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" size="small" border stripe>
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="label" label="标签" />
      <el-table-column prop="value" label="值" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createDate" label="创建时间" />
      <el-table-column prop="action" label="操作">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="operate('type', row)">新增同类型</el-button>
          <el-button type="text" size="small" @click="operate('edit', row)">编辑</el-button>
          <el-button type="text" size="small" @click="operate('del', row)">删除</el-button>
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
        label-width="90px"
        size="small"
        :model="dialogFormData"
        :rules="dialogFormRules"
        ref="dialogFormRef"
        v-loading="dialogFormLoading"
      >
        <el-form-item label="类型" prop="type">
          <el-input v-model="dialogFormData.type" placeholder="请输入类型" :disabled="operateType === 'isEdit'" />
        </el-form-item>
        <el-form-item label="标签" prop="label">
          <el-input v-model="dialogFormData.label" placeholder="请输入标签" />
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="dialogFormData.value" placeholder="请输入值" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="dialogFormData.description"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'DictManagement',
  });
</script>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed, unref } from 'vue';
  import type { Ref } from 'vue';
  import {
    addDict,
    delDict,
    DictItem,
    DictSearchParams,
    getDict,
    getDictByPage,
    refreshAllDict,
    updateDict,
  } from '@/api/system';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { upperFirst } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';

  const { createConfirm, createBriefSuccessMsg } = useMessage();

  const form = reactive({
    type: '',
    label: '',
  });
  const filterFormRef = ref();

  const pageParams = pageData();
  const onPageChange = (params: PageChangeParams) => {
    params.pageSize && (pageParams.pageSize = params.pageSize);
    params.pageNum && (pageParams.pageNum = params.pageNum);
    loadList();
  };

  async function onSearch() {
    pageParams.pageNum = 1;
    await loadList();
  }
  async function onReset() {
    formResetFields(filterFormRef);
    await loadList();
  }

  const list = ref<DictItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    try {
      dataLoading.value = true;
      const params: DictSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
      };
      form.label && (params.label = form.label);
      form.type && (params.type = form.type);
      const { list: lists, total, pageNum } = await getDictByPage(params);
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

  const dialogVisible = ref(false);
  const operateType = ref('isAdd');
  const curDict = ref({}) as Ref<DictItem>;
  const operateTitleMap = {
    isAdd: '新增',
    isEdit: '编辑',
    isType: '新增同类型',
  };
  const getTitle = computed(() => operateTitleMap[unref(operateType)]);
  const dialogFormData = reactive({
    type: '',
    label: '',
    value: '',
    description: '',
  });
  const dialogFormRules = {
    type: [{ required: true, message: '请输入类型', trigger: 'blur' }],
    label: [{ required: true, message: '请输入标签', trigger: 'blur' }],
    value: [{ required: true, message: '请输入值', trigger: 'blur' }],
  };
  const dialogFormRef = ref();
  const dialogFormLoading = ref(false);

  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(dialogFormRef);
    showLoading && showLoading();
    try {
      if (unref(operateType) === 'isEdit') {
        await updateDict({ ...dialogFormData, id: unref(curDict).id });
        createBriefSuccessMsg('编辑成功');
      } else {
        await addDict(dialogFormData);
        createBriefSuccessMsg('新增成功');
      }
      await loadList();
      closeDialog && closeDialog();
    } finally {
      closeLoading && closeLoading();
    }
  }
  function onClose() {
    formResetFields(dialogFormRef);
  }
  function onOpened() {
    if (unref(operateType) === 'isType') {
      dialogFormData.type = unref(curDict).type;
    }
    if (unref(operateType) === 'isEdit') {
      dialogFormData.type = unref(curDict).type;
      dialogFormData.label = unref(curDict).label;
      dialogFormData.value = unref(curDict).value;
      dialogFormData.description = unref(curDict).description;
    }
    dialogFormLoading.value = false;
  }

  type OperateType = 'add' | 'refresh' | 'type' | 'edit' | 'del';
  async function operate(type: OperateType, item?: DictItem) {
    switch (type) {
      case 'add':
      case 'edit':
      case 'type':
        operateType.value = 'is' + upperFirst(type);
        if (type !== 'add') {
          curDict.value = await getDict(item!.id);
        }

        dialogFormLoading.value = true;
        dialogVisible.value = true;
        break;
      case 'del':
        createConfirm({
          title: '删除',
          message: `此操作将永久删除类型《${item!.type}》标签为《${item!.label}》, 是否继续?`,
          type: 'info',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                await delDict(item!.id);
                createBriefSuccessMsg('删除成功');
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
      case 'refresh':
        await refreshAllDict();
        createBriefSuccessMsg('刷新成功');
        break;
    }
  }

  onMounted(() => {
    loadList();
  });
</script>
