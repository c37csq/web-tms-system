<template>
  <el-form size="small" inline class="filter-form" :model="form" ref="filterFormRef">
    <el-form-item label="客户代码" v-if="billType === 1" prop="clientCode">
      <el-select v-model="form.clientCode" filterable clearable>
        <el-option
          v-for="item in clientCodeList"
          :key="item.id"
          :label="`${item.clientCode}[${item.companyName}]`"
          :value="item.clientCode"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="服务商代码" v-if="billType === 2" prop="clientCode">
      <el-select v-model="form.clientCode" clearable filterable placeholder="请选择服务商代码">
        <el-option
          v-for="item in serviceList"
          :key="item.serviceProviderId"
          :label="item.serviceProviderCode"
          :value="item.serviceProviderCode"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="账单号" prop="billsNumber">
      <el-input placeholder="请输入账单号" v-model="form.billsNumber" clearable />
    </el-form-item>
    <el-form-item label="账单状态" prop="billStatus">
      <el-select v-model="form.billStatus" placeholder="账单状态" clearable>
        <el-option label="待确认" value="0" />
        <el-option label="确认" value="1" />
        <el-option label="作废" value="2" />
      </el-select>
    </el-form-item>
    <el-form-item label="账单日期" prop="dateRange">
      <el-date-picker
        v-model="form.dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
      />
    </el-form-item>
    <el-form-item>
      <basic-filter-search @search="onSearch" @reset="onReset" />
    </el-form-item>
  </el-form>

  <div class="mb-20px">
    <add-button @click="operate('add')" />
    <template v-if="billType === 2">
      <export-button
        :api="exportBill"
        :disabled="!batchSelectedBill.length"
        :params="{ billsNumber: batchSelectedBill }"
        filename="批量账单"
      >
        批量导出
      </export-button>
      <import-button @click="operate('batchImport')">批量导入</import-button>
    </template>
  </div>

  <el-table :data="list" size="small" border stripe @selection-change="onSelectTable">
    <el-table-column type="selection" width="50" v-if="billType === 2" />
    <el-table-column
      v-for="item in columns"
      :key="item.prop"
      :label="item.label"
      :prop="item.prop"
      :formatter="item.formatter"
    />
    <el-table-column prop="action" label="操作" width="180">
      <template #default="{ row }">
        <template v-if="row.billStatus === '0'">
          <el-button type="text" size="small" v-auth="permissionRole" @click="operate('apply', row)"> 确认 </el-button>
          <el-button type="text" size="small" v-auth="permissionRole" @click="operate('del', row)"> 作废 </el-button>
        </template>
        <export-button
          :api="exportBill"
          :params="{ billsNumber: row.billsNumber }"
          :filename="`账单号${row.billsNumber}的账单`"
          type="text"
        >
          导出账单
        </export-button>
      </template>
    </el-table-column>
  </el-table>

  <basic-pagination
    :current="pageParams.pageNum"
    :size="pageParams.pageSize"
    :total="pageParams.total"
    @page-change="onPageChange"
  />

  <import-dialog
    v-model="importData.visible"
    :action="importData.action"
    :params="importData.params"
    :template-url="importData.templateUrl"
    @success="onImportSuccess"
  />

  <basic-dialog
    :title="billType === 1 ? '新建客户账单' : '新建成本账单'"
    v-model="dialogState.visible"
    width="880px"
    is-scroll
    submit-text="生成账单"
    @submit="onGenSubmit"
    @opened="onOpened"
  >
    <div class="bill-container p-5" v-loading="dialogLoading">
      <el-form size="small" inline :model="dialogState.form" :rules="billSearchRules" ref="billGeneratorRef">
        <el-form-item label="客户代码" prop="enterpriseRecordIds" v-if="billType === 1">
          <el-select placeholder="请选择客户代码" filterable multiple v-model="dialogState.form.enterpriseRecordIds">
            <el-option
              v-for="item in clientCodeList"
              :key="item.id"
              :label="`${item.clientCode}[${item.companyName}]`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="服务商代码" prop="serviceProviderCodes" v-else>
          <el-select placeholder="请选择服务商代码" filterable multiple v-model="dialogState.form.serviceProviderCodes">
            <el-option
              v-for="item in serviceList"
              :key="item.serviceProviderId"
              :label="item.serviceProviderCode"
              :value="item.serviceProviderCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="获取面单时间" prop="dateRange">
          <el-date-picker
            v-model="dialogState.form.dateRange"
            type="daterange"
            range-separator="至"
            @change="onDateChange"
            :disabled-date="dialogState.disabledDate"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button round type="primary" @click="onBillSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="billList"
        size="small"
        border
        stripe
        @selection-change="onBillTableSelect"
        v-loading="searchDataLoading"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column
          v-for="item in billColumns"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :formatter="item.formatter"
        />
      </el-table>
    </div>
  </basic-dialog>

  <basic-dialog title="确认生成" v-model="dialogState.confirmVisible" width="400px" @submit="onSubmit" @close="onClose">
    <el-form size="small" ref="billRef" :model="dialogState.form" :rules="dialogState.rules">
      <el-form-item label="账单时间" prop="billsDate">
        <el-date-picker v-model="dialogState.form.billsDate" type="date" placeholder="选择日期" />
      </el-form-item>
    </el-form>
  </basic-dialog>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ExportButton, ImportButton } from '@/components/Button';
  import ImportDialog from '@/components/Dialog/src/ImportDialog.vue';

  export default defineComponent({
    name: 'BillBody',
    components: { ImportButton, ExportButton, ImportDialog },
  });
