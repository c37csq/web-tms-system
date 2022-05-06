<template>
  <div class="adjust-bill">
    <el-form size="small" inline class="filter-form" :model="form" ref="filterFormRef">
      <el-form-item label="客户代码" prop="clientCode">
        <el-select placeholder="请选择客户代码" filterable clearable v-model="form.clientCode">
          <el-option
            v-for="item in clientCodeList"
            :key="item.clientCode"
            :label="`${item.clientCode}[${item.companyName}]`"
            :value="item.clientCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务编号" prop="businessNumber">
        <el-input placeholder="请输入业务编号" v-model="form.businessNumber" clearable />
      </el-form-item>
      <el-form-item label="创建时间" prop="dateRange">
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
      <import-button
        v-auth="['bill:adjustment:review']"
        :disabled="!selectList.length || !canBatchBtnClick"
        @click="operate('audit')"
      >
        批量审核
      </import-button>
    </div>

    <div class="flex *flex-btc items-center">
      <el-tabs v-model="tabActive" type="card" @tab-click="onTabClick">
        <el-tab-pane v-for="item in tabList" :key="item.id" :label="item.label" :name="item.name" />
      </el-tabs>
    </div>

    <el-table :data="list" v-loading="dataLoading" size="small" border stripe @selection-change="onSelectTable">
      <el-table-column type="selection" width="50" />
      <el-table-column label="客户代码" prop="cilentCode" />
      <el-table-column label="业务编号" prop="businessNumber" />
      <el-table-column label="币种" prop="currency" />
      <el-table-column label="金额" prop="money" />
      <el-table-column label="状态">
        <template #default="{ row }">
          <transaction-status-text :status="row.transactionStatus" />
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="submitRemark" />
      <el-table-column label="创建信息" width="240">
        <template #default="{ row }">
          <p>创建人：{{ row.createBy }}</p>
          <p>创建时间：{{ row.createTime }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作">
        <template #default="{ row }">
          <template v-if="row.transactionStatus === 1">
            <el-button type="text" size="small" @click="operate('edit', row)">编辑</el-button>
            <el-button type="text" size="small" @click="operate('del', row)">删除</el-button>
          </template>
          <template v-else>
            <el-button type="text" size="small" @click="operate('look', row)">查看</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <basic-pagination
      :current="pageParams.pageNum"
      :size="pageParams.pageSize"
      :total="pageParams.total"
      @page-change="onPageChange"
    />

    <basic-dialog title="详情" v-model="lookDialogVisible" width="500px" :show-submit-btn="false">
      <el-descriptions :title="getLookDialogTitle" :column="2" :border="false">
        <el-descriptions-item label="客户代码：">
          {{ curAdjustBill.cilentCode }}
        </el-descriptions-item>
        <el-descriptions-item label="业务编号：">
          {{ curAdjustBill.businessNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="币种：">{{ curAdjustBill.currency }}</el-descriptions-item>
        <el-descriptions-item label="金额：" class-name="text-publish">
          {{ curAdjustBill.money }}
        </el-descriptions-item>
        <el-descriptions-item label="附件下载：" :span="2">
          <template v-if="curAdjustBill.accessoryUrl">
            {{ curAdjustBill.accessoryName }}
            <a :href="curAdjustBill.accessoryUrl" target="_blank" class="text-active" rel="noopener noreferrer">
              点击下载
            </a>
          </template>
          <template v-else>暂无附件📎</template>
        </el-descriptions-item>
        <el-descriptions-item label="留言：" :span="2">
          {{ curAdjustBill.leaveWord || '暂无留言' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建人：">{{ curAdjustBill.createBy }}</el-descriptions-item>
        <el-descriptions-item label="创建时间：">
          {{ curAdjustBill.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="审批人：">{{ curAdjustBill.updateBy }}</el-descriptions-item>
        <el-descriptions-item label="审批时间：">
          {{ curAdjustBill.updateTime }}
        </el-descriptions-item>
        <el-descriptions-item label="状态：" :span="2">
          <transaction-status-text :status="curAdjustBill.transactionStatus" />
        </el-descriptions-item>
        <el-descriptions-item label="审批备注：" :span="2">
          {{ curAdjustBill.submitRemark || '暂无备注' }}
        </el-descriptions-item>
      </el-descriptions>
    </basic-dialog>

    <basic-dialog
      v-model="dialogVisible"
      width="600px"
      :title="getTitle"
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
      :ok-loading="okLoading"
    >
      <el-form
        label-width="100px"
        size="small"
        :model="dialogFormData"
        :rules="dialogFormRules"
        ref="dialogFormRef"
        v-loading="dialogFormLoading"
      >
        <el-form-item label="客户代码：" prop="cilentCode">
          <el-select
            placeholder="请选择客户代码"
            :disabled="isEdit"
            filterable
            clearable
            v-model="dialogFormData.cilentCode"
          >
            <el-option
              v-for="item in clientCodeList"
              :key="item.clientCode"
              :label="`${item.clientCode}[${item.companyName}]`"
              :value="item.clientCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="业务编号：" prop="businessNumber">
          <el-input v-model="dialogFormData.businessNumber" placeholder="请输入业务编号" />
        </el-form-item>
        <el-form-item label="币种：" prop="currency">
          <el-select placeholder="请选择币种" v-model="dialogFormData.currency" clearable filterable>
            <el-option
              v-for="item in currencyList"
              :key="item.currencyId"
              :label="`${item.currencySymbol}(${item.exchangeRate})${item.currencyName}`"
              :value="item.currencySymbol"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="金额：" prop="money">
          <el-input v-model="dialogFormData.money" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="上传附件">
          <upload-btn
            @error="onUploadError"
            @remove="onFileRemove"
            @success="onUploadSuccess"
            ref="uploadBtnRef"
            @process="onUploadProcess"
          />
        </el-form-item>
        <el-form-item label="备注：" prop="submitRemark">
          <el-input type="textarea" :rows="4" v-model="dialogFormData.submitRemark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
    </basic-dialog>

    <!--  批量审核  -->
    <basic-dialog
      v-model="auditDialogVisible"
      title="批量审核"
      width="500px"
      :is-scroll="selectList.length > 5"
      @submit="onAuditSubmit"
      @close="onAuditClose"
    >
      <el-table :data="selectList" size="small" border stripe>
        <el-table-column label="客户代码" prop="cilentCode" />
        <el-table-column label="业务编号" prop="businessNumber" />
        <el-table-column label="金额" prop="money">
          <template #default="{ row }">
            <span class="text-publish">{{ row.money }}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-form size="small" :model="auditForm" :rules="auditRules" label-width="80px" class="mt-5" ref="auditFormRef">
        <el-form-item label="审批：" prop="transactionStatus">
          <el-radio-group v-model="auditForm.transactionStatus">
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="auditForm.transactionStatus === 3" label="留言：" prop="leaveWord">
          <el-input type="textarea" :rows="4" v-model="auditForm.leaveWord" placeholder="请填写不通过理由" />
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ImportButton } from '@/components/Button';
  import TransactionStatusText from './components/TransactionStatusText';
  import UploadBtn from '@/components/Upload/src/UploadBtn.vue';

  export default defineComponent({
    name: 'BillAdjust',
    components: { ImportButton, TransactionStatusText, UploadBtn },
  });
</script>

<script lang="ts" setup>
  import { onMounted, ref, reactive, computed, unref, Ref } from 'vue';
  import { useClientCodeList, useCurrencyList } from '@/hooks/select/useSelect';
  import { ClientItem, CurrencyItem } from '@/api/sys';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { checkPrice } from '@/utils/check';
  import { getPickerDate } from '@/utils/dateUtil';
  import { PageChangeParams, pageData } from '@/components/Pagination';

  import {
    addAdjust,
    AdjustAuditParams,
    AdjustItem,
    AdjustParams,
    AdjustSearchParams,
    AdjustStatus,
    auditAdjust,
    delAdjust,
    getAdjustListByPage,
    updateAdjust,
  } from '@/api/finance/bill';
  import { UploadBtnSuccessParams } from '@/components/Upload';
  import { useMessage } from '@/hooks/web/useMessage';

  const { createConfirm, createBriefSuccessMsg } = useMessage();

  type TabItem = {
    id: number;
    label: string;
    name: string;
    value: AdjustStatus;
  };
  const tabList = ref<TabItem[]>([
    { id: 1, label: '全部', name: 'all', value: 0 },
    { id: 2, label: '待审核', name: 'pendingCheck', value: 1 },
    { id: 3, label: '已扣款', name: 'deducted', value: 2 },
    { id: 4, label: '不通过', name: 'failPass', value: 3 },
  ]);
  const tabActive = ref('all');
  const onTabClick = ({ props: { name } }) => {
    form.transactionStatus = unref(tabList).find((item) => item.name === name)?.value || 0;
    loadList();
  };

  const pageParams = pageData();
  const onPageChange = (params: PageChangeParams) => {
    params.pageSize && (pageParams.pageSize = params.pageSize);
    params.pageNum && (pageParams.pageNum = params.pageNum);
    loadList();
  };
  type FormData = {
    clientCode: string;
    businessNumber: string;
    dateRange: string[];
    createTimeStart: string;
    createTimeEnd: string;
    transactionStatus: AdjustStatus;
  };
  const form = reactive<FormData>({
    clientCode: '',
    businessNumber: '',
    dateRange: [],
    createTimeStart: '',
    createTimeEnd: '',
    transactionStatus: 0,
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

  const list = ref<AdjustItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    try {
      dataLoading.value = true;
      const params: AdjustSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
        transactionStatus: form.transactionStatus,
      };
      const { startTime, endTime } = getPickerDate(form.dateRange);
      form.createTimeStart = startTime;
      form.createTimeEnd = endTime;

      form.clientCode && (params.clientCode = form.clientCode);
      form.businessNumber && (params.businessNumber = form.businessNumber);
      form.createTimeStart && (params.createTimeStart = form.createTimeStart);
      form.createTimeEnd && (params.createTimeEnd = form.createTimeEnd);
      const { list: lists, total, pageNum } = await getAdjustListByPage(params);
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
  const selectList = ref<AdjustItem[]>([]);
  async function onSelectTable(val) {
    selectList.value = val;
  }
  const canBatchBtnClick = computed(() => {
    return unref(selectList).every((e) => e.transactionStatus === 1);
  });

  const curAdjustBill = ref({}) as Ref<AdjustItem>;
  const lookDialogVisible = ref(false);
  const getLookDialogTitle = computed(() =>
    unref(curAdjustBill).businessNumber ? '业务编号：' + unref(curAdjustBill).businessNumber + '的账单详情' : ' ',
  );

  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const getTitle = computed(() => (unref(isEdit) ? '编辑账单' : '新增账单'));
  const dialogFormRef = ref();
  const dialogFormLoading = ref(false);
  const okLoading = ref(false);
  const dialogFormData = reactive<AdjustParams>({
    enterpriseRecordId: '',
    cilentCode: '',
    businessNumber: '',
    currency: '',
    money: '',
    submitRemark: '',
    accessoryUrl: '',
    accessoryName: '',
  });
  const dialogFormRules = {
    cilentCode: [{ required: true, message: '请选择客户代码', trigger: 'change' }],
    businessNumber: [{ required: true, message: '请输入业务编号', trigger: 'blur' }],
    currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
    money: [{ required: true, validator: checkPrice, trigger: 'blur' }],
  };

  const uploadBtnRef = ref();
  const onUploadSuccess = ({ fileUrl, fileName }: UploadBtnSuccessParams) => {
    dialogFormData.accessoryUrl = fileUrl;
    dialogFormData.accessoryName = fileName;
    okLoading.value = false;
  };
  const onUploadError = () => {
    unref(uploadBtnRef).setFileList({ fileName: '', fileUrl: '' });
    okLoading.value = false;
  };
  const onUploadProcess = () => {
    okLoading.value = true;
  };
  const onFileRemove = () => {
    dialogFormData.accessoryUrl = '';
    dialogFormData.accessoryName = '';
  };

  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(dialogFormRef);
    showLoading();
    try {
      dialogFormData.enterpriseRecordId = unref(clientCodeList).find(
        (item) => item.clientCode === dialogFormData.cilentCode,
      )!.id;
      if (unref(isEdit)) {
        await updateAdjust({ ...dialogFormData, id: unref(curAdjustBill).id });
        createBriefSuccessMsg('编辑成功');
      } else {
        await addAdjust(dialogFormData);
        createBriefSuccessMsg('新增成功');
      }
      await loadList();
      closeDialog();
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading();
    }
  }
  function onClose() {
    formResetFields(dialogFormRef);
    dialogFormData.accessoryName = '';
    dialogFormData.accessoryUrl = '';
  }
  function onOpened() {
    formResetFields(dialogFormRef);
    if (unref(isEdit)) {
      const {
        accessoryName,
        accessoryUrl,
        businessNumber,
        cilentCode,
        currency,
        enterpriseRecordId,
        submitRemark,
        money,
      } = unref(curAdjustBill);
      if (accessoryUrl && accessoryName) {
        unref(uploadBtnRef).setFileList({ fileName: accessoryName, fileUrl: accessoryUrl });
      }
      dialogFormData.enterpriseRecordId = enterpriseRecordId;
      dialogFormData.cilentCode = cilentCode;
      dialogFormData.businessNumber = businessNumber;
      dialogFormData.currency = currency;
      dialogFormData.money = money;
      dialogFormData.submitRemark = submitRemark;
      dialogFormData.accessoryUrl = accessoryUrl;
      dialogFormData.accessoryName = accessoryName;
    } else {
      unref(uploadBtnRef).setFileList({ fileName: '', fileUrl: '' });
    }
    dialogFormLoading.value = false;
  }

  const auditDialogVisible = ref(false);
  const auditForm = reactive<{ transactionStatus: AdjustStatus; leaveWord: string }>({
    transactionStatus: 0,
    leaveWord: '',
  });
  const auditFormRef = ref();
  const auditRules = {
    transactionStatus: [{ required: true, message: '请选择是否审批通过', trigger: 'change' }],
    leaveWord: [{ required: true, message: '留言不能为空', trigger: 'blur' }],
  };
  async function onAuditSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(auditFormRef);
    showLoading();
    try {
      const params: AdjustAuditParams = {
        transactionStatus: auditForm.transactionStatus, // 审核不通过传 3 通过传 2
        leaveWord: auditForm.leaveWord,
        ids: unref(selectList)
          .map((e) => e.id)
          .join(','),
      };
      await auditAdjust(params);
      await loadList();
      createBriefSuccessMsg('审核成功');
      closeDialog();
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading();
    }
  }
  function onAuditClose() {
    formResetFields(auditFormRef);
  }

  function operate(type: 'add' | 'edit' | 'look' | 'del' | 'audit', item?: AdjustItem) {
    switch (type) {
      case 'del':
        createConfirm({
          title: '删除账单',
          message: `请确认是否删除业务编号为《${item?.businessNumber}》的账单`,
          type: 'info',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                await delAdjust(item!.id);
                createBriefSuccessMsg('删除成功');
                await loadList();
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
      case 'look':
        curAdjustBill.value = item!;
        lookDialogVisible.value = true;
        break;
      case 'edit':
      case 'add':
        isEdit.value = type === 'edit';

        if (unref(isEdit) && item) {
          curAdjustBill.value = item;
        }

        dialogFormLoading.value = true;
        dialogVisible.value = true;
        break;
      case 'audit':
        auditDialogVisible.value = true;
        break;
    }
  }

  const clientCodeList = ref<ClientItem[]>([]);
  const currencyList = ref<CurrencyItem[]>([]);
  async function initial() {
    clientCodeList.value = await useClientCodeList();
    currencyList.value = await useCurrencyList();
    await loadList();
  }
  onMounted(() => {
    initial();
  });
</script>
