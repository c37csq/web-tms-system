<template>
  <div class="currency" v-loading="dataLoading">
    <div class="mb-20px">
      <add-button @click="operate('add')" v-auth="['system:warehouse:add']" />
    </div>

    <el-table :data="list" size="small" border stripe>
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :formatter="item.formatter"
      />
      <el-table-column width="300" prop="action" label="操作">
        <template #default="{ row }">
          <div>
            <el-button type="text" size="small" @click="operate('edit', row)"> 汇率修改 </el-button>
            <el-button type="text" size="small" @click="operate('del', row)"> 删除 </el-button>
            <el-button type="text" size="small" @click="operate('record', row)"> 汇率记录 </el-button>
            <el-button type="text" size="small" @click="operate('log', row)"> 日志 </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <basic-dialog
      v-model="dialogVisible"
      width="480px"
      :title="getTitle"
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
    >
      <el-form
        size="small"
        label-width="100px"
        :model="dialogFormData"
        :rules="dialogFormRules"
        ref="dialogFormRef"
        v-loading="dialogFormLoading"
      >
        <el-form-item label="币种符号" prop="currencySymbol">
          <el-input v-model.trim="dialogFormData.currencySymbol" placeholder="请输入币种符号" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="币种名称" prop="currencyName">
          <el-input v-model="dialogFormData.currencyName" placeholder="请输入币种名称" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="汇率" prop="exchangeRate">
          <el-input v-model="dialogFormData.exchangeRate" placeholder="请输入汇率" />
        </el-form-item>
        <el-form-item v-show="!isEdit" label="启用月份" prop="startupDate">
          <el-date-picker
            v-model="dialogFormData.startupDate"
            :disabled-date="(time) => time < new Date()"
            format="YYYY 年 MM 月"
            type="month"
            placeholder="选择启用月份"
          />
        </el-form-item>
      </el-form>
    </basic-dialog>

    <basic-dialog title="汇率记录" is-scroll v-model="recordDialogVisible" :show-footer="false">
      <el-table :data="recordList" size="small" border stripe @expand-change="onRecordExpandChange">
        <el-table-column type="expand">
          <el-table :data="currencyLogList" size="small" border stripe>
            <el-table-column prop="currencySymbol" label="币种符号" />
            <el-table-column prop="exchangeRateOld" label="旧汇率" />
            <el-table-column prop="exchangeRateNew" label="新汇率" />
            <el-table-column prop="createBy" label="操作人" />
            <el-table-column prop="createTime" label="操作日期" />
          </el-table>
        </el-table-column>
        <el-table-column prop="currencySymbol" label="币种符号" />
        <el-table-column prop="currencyName" label="币种名称" />
        <el-table-column prop="exchangeRate" label="汇率" />
        <el-table-column prop="startupDate" label="启用月份" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column prop="operate" label="操作">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="onRecordEdit(row)" :disabled="!!row.currencyStatus">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </basic-dialog>

    <basic-dialog title="日志" is-scroll v-model="logDialogVisible" :show-footer="false">
      <el-table :data="currencyLogList" size="small" border stripe>
        <el-table-column prop="currencySymbol" label="币种符号" />
        <el-table-column prop="exchangeRateNew" label="新汇率" />
        <el-table-column prop="exchangeRateOld" label="旧汇率" />
        <el-table-column prop="createBy" label="操作人" />
        <el-table-column prop="createTime" label="操作日期" />
      </el-table>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'CurrencyManagement',
  });
</script>

