<template>
  <div class="service-entry">
    <el-form ref="searchFormRef" inline size="small" :model="form" class="filter-form">
      <el-form-item label="结算对象" prop="objectCode">
        <el-input v-model="form.objectCode" placeholder="请输入结算对象代码" clearable />
      </el-form-item>
      <el-form-item label="汇款金额" prop="moneyStart">
        <el-input v-model="form.moneyStart" placeholder="汇款开始金额" clearable />
        <span class="mr-5 ml-5">至</span>
        <el-input v-model="form.moneyEnd" placeholder="汇款结束金额" clearable />
      </el-form-item>
      <el-form-item label="创建时间" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]"
        />
      </el-form-item>
      <el-form-item>
        <basic-filter-search @reset="onReset" @search="onSearch" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <import-button @click="onEntry">入账</import-button>
      <add-button @click="onExport">导出</add-button>
    </div>

    <el-table
      :data="list"
      size="small"
      border
      stripe
      ref="multipleTableRef"
      @selection-change="onTableSelect"
      v-loading="dataLoading"
    >
      <el-table-column
        v-for="(item, idx) in columns"
        :key="idx"
        :prop="item?.prop"
        :label="item?.label"
        :type="item?.type"
        :width="item?.width"
        :formatter="item?.formatter"
      />
      <el-table-column prop="operate" label="操作" width="60">
        <template #default="scope">
          <el-button
            v-if="scope.row.transactionStatus === 1"
            v-auth="['finance:entry:review']"
            type="text"
            size="small"
            @click="operate('review', scope.row)"
            >审核</el-button
          >
          <el-button v-else type="text" size="small" @click="operate('info', scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <basic-pagination
      :current="pageParams.pageNum"
      :size="pageParams.pageSize"
      :total="pageParams.total"
      @page-change="onPageChange"
    />

    <basic-dialog @submit="onSubmit" title="新建入账" width="780px" v-model="entryDialogVisible">
      <el-form size="small" :model="dialogForm" :rules="rules" label-width="120px" ref="entryRef">
        <div>
          <h5 class="text-lg">基本信息</h5>
          <div class="*flex-btc mt-10px">
            <div class="flex-1">
              <el-form-item label="结算对象类型：">{{ settlementMap[2] }}</el-form-item>
              <div v-show="otherShow" v-loading="otherShowLoading">
                <el-form-item label="对象名称：">{{ clientInfo.objectName || '/' }}</el-form-item>
                <el-form-item label="结算币种：">{{ clientInfo.currency || '/' }}</el-form-item>
              </div>
            </div>
            <div class="flex-1">
              <el-form-item :label="`${settlementMap[2]}代码：`">
                <el-select
                  :model-value="dialogForm.objectCode"
                  @change="onCodeChange"
                  placeholder="请选择"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="(item, idx) in selectCodeData"
                    :key="idx"
                    :value="item.clientCode"
                    :label="item.clientCode"
                  />
                </el-select>
              </el-form-item>
              <div v-show="otherShow" v-loading="otherShowLoading">
                <el-form-item label="公司名称：">{{ clientInfo.companyName || '/' }}</el-form-item>
                <el-form-item label="当前余额：">{{ clientInfo.accountBalance }}</el-form-item>
              </div>
            </div>
          </div>
        </div>
        <div v-show="otherShow" v-loading="otherShowLoading">
          <p class="text-lg"> 付款信息 </p>
          <div class="mt-10px">
            <el-form-item label="交易方式" prop="dealType">
              <el-radio-group v-model="dialogForm.dealType">
                <el-radio :label="1">汇款</el-radio>
                <el-radio :label="2">账单差异</el-radio>
                <el-radio :label="3">赔付</el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="*flex-btc">
              <div class="flex-1">
                <el-form-item label="我方账号:" prop="bankName">
                  <el-select
                    :model-value="dialogForm.bankName"
                    @change="onBankChange"
                    placeholder="请选择"
                    filterable
                    clearable
                  >
                    <el-option
                      v-for="(item, idx) in bankList"
                      :key="idx"
                      :value="item.bankAccount"
                      :label="item.bankName"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="币种选择:" prop="currency">
                  <el-select placeholder="请选择收费币种" v-model="dialogForm.currency" clearable>
                    <el-option
                      v-for="item in currencyList"
                      :key="item.currencyId"
                      :label="`${item.currencySymbol}${item.currencyName}(${item.exchangeRate})`"
                      :value="item.currencySymbol"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <div class="flex-1">
                <el-form-item label="金额:" prop="money">
                  <el-input v-model="dialogForm.money" placeholder="请输入金额" />
                </el-form-item>
                <el-form-item label="付款日期:" prop="paymentDate">
                  <el-date-picker type="date" v-model="dialogForm.paymentDate" placeholder="请选择付款日期" />
                </el-form-item>
              </div>
            </div>
            <el-form-item label="备注">
              <el-input
                v-model="dialogForm.submitRemark"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入备注"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </basic-dialog>

    <basic-dialog :showFooter="false" width="950px" v-model="entryPreviewVisible" title="详细">
      <el-form size="small">
        <div>
          <h5 class="text-xl">基本资料</h5>
          <div class="flex mt-10px">
            <div class="flex-1">
              <el-form-item label="结算对象：">{{ entryData.objectCode }}</el-form-item>
              <el-form-item label="状态：">已入账</el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="结算对象类型：">服务商</el-form-item>
              <el-form-item label="创建人：">{{ entryData.createBy }}</el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="公司名称：">{{ entryData.companyName }}</el-form-item>
              <el-form-item label="创建日期：">
                {{ formatToDate(entryData.createTime, 'YYYY-MM-DD') }}
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="流水号：">
                <span class="text-overflow">{{ entryData.serialNumber }}</span>
              </el-form-item>
              <el-form-item label="付款时间：">
                {{ formatToDate(entryData.paymentDate, 'YYYY-MM-DD') }}
              </el-form-item>
            </div>
          </div>
        </div>
        <div>
          <h5 class="text-xl">我方付款信息</h5>
          <div class="flex mt-10px">
            <el-form-item class="flex-1" label="支行名称：">{{ entryData.bankName }}</el-form-item>
            <el-form-item class="flex-1" label="账号：">{{ entryData.bankAccount }}</el-form-item>
          </div>
        </div>
        <div>
          <h5 class="text-xl">付款金额</h5>
          <div class="flex mt-10px">
            <el-form-item class="flex-1" label="金额：">{{ entryData.money }}</el-form-item>
            <el-form-item class="flex-1" label="币种：">{{ entryData.currency }}</el-form-item>
            <el-form-item class="flex-1" label="备注：">{{ entryData.submitRemark || '/' }}</el-form-item>
          </div>
        </div>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, h, onMounted, reactive, Ref, ref, unref } from 'vue';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { getPickerDate, formatToDate } from '@/utils/dateUtil';
  import { clientBaseInfo, entryOperate, getBankList, getServiceBaseList } from '@/api/finance/base';
  import { useCurrencyList, useEntryClientList } from '@/hooks/select/useSelect';
  import { CurrencyItem, EntryClientItem } from '@/api/sys';
  import { BankListItem, ServiceBaseListItem } from '@/api/finance/base/model/serviceModel';
  import { useMessage } from '@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { jsonToSheetXlsx } from '@/components/Excel';
  export default defineComponent({
    name: 'ServiceBase',
    setup() {
      const dealTypeList = ['汇款', '账单差异', '赔付'];
      const columns = [
        {
          type: 'selection',
          width: 50,
        },
        {
          label: '基本信息',
          prop: 'baseInfo',
          formatter: (row) => {
            return h('div', {}, [
              h('p', {}, `结算对象代码: ${row.objectCode}`),
              h('p', {}, `结算对象名称: ${row.objectName}`),
              h('p', {}, `公司名称: ${row.companyName || '/'}`),
            ]);
          },
        },
        {
          label: '交易信息',
          prop: 'transactionInfo',
          formatter: (row) => {
            return h('p', {}, `流水号: ${row.serialNumber}`);
          },
        },
        {
          label: '费用信息',
          prop: 'feeInfo',
          width: 200,
          formatter: (row) => {
            return h('div', {}, [
              h('p', {}, `金额: ${row.money} (${row.currency})`),
              h('p', {}, `实收金额: ${row.practicalMoney}`),
              h('p', {}, `交易方式: ${dealTypeList[row.dealType - 1]}`),
            ]);
          },
        },
        {
          label: '状态',
          prop: 'transactionStatus',
          width: 80,
          formatter: () => {
            return h(
              'span',
              {
                class: 'text-active',
              },
              '已入账',
            );
          },
        },
        {
          label: '我方账号',
          prop: 'ourAccount',
          formatter: (row) => {
            return h('div', {}, [h('p', {}, `银行名称: ${row.bankName}`), h('p', {}, `银行账号: ${row.bankAccount}`)]);
          },
        },
        {
          label: '付款备注',
          prop: 'submitRemark',
          formatter: (row) => {
            return row.submitRemark;
          },
        },
        {
          label: '操作时间',
          prop: 'operateDate',
          width: 200,
          formatter: (row) => {
            return h('div', {}, [h('p', {}, `创建: ${row.createTime}`), h('p', {}, `付款: ${row.paymentDate}`)]);
          },
        },
      ];
      const list = ref<ServiceBaseListItem[]>([]);
      const pageParams = pageData();
      const form = reactive({
        objectCode: '',
        moneyStart: '',
        moneyEnd: '',
        dateRange: [],
        createTimeStart: '',
        createTimeEnd: '',
      });
      const { createBriefSuccessMsg, createMessage } = useMessage();

      const dialogForm = reactive({
        objectCode: '', // 结算对象代码
        dealType: '', // 交易类型
        bankName: '', // 银行名称
        bankAccount: '', // 银行账号
        money: '', // 金额
        currency: '', // 币种选择
        paymentDate: '', // 付款日期
        invoiceNumber: '', // 发票号
        transactionNumber: '', // 交易号 //客户才有
        submitRemark: '', // 备注
        accessoryUrl: '', // 附件地址
        pictureUrl: '', // 图片地址
      });
      const dataLoading = ref(false);
      const entryDialogVisible = ref(false);
      const entryPreviewVisible = ref(false);
      const entryData = ref({}) as Ref<{
        objectCode: string;
        createBy: string;
        companyName: string;
        createTime: string;
        serialNumber: string;
        paymentDate: string;
        bankName: string;
        bankAccount: string;
        money: string;
        currency: string;
        submitRemark: string;
      }>;
      const searchFormRef = ref();
      const selectData = ref([]);
      const selectCodeData = ref<EntryClientItem[]>([]); // 选择客户/服务商代码列表
      const currencyList = ref<CurrencyItem[]>([]); // 币种列表
      const bankList = ref<BankListItem[]>([]); // 银行列表
      const entryRef = ref();
      const onTableSelect = (val) => {
        (selectData.value as any) = [...val];
      };
      const rules = {
        dealType: [{ required: true, message: '交易类型不能为空', trigger: 'change' }],
        bankName: [{ required: true, message: '银行不能为空', trigger: 'change' }],
        currency: [{ required: true, message: '币种不能为空', trigger: 'change' }],
        money: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
        paymentDate: [{ required: true, message: '付款日期不能为空', trigger: 'change' }],
      };

      const onCodeChange = async (val) => {
        try {
          otherShowLoading.value = true;
          const data = await clientBaseInfo(val, 2);
          (clientInfo.value as any) = data;
          otherShow.value = true;
          dialogForm.objectCode = val;
          formResetFields(entryRef);
        } catch (e) {
          console.error(e);
        } finally {
          otherShowLoading.value = false;
        }
      };

      const onBankChange = async (val) => {
        const { bankName, bankAccount } = bankList.value.find((e) => e.bankAccount === val) as any;
        dialogForm.bankName = bankName;
        dialogForm.bankAccount = bankAccount;
      };

      const settlementMap = {
        1: '客户',
        2: '服务商',
      };
      const otherShowLoading = ref(false);
      const otherShow = ref(false);
      const clientInfo = ref({
        accountBalance: '', // 账户余额
        companyName: '', // 公司名称
        currency: '', // 币种
        objectCode: '', // 对象代码
        objectName: '', // 对象名称
      });
      const multipleTableRef = ref();
      const onSubmit = async ({ showLoading, closeLoading }) => {
        await formValidate(entryRef);
        showLoading && showLoading();
        try {
          const params = {
            settlementObject: 2,
            ...clientInfo.value,
            ...dialogForm,
          };
          await entryOperate(params as any);
          await loadList();
          createBriefSuccessMsg('入账成功');
          entryDialogVisible.value = false;
          closeLoading && closeLoading();
        } catch (e) {
          closeLoading && closeLoading();
          console.error(e);
        }
      };
      const onExport = () => {
        if (!selectData.value.length) {
          return createMessage.info('请选择后再导出');
        }
        const exportData = cloneDeep(unref(selectData));
        const data = exportData
          .map((e: any) => {
            e.baseInfo = `结算对象代码: ${e.objectCode} 结算对象名称: ${e.objectName} 公司名称: ${
              e.companyName || '/'
            }`;
            e.feeInfo = `金额: ${e.money}(${e.currency}) 实收金额: ${e.practicalMoney} 交易方式: ${
              dealTypeList[e.dealType - 1]
            }`;
            e.transactionInfo = `流水号: ${e.serialNumber}`;
            e.transactionStatus = '已入账';
            e.ourAccount = `银行名称: ${e.bankName} 银行账号: ${e.bankAccount}`;
            e.operateDate = `创建: ${e.createTime} 付款: ${e.paymentDate}`;
            return e;
          })
          .map((item: any) => ({
            baseInfo: item.baseInfo,
            transactionInfo: item.transactionInfo,
            operateDate: item.operateDate,
            ourAccount: item.ourAccount,
            transactionStatus: item.transactionStatus,
            feeInfo: item.feeInfo,
            submitRemark: item.submitRemark,
          }));
        jsonToSheetXlsx({
          data: data,
          header: {
            baseInfo: '基本信息',
            transactionInfo: '交易信息',
            feeInfo: '费用信息',
            transactionStatus: '状态',
            ourAccount: '我方账号',
            submitRemark: '付款备注',
            operateDate: '操作时间',
          },
          filename: `服务商入账列表数据_${+new Date()}.xlsx`,
          json2sheetOpts: {
            header: [],
          },
        });
        multipleTableRef.value.clearSelection();
      };

      const onEntry = () => {
        entryDialogVisible.value = true;
        otherShow.value = false;
        dialogForm.objectCode = '';
        formResetFields(entryRef);
      };

      const operate = async (_, item) => {
        entryPreviewVisible.value = true;
        entryData.value = item;
      };

      const loadList = async () => {
        try {
          const { startTime: createTimeStart, endTime: createTimeEnd } = getPickerDate(form.dateRange);
          form.createTimeStart = createTimeStart || '';
          form.createTimeEnd = createTimeEnd || '';
          const params = {
            settlementObject: 2,
            pageNum: pageParams.pageNum,
            pageSize: pageParams.pageSize,
            objectCode: form.objectCode || '',
            createTimeStart: form.createTimeStart,
            createTimeEnd: form.createTimeEnd,
            moneyStart: form.moneyStart || '',
            moneyEnd: form.moneyEnd || '',
          };
          dataLoading.value = true;
          const { list: _list, pageNum, pageSize, total } = await getServiceBaseList(params);
          list.value = _list;
          pageParams.pageSize = pageSize;
          pageParams.total = total;
          pageParams.pageNum = pageNum;
        } catch (e) {
          console.error(e);
          list.value = [];
          pageParams.total = 0;
        } finally {
          dataLoading.value = false;
        }
      };

      const onReset = () => {
        formResetFields(searchFormRef);
        form.moneyEnd = '';
        loadList();
      };

      const onSearch = () => {
        pageParams.pageNum = 1;
        loadList();
      };

      const onPageChange = (params: PageChangeParams) => {
        params.pageSize && (pageParams.pageSize = params.pageSize);
        params.pageNum && (pageParams.pageNum = params.pageNum);
        loadList();
      };

      const loadSelectData = async () => {
        selectCodeData.value = await useEntryClientList(2);
        bankList.value = await getBankList();
        currencyList.value = await useCurrencyList();
      };

      onMounted(async () => {
        await loadList();
        await loadSelectData();
      });

      return {
        columns,
        list,
        pageParams,
        form,
        dataLoading,
        entryDialogVisible,
        entryPreviewVisible,
        entryData,
        searchFormRef,
        settlementMap,
        otherShow,
        otherShowLoading,
        clientInfo,
        rules,
        selectCodeData,
        currencyList,
        bankList,
        dialogForm,
        entryRef,
        multipleTableRef,

        onPageChange,
        onBankChange,
        onCodeChange,
        onSearch,
        onReset,
        onTableSelect,
        operate,
        onEntry,
        onSubmit,
        onExport,
        formatToDate,
      };
    },
  });
</script>
