<template>
  <div class="client">
    <el-form ref="searchFormRef" inline size="small" :model="form" class="filter-form">
      <el-form-item label="客户代码" prop="objectCode">
        <el-select placeholder="请选择客户代码" filterable clearable v-model="form.objectCode">
          <el-option
            v-for="item in selectDataList.clientCodeList"
            :key="item.clientCode"
            :label="`${item.clientCode}[${item.companyName}]`"
            :value="item.clientCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="汇款金额" prop="moneyStart">
        <el-input v-model="form.moneyStart" placeholder="汇款开始金额" clearable />
        <span class="mr-5px ml-5px">至</span>
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

    <el-tabs v-model="transactionStatus" type="card" @tab-click="onStatusTabClick">
      <el-tab-pane
        v-for="item in [{ id: 666, label: '全部', value: '', name: 'all' }, ...transactionStatusList]"
        :key="item.id"
        :label="item.label"
        :name="item.name"
      />
    </el-tabs>

    <el-table
      :data="list"
      size="small"
      border
      stripe
      @selection-change="onTableSelect"
      v-loading="dataLoading"
      ref="multipleTableRef"
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

    <basic-dialog @close="closeDialog" @submit="onSubmit" v-model="entryDialogVisible" width="780px" title="新建入账">
      <el-form size="small" :model="dialogForm" :rules="rules" label-width="120px" ref="entryRef">
        <div>
          <h5 class="text-lg">基本信息</h5>
          <div class="*flex-btc mt-10px">
            <div class="flex-1">
              <el-form-item label="结算对象类型：">{{ settlementMap[1] }}</el-form-item>
              <div v-show="otherShow" v-loading="otherShowLoading">
                <el-form-item label="对象名称：">{{ clientInfo.objectName || '/' }}</el-form-item>
                <el-form-item label="结算币种：">{{ clientInfo.currency || '/' }}</el-form-item>
              </div>
            </div>
            <div class="flex-1">
              <el-form-item :label="`${settlementMap[1]}代码：`">
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
          <h5 class="text-lg">
            <span>收款信息</span>
          </h5>
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
                <el-form-item label="图片上传:">
                  <el-upload
                    ref="pictureUploadRef"
                    :action="UploadApi.CommonUpload"
                    :headers="commonHeaders"
                    :class="[imgUploadHideVisible && 'hide-upload']"
                    list-type="picture-card"
                    accept="image/*"
                    :on-change="onPictureChange"
                    :on-progress="onPictureProgress"
                    :on-success="onPictureSuccess"
                    :on-preview="onPictureCardPreview"
                    :on-remove="onPictureRemove"
                  >
                    <el-icon><plus /></el-icon>
                    <template #tip>
                      <div class="text-sm">请选择图片上传</div>
                    </template>
                  </el-upload>
                  <el-dialog v-model="imgPreviewVisible" title="图片预览" custom-class="common-dialog">
                    <img style="width: 100%" :src="imgPreviewUrl" alt="" />
                  </el-dialog>
                </el-form-item>
              </div>
              <div class="flex-1">
                <el-form-item label="金额:" prop="money">
                  <el-input v-model="dialogForm.money" placeholder="请输入金额" />
                </el-form-item>
                <el-form-item label="付款日期:" prop="paymentDate">
                  <el-date-picker type="date" v-model="dialogForm.paymentDate" placeholder="请选择付款日期" />
                </el-form-item>
                <el-form-item label="附件上传:">
                  <el-upload
                    ref="fileUploadRef"
                    :action="UploadApi.CommonUpload"
                    :headers="commonHeaders"
                    :on-success="onFileSuccess"
                    :limit="1"
                    :on-remove="onFileRemove"
                    :on-exceed="onFileExceed"
                  >
                    <import-button szie="mini" round class="import-btn">选择附件</import-button>
                    <template #tip>
                      <div class="text-sm">请选择附件</div>
                    </template>
                  </el-upload>
                </el-form-item>
              </div>
            </div>
            <div class="flex">
              <div class="flex-1">
                <el-form-item label="发票号:">
                  <el-input v-model="dialogForm.invoiceNumber" placeholder="请输入发票号" />
                </el-form-item>
              </div>
              <div class="flex-1">
                <el-form-item label="交易号：">
                  <el-input v-model="dialogForm.transactionNumber" placeholder="请输入交易号" />
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

    <basic-dialog
      @opened="onOpen"
      @close="onClose"
      width="880px"
      submitText="确认入账"
      @submit="submit"
      :showFooter="isEntryReview"
      v-model="entryReviewVisible"
      title="详细"
    >
      <el-form :rules="entryRules" size="small" :model="entryForm" label-width="110px" ref="entryReviewRef">
        <div>
          <h5 class="text-lg">基本资料</h5>
          <div class="flex mt-10px">
            <div class="flex-1">
              <el-form-item label="结算对象：">{{ entryData.objectCode }}</el-form-item>
              <el-form-item label="状态：">
                {{ statusList[entryData.transactionStatus - 1] }}
              </el-form-item>
              <el-form-item label="审核人：" v-if="!isEntryReview">
                {{ entryData.updateBy }}
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="结算对象类型：">客户</el-form-item>
              <el-form-item label="创建人：">{{ entryData.createBy || '/' }}</el-form-item>
              <el-form-item label="审核时间：" v-if="!isEntryReview">
                {{ formatToDate(entryData.updateTime) }}
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="公司名称：">{{ entryData.companyName || '/' }}</el-form-item>
              <el-form-item label="创建日期：">
                {{ formatToDate(entryData.createTime) }}
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="交易号：">{{ entryData.transactionNumber || '/' }}</el-form-item>
              <el-form-item label="付款时间：">
                {{ formatToDate(entryData.paymentDate) }}
              </el-form-item>
            </div>
          </div>
        </div>
        <div>
          <h5 class="text-lg">付款方信息</h5>
          <div class="flex mt-10px">
            <el-form-item class="flex-1" label="实际付款人：">
              {{ entryData.objectName }}
            </el-form-item>
            <el-form-item class="flex-1" label="图片：">
              <template v-if="entryData.pictureUrl">
                <el-image
                  fit="contain"
                  style="width: 120px; height: 100%"
                  :src="entryData.pictureUrl"
                  :preview-src-list="[entryData.pictureUrl]"
                >
                  <template #placeholder>
                    <div class="image-slot"> 加载中<span class="dot">...</span> </div>
                  </template>
                </el-image>
              </template>
              <template v-else>/</template>
            </el-form-item>
            <el-form-item class="flex-1" label="附件下载：">
              <template v-if="entryData.accessoryUrl">
                <a :href="entryData.accessoryUrl" target="_blank" class="text-active" rel="noopener noreferrer">
                  文件下载
                </a>
              </template>
              <template v-else>/</template>
            </el-form-item>
            <el-form-item class="flex-1" label="入账备注：">
              {{ entryData.submitRemark || '/' }}
            </el-form-item>
          </div>
        </div>
        <div>
          <h5 class="text-lg">我方收款信息</h5>
          <div class="flex">
            <el-form-item class="flex-1" label="支行名称：">{{ entryData.bankName }}</el-form-item>
            <el-form-item class="flex-1" label="账号：">{{ entryData.bankAccount }}</el-form-item>
          </div>
        </div>
        <div>
          <h5 class="text-lg">收款金额</h5>
          <div class="flex mt-10px">
            <div class="flex-1">
              <el-form-item label="金额：">
                <el-input :model-value="entryData.money" disabled>
                  <template #suffix>
                    <span class="pl-5px pr-5px">{{ entryData.currency }}</span>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="到账备注：" prop="affirmRemark">
                <el-input
                  v-model="entryForm.affirmRemark"
                  :disabled="!isEntryReview"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="请输入备注"
                />
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="已付金额：" prop="practicalMoney">
                <el-input v-model="entryForm.practicalMoney" placeholder="请输入已付金额" :disabled="!isEntryReview">
                  <template #suffix>
                    <span class="pl-5px pr-5px">{{ entryData.currency }}</span>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="到账留言：" prop="affirmRemark">
                <el-input
                  v-model="entryForm.leaveWord"
                  :disabled="!isEntryReview"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="请输入留言"
                />
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <template #centerFooter>
        <danger-button @click="onInvalidate">作 废</danger-button>
      </template>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, h, onMounted, reactive, Ref, ref, unref } from 'vue';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import {
    clientBaseInfo,
    entryInvalidate,
    entryOperate,
    entryReview,
    getBankList,
    getClientBaseList,
  } from '@/api/finance/base';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { formatToDate, getPickerDate } from '@/utils/dateUtil';
  import { useClientCodeList, useCurrencyList, useEntryClientList } from '@/hooks/select/useSelect';
  import { ClientItem, CurrencyItem, EntryClientItem } from '@/api/sys';
  import { getToken } from '@/utils/auth';
  import { useMessage } from '@/hooks/web/useMessage';
  import { BankListItem } from '@/api/finance/base/model/serviceModel';
  import { Plus } from '@element-plus/icons-vue';
  import { cloneDeep } from 'lodash-es';
  import { jsonToSheetXlsx } from '@/components/Excel';
  import { ClientBaseListItem } from '@/api/finance/base/model/clientModel';
  import { UploadApi } from '@/api/sys/upload';

  export default defineComponent({
    name: 'ClientBase',
    components: {
      Plus,
    },
    setup() {
      const dealTypeList = ['汇款', '账单差异', '赔付'];
      const statusList = ['已付款', '已入账', '作废'];
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
            return h('div', {}, [
              h('p', {}, `流水号: ${row.serialNumber || '/'}`),
              h('p', {}, `发票号: ${row.serialNumber || '/'}`),
              h('p', {}, `交易号: ${row.transactionNumber || '/'}`),
            ]);
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
          width: 100,
          formatter: (row) => {
            const value = [...transactionStatusList.map((e) => e.label)][row.transactionStatus - 1];
            const stateClass = ['', 'text-active', 'text-delete'][row.transactionStatus - 1];
            return h('span', { class: stateClass }, value);
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
          label: '入账备注',
          prop: 'submitRemark',
          formatter: (row) => {
            return row.submitRemark || '/';
          },
        },
        {
          label: '到账备注',
          prop: 'affirmRemark',
          formatter: (row) => {
            return row.affirmRemark || '/';
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
      const list = ref<ClientBaseListItem[]>([]);
      const selectCodeData = ref<EntryClientItem[]>([]); // 选择客户/服务商代码列表

      const pageParams = pageData();
      const otherShow = ref(false);
      const entryForm = reactive({
        practicalMoney: '', // 实收金额
        affirmRemark: '', // 确认备注
        leaveWord: '', // 留言
      });
      const isEntryReview = ref(false);
      const form = reactive({
        transactionStatus: '',
        objectCode: '',
        moneyStart: '',
        moneyEnd: '',
        dateRange: [],
        startTime: '',
        endTime: '',
      });
      const imgUploadHideVisible = ref(false);
      const fileUploadRef = ref();
      const commonHeaders = {
        Authorization: 'Bearer ' + getToken(),
      };
      const imgPreviewUrl = ref('');
      const imgPreviewVisible = ref(false);
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
      const otherShowLoading = ref(false);
      const searchForm = ref({});
      const clientInfo = ref({
        accountBalance: '', // 账户余额
        companyName: '', // 公司名称
        currency: '', // 币种
        objectCode: '', // 对象代码
        objectName: '', // 对象名称
      });
      // select下拉数据
      const selectDataList = reactive<{
        clientCodeList: ClientItem[];
      }>({
        clientCodeList: [],
      });
      const currencyList = ref<CurrencyItem[]>([]); // 币种列表
      const bankList = ref<BankListItem[]>([]); // 银行列表
      const settlementMap = {
        1: '客户',
        2: '服务商',
      };
      const pictureUploadRef = ref();
      const transactionStatus = ref('all');
      const dataLoading = ref(true);
      const entryDialogVisible = ref(false);
      const entryReviewVisible = ref(false);
      const entryData = ref({}) as Ref<{
        objectCode: string;
        createBy: string;
        companyName: string;
        createTime: string;
        serialNumber: string;
        paymentDate: string;
        bankName: string;
        bankAccount: string;
        currency: string;
        submitRemark: string;
        transactionNumber: number;
        objectName: string;
        pictureUrl: string;
        accessoryUrl: string;
        updateBy: string;
        updateTime: string;
        transactionStatus: any;
        money: string;
        practicalMoney: string;
        leaveWord: string;
        affirmRemark: string;
        id: number;
      }>; // 入账后的数据 item
      const searchFormRef = ref();
      const transactionStatusList = [
        {
          id: 1,
          label: '已付款',
          value: '1',
          name: 'paid',
        },
        {
          id: 2,
          label: '已入账',
          value: '2',
          name: 'recorded',
        },
        {
          id: 3,
          label: '作废',
          value: '3',
          name: 'invalid',
        },
      ];
      const selectData = ref([]);
      const entryRef = ref();
      const rules = {
        dealType: [{ required: true, message: '交易类型不能为空', trigger: 'change' }],
        bankName: [{ required: true, message: '银行不能为空', trigger: 'change' }],
        currency: [{ required: true, message: '币种不能为空', trigger: 'change' }],
        money: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
        paymentDate: [{ required: true, message: '付款日期不能为空', trigger: 'change' }],
      };
      const entryRules = {
        practicalMoney: [
          {
            required: true,
            validator: (_, value, callback) => {
              if (value === '') {
                callback(new Error('到账额度不能为空'));
              } else if (isNaN(value)) {
                callback(new Error('输入格式有误'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      };
      const { createBriefSuccessMsg, createConfirm, createMessage } = useMessage();

      const onBankChange = async (val) => {
        const { bankName, bankAccount } = bankList.value.find((e) => e.bankAccount === val) as any;
        dialogForm.bankName = bankName;
        dialogForm.bankAccount = bankAccount;
      };
      const entryReviewRef = ref();

      const onClose = () => {
        formResetFields(entryReviewRef);
        entryReviewVisible.value = false;
      };

      const closeDialog = () => {
        formResetFields(entryRef);
        entryDialogVisible.value = false;
      };

      const onPictureSuccess = (response) => {
        dialogForm.pictureUrl = response.data;
      };

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

      const submit = async () => {
        await formValidate(entryReviewRef);
        try {
          const { id } = entryData.value;
          await entryReview({ id, ...entryForm });
          createBriefSuccessMsg('入账成功');
          await loadList();
          entryReviewVisible.value = false;
        } catch (e) {
          console.error(e);
        }
      };

      const onInvalidate = async () => {
        createConfirm({
          title: '提示',
          message: `请确认是否作废该入账`,
          type: 'info',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                await entryInvalidate(entryData.value.id);
                createBriefSuccessMsg('作废成功');
                await loadList();
                entryReviewVisible.value = false;
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
      };

      const onPictureCardPreview = (file) => {
        imgPreviewUrl.value = file.url;
        imgPreviewVisible.value = true;
      };

      const onPictureRemove = (_, fileList) => {
        imgUploadHideVisible.value = fileList.length >= 1;
      };

      const onPictureProgress = (_, file, fileList) => {
        const isImage =
          file.raw.type === 'image/png' ||
          file.raw.type === 'image/jpg' ||
          file.raw.type === 'image/jpeg' ||
          file.raw.type === 'image/bmp' ||
          file.raw.type === 'image/webp';

        if (!isImage) {
          pictureUploadRef.value && pictureUploadRef.value.clearFiles();
          pictureUploadRef.value && pictureUploadRef.value.abort();
        } else {
          imgUploadHideVisible.value = fileList.length >= 1;
        }
      };

      const onPictureChange = (file) => {
        const isImage =
          file.raw.type === 'image/png' ||
          file.raw.type === 'image/jpg' ||
          file.raw.type === 'image/jpeg' ||
          file.raw.type === 'image/bmp' ||
          file.raw.type === 'image/webp';

        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isImage) {
          createMessage.error('上传的格式不正确!');
        }
        if (!isLt10M) {
          createMessage.error('上传图片大小不能超过 10MB!');
        }
      };

      const onCodeChange = async (val) => {
        try {
          otherShowLoading.value = true;
          (clientInfo.value as any) = await clientBaseInfo(val, 1);
          otherShow.value = true;
          dialogForm.objectCode = val;
          formResetFields(entryRef);
          pictureUploadRef.value && pictureUploadRef.value.clearFiles();
          fileUploadRef.value && fileUploadRef.value.clearFiles();
          imgUploadHideVisible.value = false;
        } catch (e) {
          console.error(e);
        } finally {
          otherShowLoading.value = false;
        }
      };

      const loadList = async () => {
        try {
          const { startTime, endTime } = getPickerDate(form.dateRange);
          form.startTime = startTime;
          form.endTime = endTime;
          const params = {
            settlementObject: 1,
            pageNum: pageParams.pageNum,
            pageSize: pageParams.pageSize,
            objectCode: form.objectCode,
            createTimeStart: form.startTime || '',
            createTimeEnd: form.endTime || '',
            moneyStart: form.moneyStart || '',
            moneyEnd: form.moneyEnd || '',
            transactionStatus: form.transactionStatus,
          };
          dataLoading.value = true;
          const { list: _list, pageNum, pageSize, total } = await getClientBaseList(params);
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

      const onFileSuccess = (response) => {
        dialogForm.accessoryUrl = response.data;
      };

      const onFileRemove = () => {
        dialogForm.accessoryUrl = '';
      };
      const onFileExceed = () => {
        createMessage.info('一次只能上传一个附件');
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

      const onTableSelect = (val) => {
        (selectData.value as any) = [...val];
      };

      const onStatusTabClick = ({ props }) => {
        const value = transactionStatusList.find((e) => e.name === props.name)?.value;
        const val = value ? +value : ' ';
        form.transactionStatus = val as any;
        onSearch();
      };

      const onEntry = () => {
        entryDialogVisible.value = true;
        formResetFields(entryRef);
        dialogForm.objectCode = '';
        otherShow.value = false;
      };

      const multipleTableRef = ref();

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
          filename: `客户入账列表数据_${+new Date()}.xlsx`,
          json2sheetOpts: {
            header: [],
          },
        });
        multipleTableRef.value.clearSelection();
      };

      const operate = async (type, item) => {
        isEntryReview.value = type === 'review';
        entryReviewVisible.value = true;
        entryData.value = { ...item };
      };

      const onOpen = () => {
        if (isEntryReview.value) {
          entryForm.practicalMoney = entryData.value.money;
        } else {
          entryForm.affirmRemark = entryData.value.affirmRemark || '/';
          entryForm.leaveWord = entryData.value.leaveWord || '/';
          entryForm.practicalMoney = entryData.value.money;
        }
      };

      onMounted(async () => {
        await loadList();
        bankList.value = await getBankList();
        currencyList.value = await useCurrencyList();
        selectDataList.clientCodeList = await useClientCodeList();
        selectCodeData.value = await useEntryClientList(1);
      });

      return {
        UploadApi,
        columns,
        list,
        pageParams,
        form,
        searchForm,
        dataLoading,
        entryDialogVisible,
        entryReviewVisible,
        selectData,
        searchFormRef,
        pictureUploadRef,
        transactionStatus,
        transactionStatusList,
        clientInfo,
        selectDataList,
        settlementMap,
        imgUploadHideVisible,
        otherShow,
        otherShowLoading,
        dialogForm,
        imgPreviewVisible,
        imgPreviewUrl,
        bankList,
        entryRef,
        currencyList,
        commonHeaders,
        rules,
        selectCodeData,
        multipleTableRef,
        entryForm,
        entryData,
        entryRules,
        formatToDate,
        isEntryReview,
        entryReviewRef,
        statusList,

        onEntry,
        submit,
        onReset,
        onPictureSuccess,
        onSubmit,
        onFileSuccess,
        onPictureChange,
        onOpen,
        onCodeChange,
        onBankChange,
        onSearch,
        onExport,
        onStatusTabClick,
        onTableSelect,
        onPageChange,
        operate,
        onFileRemove,
        onFileExceed,
        onPictureProgress,
        onPictureCardPreview,
        onPictureRemove,
        onClose,
        onInvalidate,
        closeDialog,
      };
    },
  });
</script>
