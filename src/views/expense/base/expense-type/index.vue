<template>
  <div class="expense-type" v-loading="dataLoading">
    <el-form size="small" inline class="filter-form" :model="form" ref="filterFormRef">
      <el-form-item label="费用类型编号" prop="feeCode">
        <el-input placeholder="请输入费用类型编号" v-model.trim="form.feeCode" @keydown.enter="onSearch" clearable />
      </el-form-item>
      <el-form-item label="费用类型名称" prop="feeNameCn">
        <el-input placeholder="请输入费用类型名称" v-model.trim="form.feeNameCn" @keydown.enter="onSearch" clearable />
      </el-form-item>
      <el-form-item>
        <basic-filter-search @search="onSearch" @reset="onReset" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <add-button @click="operate('add')" v-auth="['expenses:type:add']" />
    </div>

    <el-table :data="list" size="small" border stripe>
      <el-table-column prop="feeCode" label="费用类型编号" />
      <el-table-column prop="feeNameCn" label="费用类型名称" />
      <el-table-column prop="operate" label="操作">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="operate('edit', row)" v-auth="['expenses:type:edit']">
            编辑
          </el-button>
          <el-button type="text" size="small" @click="operate('del', row)" v-auth="['expenses:type:del']">
            删除
          </el-button>
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
      width="420px"
      :title="getTitle"
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
    >
      <el-form
        size="small"
        label-width="120px"
        :model="dialogFormData"
        :rules="dialogFormRules"
        ref="dialogFormRef"
        v-loading="dialogFormLoading"
      >
        <el-form-item label="费用类型编号" prop="feeCode">
          <el-input placeholder="请输入费用类型编号" v-model="dialogFormData.feeCode" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="费用类型名称" prop="feeNameCn">
          <el-input placeholder="请输入费用类型名称" v-model="dialogFormData.feeNameCn" />
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'ExpenseTypeManagement',
  });
</script>

<script lang="ts" setup>
  import { ref, onMounted, computed, unref } from 'vue';
  import type { Ref } from 'vue';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import {
    addExpenseType,
    delExpenseType,
    ExpenseTypeItem,
    ExpenseTypeParams,
    ExpenseTypeSearchParams,
    getExpenseTypeByPage,
    updateExpenseType,
  } from '@/api/expense';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { useMessage } from '@/hooks/web/useMessage';
  import { pick } from 'lodash-es';

  const { createConfirm, createBriefSuccessMsg } = useMessage();

  const pageParams = pageData();
  const onPageChange = (params: PageChangeParams) => {
    params.pageSize && (pageParams.pageSize = params.pageSize);
    params.pageNum && (pageParams.pageNum = params.pageNum);
    loadList();
  };

  const form = ref({}) as Ref<ExpenseTypeSearchParams>;
  const filterFormRef = ref();

  async function onSearch() {
    pageParams.pageNum = 1;
    await loadList();
  }
  async function onReset() {
    formResetFields(filterFormRef);
    await loadList();
  }

  const list = ref<ExpenseTypeItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    try {
      dataLoading.value = true;
      const params: ExpenseTypeSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
      };
      form.value.feeCode && (params.feeCode = form.value.feeCode);
      form.value.feeNameCn && (params.feeNameCn = form.value.feeNameCn);
      const { list: lists, total, pageNum } = await getExpenseTypeByPage(params);
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
  const getTitle = computed(() => (unref(isEdit) ? '编辑' : '新增'));
  const dialogFormData = ref({}) as Ref<ExpenseTypeParams>;
  const dialogFormRules = {
    feeCode: [{ required: true, message: '费用类型编号不能为空', trigger: 'blur' }],
    feeNameCn: [{ required: true, message: '费用名称不能为空', trigger: 'blur' }],
  };
  const dialogFormRef = ref();
  const dialogFormLoading = ref(false);
  const curExpenseType = ref({}) as Ref<ExpenseTypeItem>;

  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(dialogFormRef);
    showLoading && showLoading();
    try {
      if (unref(isEdit)) {
        await updateExpenseType({ ...unref(dialogFormData), feeId: unref(curExpenseType).feeId });
        createBriefSuccessMsg('编辑费用类型成功');
      } else {
        await addExpenseType(unref(dialogFormData));
        createBriefSuccessMsg('新增费用类型成功');
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
      dialogFormData.value = pick(unref(curExpenseType), 'feeCode', 'feeNameCn');
    }
    dialogFormLoading.value = false;
  }

  function operate(type: 'add' | 'edit' | 'del', item?: ExpenseTypeItem) {
    if (type === 'del') {
      createConfirm({
        title: '删除费用类型',
        message: `请确认是否删除《${item?.feeNameCn}》费用类型`,
        type: 'info',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            try {
              await delExpenseType([item!.feeId]);
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
    } else {
      isEdit.value = type === 'edit';

      if (unref(isEdit)) {
        curExpenseType.value = item!;
      }

      dialogFormLoading.value = true;
      dialogVisible.value = true;
    }
  }
</script>