<script lang="ts" setup>
  import { ref, computed, unref, onMounted } from 'vue';
  import type { Ref } from 'vue';
  import { BasicTableColumn } from '@/components/Table/';
  import {
    CurrencyParams,
    CurrencyItem,
    CurrencySearchParams,
    CurrencyLogItem,
    getCurrencyList,
    getCurrencyLogList,
    updateCurrency,
    addCurrency,
    delCurrency,
  } from '@/api/system';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { dateUtil } from '@/utils/dateUtil';
  import { pick } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';

  const { createConfirm, createBriefSuccessMsg } = useMessage();

  const columns: BasicTableColumn[] = [
    { label: '币种符号', prop: 'currencySymbol' },
    { label: '币种名称', prop: 'currencyName' },
    { label: '汇率', prop: 'exchangeRate' },
    { label: '更新时间', prop: 'updateTime' },
    { label: '创建时间', prop: 'createTime' },
  ];

  const list = ref<CurrencyItem[]>([]);
  const dataLoading = ref(false);
  async function loadList(params: CurrencySearchParams) {
    try {
      dataLoading.value = true;
      const data = await getCurrencyList(params);
      if (params.currencySymbol) {
        recordList.value = data;
      } else {
        list.value = data;
      }
    } catch (e) {
      console.error(e);
      if (params.currencySymbol) {
        recordList.value = [];
      } else {
        list.value = [];
      }
    } finally {
      dataLoading.value = false;
    }
  }

  const currencyLogList = ref<CurrencyLogItem[]>([]);

  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const isInnerEdit = ref(false); // 汇率记录内部点击编辑按钮
  const getTitle = computed(() => (unref(isEdit) ? '编辑' : '新增'));

  const dialogFormData = ref({}) as Ref<CurrencyParams>;
  const dialogFormRules = {
    currencySymbol: [{ required: true, message: '请输入币种符号', trigger: 'blur' }],
    currencyName: [{ required: true, message: '请输入币种名称', trigger: 'blur' }],
    exchangeRate: [
      {
        required: true,
        validator: (_, value, callback) => {
          if (!value || value === '') {
            callback(new Error('请输入汇率'));
          } else if (+value <= 0 || isNaN(+value)) {
            callback(new Error('请输入正确的汇率'));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
    startupDate: [{ required: true, message: '请输入启用月份', trigger: 'change' }],
  };
  const dialogFormRef = ref();
  const dialogFormLoading = ref(false);
  const curCurrency = ref({}) as Ref<CurrencyItem>;

  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(dialogFormRef);
    showLoading && showLoading();
    try {
      dialogFormData.value.startupDate = dateUtil(dialogFormData.value.startupDate).format('YYYY/MM');
      if (unref(isEdit)) {
        await updateCurrency({
          ...unref(dialogFormData),
          currencyId: unref(curCurrency).currencyId,
        });
        createBriefSuccessMsg('编辑币种成功');
      } else {
        await addCurrency(unref(dialogFormData));
        createBriefSuccessMsg('新增币种成功');
      }

      if (unref(isInnerEdit)) {
        await loadList({ currencySymbol: unref(curCurrency).currencySymbol });
      }
      await loadList({ currencyStatus: 0 });
      closeDialog && closeDialog();
    } finally {
      closeLoading && closeLoading();
    }
  }
  function onClose() {
    formResetFields(dialogFormRef);
  }
  function onOpened() {
    if (unref(isEdit)) {
      dialogFormData.value = pick(
        unref(curCurrency),
        'currencyName',
        'currencySymbol',
        'exchangeRate',
        'startupDate',
      ) as unknown as CurrencyParams;
    } else {
      dialogFormData.value.startupDate = dateUtil().format('YYYY/MM/DD');
    }
    dialogFormLoading.value = false;
  }

  const recordDialogVisible = ref(false);
  const canRecordBtnClick = ref(true);
  const recordList = ref<CurrencyItem[]>([]);

  const logDialogVisible = ref(false);

  async function onRecordExpandChange(row: CurrencyItem) {
    try {
      currencyLogList.value = await getCurrencyLogList(row.currencyId);
    } catch (e) {
      console.error(e);
      currencyLogList.value = [];
    }
  }
  async function onRecordEdit(item: CurrencyItem) {
    isEdit.value = true;
    isInnerEdit.value = true;
    curCurrency.value = item;

    dialogFormLoading.value = true;
    dialogVisible.value = true;
  }

  type OperateType = 'add' | 'edit' | 'del' | 'log' | 'record';
  async function operate(type: OperateType, item?: CurrencyItem) {
    switch (type) {
      case 'record':
        if (!unref(canRecordBtnClick)) return;
        canRecordBtnClick.value = false;
        await loadList({ currencySymbol: item!.currencySymbol });
        canRecordBtnClick.value = true;
        recordDialogVisible.value = true;
        break;
      case 'add':
      case 'edit':
        isEdit.value = type === 'edit';
        isInnerEdit.value = false;

        if (unref(isEdit)) {
          curCurrency.value = item!;
        }

        dialogFormLoading.value = true;
        dialogVisible.value = true;
        break;
      case 'del':
        createConfirm({
          title: '删除币种',
          message: `请确认是否删除《${item!.currencyName}》币种`,
          type: 'info',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                await delCurrency(item!.currencyId);
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
            loadList({ currencyStatus: 0 });
          })
          .catch(() => {});
        break;
      case 'log':
        try {
          currencyLogList.value = await getCurrencyLogList(item!.currencyId);
        } catch (e) {
          console.error(e);
          currencyLogList.value = [];
        } finally {
          logDialogVisible.value = true;
        }
        break;
    }
  }

  onMounted(() => {
    loadList({ currencyStatus: 0 });
  });
</script>