</script>

<script lang="ts" setup>
  import { onMounted, reactive, ref, unref, onActivated, h } from 'vue';
  import type { PropType } from 'vue';
  import { columns } from './data';
  import {
    BillGenBillParams,
    BillItem,
    BillSearchByCodeParams,
    BillSearchItem,
    BillSearchParams,
    changeBillStatus,
    exportBill,
    genBill,
    getBillListByPage,
    searchBillByCode,
  } from '@/api/finance/bill';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { getPickerDate } from '@/utils/dateUtil';
  import { useClientCodeList, useServiceList } from '@/hooks/select/useSelect';
  import { ClientItem, ServiceItem } from '@/api/sys';
  import { useMessage } from '@/hooks/web/useMessage';
  import { importDialogState, UploadApi } from '@/api/sys/upload';
  import { BasicTableColumn } from '@/components/Table';
  import { dateUtil } from '@/utils/dateUtil';

  const { createConfirm, createMessage, createBriefSuccessMsg } = useMessage();

  const props = defineProps({
    billType: {
      type: Number as PropType<1 | 2>,
      default: 1,
      required: true,
      validator: function (value: number) {
        return [1, 2].includes(value); // 1 客户 2 成本
      },
    },
  });

  const permissionRole = ref<string[]>([]);
  if (props.billType === 1) {
    permissionRole.value = ['finance:bill:client:operate'];
  } else {
    permissionRole.value = ['finance:bill:cost:operate'];
  }

  const form = reactive({
    clientCode: '',
    billsNumber: '',
    billStatus: '',
    dateRange: [],
    startBillsDate: '',
    endBillsDate: '',
  });
  const filterFormRef = ref();
  async function onSearch() {
    pageParams.pageNum = 1;
    await loadList();
  }
  async function onReset() {
    formResetFields(filterFormRef);
    await loadList();
  }

  const list = ref<BillItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    try {
      dataLoading.value = true;
      const params: BillSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
        billType: props.billType,
      };
      const { startTime, endTime } = getPickerDate(form.dateRange);
      form.startBillsDate = startTime;
      form.endBillsDate = endTime;

      form.clientCode && (params.clientCode = form.clientCode);
      form.billsNumber && (params.billsNumber = form.billsNumber);
      form.billStatus && (params.billStatus = form.billStatus);
      form.startBillsDate && (params.startBillsDate = form.startBillsDate);
      form.endBillsDate && (params.endBillsDate = form.endBillsDate);

      const { list: lists, total, pageNum } = await getBillListByPage(params);
      list.value = lists;
      pageParams.total = total;
      pageParams.pageNum = pageNum;
    } catch (e) {
      pageParams.total = 0;
      list.value = [];
      console.error(e);
    } finally {
      dataLoading.value = false;
    }
  }

  const batchSelectedBill = ref('');
  function onSelectTable(val) {
    batchSelectedBill.value = val.map((e) => e.billsNumber).join(',');
  }

  const importData = importDialogState(
    UploadApi.CostBill,
    'https://frontend-tms.obs.myhuaweicloud.com:443/import-template/cost-bill.xlsx',
  );
  async function onImportSuccess({ close }) {
    await loadList();
    close && close();
  }

  const pageParams = pageData();
  const onPageChange = (params: PageChangeParams) => {
    params.pageSize && (pageParams.pageSize = params.pageSize);
    params.pageNum && (pageParams.pageNum = params.pageNum);
    loadList();
  };

  const clientCodeList = ref<ClientItem[]>([]);
  const serviceList = ref<ServiceItem[]>([]);
  onMounted(async () => {
    if (props.billType === 1) {
      clientCodeList.value = await useClientCodeList();
    } else {
      serviceList.value = await useServiceList();
    }
    await loadList();
  });

  const dialogState = reactive({
    visible: false,
    confirmVisible: false,
    submitLoading: false,
    form: {
      enterpriseRecordIds: [],
      serviceProviderCodes: [],
      dateRange: [],
      startDate: '',
      endDate: '',
      billsDate: '',
    },
    rules: {
      billsDate: [{ required: true, message: '账单时间不能为空', trigger: 'change' }],
    },
    disabledDate(time) {
      return time.getTime() >= Date.now();
    },
  });
  const billSearchRules = {
    enterpriseRecordIds: [{ required: true, message: '客户代码不能为空', trigger: 'blur' }],
    serviceProviderCodes: [{ required: true, message: '服务商不能为空', trigger: 'blur' }],
    dateRange: [{ required: true, message: '时间不能为空', trigger: 'change' }],
  };
  const billGeneratorRef = ref();
  const searchDataLoading = ref(false);
  const billList = ref<BillSearchItem[]>([]);
  const billSelectList = ref<BillSearchItem[]>([]);
  function onDateChange() {
    billSelectList.value = [];
    billList.value = [];
  }
  async function onBillSearch() {
    await formValidate(billGeneratorRef);
    searchDataLoading.value = true;
    const { startTime, endTime } = getPickerDate(dialogState.form.dateRange);
    const enterpriseRecordIds = dialogState.form.enterpriseRecordIds.join(',');
    const serviceProviderCodes = dialogState.form.serviceProviderCodes.join(',');

    dialogState.form.startDate = startTime;
    dialogState.form.endDate = endTime;

    const params: BillSearchByCodeParams = {
      billType: props.billType,
      enterpriseRecordIds,
      serviceProviderCodes,
      startDate: startTime,
      endDate: endTime,
    };
    try {
      billList.value = await searchBillByCode(params);
    } catch (e) {
      console.error(e);
    } finally {
      searchDataLoading.value = false;
    }
  }
  function onBillTableSelect(val) {
    billSelectList.value = val;
  }

  async function onGenSubmit() {
    if (!unref(billSelectList).length) {
      return createMessage.info('请选择要生成账单的数据');
    }
    dialogState.confirmVisible = true;
  }
  const dialogLoading = ref(false);
  function onOpened() {
    formResetFields(billGeneratorRef);
    billList.value = [];
    dialogLoading.value = false;
  }
  const billRef = ref();
  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(billRef);
    showLoading();
    try {
      const enterpriseRecordIds = billSelectList.value.map((e) => e.enterpriseRecordId).join(',');
      const serviceProviderCodes = billSelectList.value.map((e) => e.serviceProviderCode).join(',');
      let { startDate, endDate, billsDate } = dialogState.form;
      const params: BillGenBillParams = {
        billType: props.billType,
        enterpriseRecordIds,
        serviceProviderCodes,
        startDate,
        endDate,
        billsDate: dateUtil(billsDate).endOf('date').format('YYYY-MM-DD HH:mm:ss'),
      };
      await genBill(params);
      await loadList();
      closeDialog();
      dialogState.visible = false;
      createBriefSuccessMsg('生成账单成功');
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading();
    }
  }
  function onClose() {
    formResetFields(billRef);
  }

  async function operate(type: 'add' | 'apply' | 'del' | 'batchImport', item?: BillItem) {
    const typeMap = {
      apply: { title: '确认', billStatus: '1', message: '是否确认该账单' },
      del: { title: '作废', billStatus: '2', message: '是否作废该账单' },
    };
    switch (type) {
      case 'apply':
      case 'del':
        createConfirm({
          title: typeMap[type].title + '账单',
          message: typeMap[type].message,
          type: 'info',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                await changeBillStatus({
                  billNumber: item!.billsNumber,
                  billStatus: typeMap[type].billStatus,
                });
                await loadList();
                createBriefSuccessMsg(`${typeMap[type].title}成功`);
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
          .then(() => {})
          .catch(() => {});
        break;
      case 'batchImport':
        importData.visible = true;
        break;
      case 'add':
        dialogLoading.value = true;
        dialogState.visible = true;
        break;
    }
  }

  const billColumns = ref<BasicTableColumn[]>([
    {
      label: '客户代码',
      prop: 'clientCode',
      formatter: (_row, _column, cellValue) => {
        return cellValue;
      },
    },
    {
      label: '客户名称',
      prop: 'clientName',
      formatter: (_row, _column, cellValue) => {
        return cellValue;
      },
    },
    {
      label: '金额',
      prop: 'actualAmount',
      formatter: (_row, _column, cellValue) => {
        return h('span', { class: 'text-publish' }, cellValue);
      },
    },
    {
      label: '截止时间',
      prop: 'endDate',
      formatter: (_row, _column, cellValue) => {
        return cellValue;
      },
    },
  ]);

  onActivated(() => {
    switch (props.billType) {
      case 1:
        unref(columns).splice(
          unref(columns).findIndex((e) => e.prop === 'clientCode'),
          1,
          {
            label: '客户代码',
            prop: 'clientCode',
            formatter: (_row, _column, cellValue) => {
              return cellValue;
            },
          },
        );
        unref(billColumns).splice(
          0,
          2,
          {
            label: '客户代码',
            prop: 'clientCode',
            formatter: (_row, _column, cellValue) => {
              return cellValue;
            },
          },
          {
            label: '客户名称',
            prop: 'clientName',
            formatter: (_row, _column, cellValue) => {
              return cellValue;
            },
          },
        );
        break;
      case 2:
        unref(columns).splice(
          unref(columns).findIndex((e) => e.prop === 'clientCode'),
          1,
          {
            label: '服务商代码',
            prop: 'clientCode',
            formatter: (_row, _column, cellValue) => {
              return cellValue;
            },
          },
        );
        unref(billColumns).splice(
          0,
          2,
          {
            label: '服务商代码',
            prop: 'serviceProviderCode',
            formatter: (_row, _column, cellValue) => {
              return cellValue;
            },
          },
          {
            label: '服务商名称',
            prop: 'serviceProviderCode',
            formatter: (_row, _column, cellValue) => {
              return cellValue;
            },
          },
        );
        break;
    }
  });
</script>
