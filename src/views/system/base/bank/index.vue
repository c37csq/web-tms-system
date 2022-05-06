<template>
  <div class="bank" v-loading="dataLoading">
    <el-form size="small" inline class="filter-form" :model="form" ref="filterFormRef">
      <el-form-item label="币种：" prop="currency">
        <el-select placeholder="请选择币种" v-model="form.currency" clearable>
          <el-option
            v-for="item in currencyList"
            :key="item.currencyId"
            :label="`${item.currencySymbol}${item.currencyName}`"
            :value="item.currencySymbol"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="银行账号：" prop="bankAccount">
        <el-input placeholder="请输入银行账号" v-model="form.bankAccount" clearable />
      </el-form-item>
      <el-form-item label="银行名称：" prop="bankName">
        <el-input placeholder="请输入银行名称" v-model="form.bankName" clearable />
      </el-form-item>
      <el-form-item>
        <basic-filter-search @search="onSearch" @reset="onReset" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <add-button @click="operate('add')" />
    </div>

    <el-table :data="list" size="small" border stripe>
      <el-table-column prop="bankAccount" label="银行账号" />
      <el-table-column prop="bankName" label="银行名称" />
      <el-table-column prop="currency" label="币种" />
      <el-table-column prop="createBy" label="操作人" />
      <el-table-column label="操作">
        <template #default="scope">
          <div>
            <el-button type="text" size="small" @click="operate('edit', scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="operate('del', scope.row)">删除</el-button>
          </div>
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
      width="480px"
      :title="getTitle"
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
    >
      <el-form
        label-width="130px"
        size="small"
        :model="dialogFormData"
        :rules="dialogFormRules"
        ref="bankFormRef"
        v-loading="dialogFormLoading"
      >
        <el-form-item label="银行账号：" prop="bankAccount">
          <el-input placeholder="请输入银行账号" v-model="dialogFormData.bankAccount" clearable />
        </el-form-item>
        <el-form-item label="银行名称：" prop="bankName">
          <el-input placeholder="请输入银行名称" v-model="dialogFormData.bankName" clearable />
        </el-form-item>
        <el-form-item label="币种：" prop="currency">
          <el-select placeholder="请选择币种" v-model="dialogFormData.currency" clearable>
            <el-option
              v-for="item in currencyList"
              :key="item.currencyId"
              :label="`${item.currencySymbol}${item.currencyName}`"
              :value="item.currencySymbol"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'BankManagement',
  });
</script>

<script lang="ts" setup>
  import { computed, onMounted, Ref, ref, unref } from 'vue';
  import { useCurrencyList } from '@/hooks/select/useSelect';
  import { CurrencyItem } from '@/api/sys/model/selectModel';
  import {
    addBank,
    BankItem,
    BankParams,
    BankSearchParams,
    delBank,
    updateBank,
    getBankListByPage,
  } from '@/api/system';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { useMessage } from '@/hooks/web/useMessage';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { pick } from 'lodash-es';

  const { createConfirm, createBriefSuccessMsg } = useMessage();
  const currencyList = ref<CurrencyItem[]>([]);
  const list = ref<BankItem[]>([]);
  const dataLoading = ref(true);

  const filterFormRef = ref();
  const form = ref({}) as Ref<BankSearchParams>;
  function onSearch() {
    pageParams.pageNum = 1;
    loadList();
  }
  function onReset() {
    // filterFormRef.value.resetFields();
    formResetFields(filterFormRef);
    loadList();
  }

  const pageParams = pageData();
  const onPageChange = (params: PageChangeParams) => {
    params.pageSize && (pageParams.pageSize = params.pageSize);
    params.pageNum && (pageParams.pageNum = params.pageNum);
    loadList();
  };

  async function loadList() {
    try {
      dataLoading.value = true;
      const params: BankSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
      };
      form.value.currency && (params.currency = form.value.currency);
      form.value.bankName && (params.bankName = form.value.bankName);
      form.value.bankAccount && (params.bankAccount = form.value.bankAccount);
      const { list: lists, total, pageNum } = await getBankListByPage(params);
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

  function operate(type: 'add' | 'edit' | 'del', item?: BankItem) {
    switch (type) {
      case 'del':
        createConfirm({
          title: '删除银行',
          message: `请确认是否删除《${item?.bankName}》银行`,
          type: 'info',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                await delBank(item!.bankId);
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
      case 'add':
      case 'edit':
        isEdit.value = type === 'edit';

        if (unref(isEdit)) {
          dialogFormLoading.value = true;
          curBank.value = item!;
        }

        dialogVisible.value = true;
        break;
    }
  }

  const bankFormRef = ref();
  const dialogFormLoading = ref(false);
  const dialogFormData = ref({}) as Ref<BankParams>;
  const dialogFormRules = {
    currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
    bankName: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
    bankAccount: [
      {
        validator: (_rule, value, callback) => {
          if (!value) {
            callback(new Error('银行账户不能为空'));
          } else if (isNaN(value)) {
            callback(new Error('请输入合法的银行账户'));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
  };

  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const curBank = ref({}) as Ref<BankItem>;
  const getTitle = computed(() => (unref(isEdit) ? '编辑银行' : '新增银行'));
  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(bankFormRef);
    showLoading && showLoading();
    try {
      if (unref(isEdit)) {
        await updateBank({ ...unref(dialogFormData), bankId: unref(curBank).bankId });
        createBriefSuccessMsg('编辑银行成功');
      } else {
        await addBank(unref(dialogFormData));
        createBriefSuccessMsg('新增银行成功');
      }
      closeDialog && closeDialog();
      await loadList();
    } finally {
      closeLoading && closeLoading();
    }
  }
  function onClose() {
    formResetFields(bankFormRef);
  }
  function onOpened() {
    if (unref(isEdit)) {
      dialogFormData.value = pick(unref(curBank), 'currency', 'bankName', 'bankAccount');
    }
    dialogFormLoading.value = false;
  }

  async function initial() {
    currencyList.value = await useCurrencyList();
    await loadList();
  }
  onMounted(() => {
    initial();
  });
</script>
