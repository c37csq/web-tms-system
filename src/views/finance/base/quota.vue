<template>
  <div class="quota">
    <el-form ref="searchFormRef" inline size="small" :model="form" class="filter-form">
      <el-form-item label="状态" prop="quotaStatus">
        <el-select placeholder="请选择状态" v-model="form.quotaStatus" filterable clearable>
          <el-option label="待审核" :value="1" />
          <el-option label="审核通过" :value="2" />
          <el-option label="审核驳回" :value="3" />
          <el-option label="作废" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="生效状态" prop="effectiveState">
        <el-select placeholder="请选择生效状态" v-model="form.effectiveState" filterable clearable>
          <el-option label="生效" :value="1" />
          <el-option label="过期" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户代码" prop="clientCode">
        <el-select placeholder="请选择客户代码" filterable clearable v-model="form.clientCode">
          <el-option
            v-for="item in selectData.clientCodeList"
            :key="item.clientCode"
            :label="`${item.clientCode}[${item.companyName}]`"
            :value="item.clientCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="createBy">
        <el-select placeholder="请选择申请人" v-model="form.createBy" filterable clearable>
          <el-option v-for="item in userList" :key="item.id" :label="item.nickName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间" prop="dateRange">
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
        <basic-filter-search @search="onSearch" @reset="onReset" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <add-button @click="operate('change')" v-auth="['finance:quota:change']">调整额度</add-button>
    </div>

    <el-table :data="list" size="small" border stripe>
      <el-table-column
        v-for="(item, idx) in columns"
        :key="idx"
        :prop="item.prop"
        :label="item.label"
        :formatter="item?.formatter"
        :width="item?.width"
        :show-overflow-tooltip="item?.showOverflowTooltip"
      />
      <el-table-column prop="operate" label="操作" width="60">
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            @click="operate('review', scope.row)"
            v-if="scope.row.quotaStatus === 1"
            v-auth="['finance:quota:review']"
          >
            审核
          </el-button>
          <!--TODO: 按钮权限 finance:quota:info -->
          <el-button type="text" size="small" @click="operate('info', scope.row)" v-else> 详情 </el-button>
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
      @close="onChangeClose"
      @submit="onChangeSubmit"
      @opened="onChangeOpened"
      title="调整额度"
      width="480px"
      v-model="quotaChangeState.visible"
    >
      <el-form
        v-loading="quotaChangeState.loading"
        size="small"
        class="change-balance-form"
        :model="quotaChangeState.form"
        :rules="quotaChangeState.rules"
        label-width="120px"
        ref="quotaChangeRef"
      >
        <el-form-item label="客户代码：" prop="clientCode">
          <el-autocomplete
            v-model="quotaChangeState.form.clientCode"
            clearable
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入客户代码"
            @select="onSelect"
          >
            <template #default="{ item }">
              <span>{{ item.clientCode }}({{ item.companyName }})</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <template v-if="quotaChangeState.isOtherShow">
          <el-form-item label="原始额度：" prop="currentQuota">
            <el-input disabled :model-value="quotaChangeState.form.currentQuota" />
          </el-form-item>
          <el-form-item label="调整额度：" prop="temporaryQuota">
            <el-input placeholder="请输入调整额度" v-model="quotaChangeState.form.temporaryQuota" />
          </el-form-item>
          <el-form-item label="到期时间：" prop="quotaEndTime">
            <el-date-picker
              placeholder="请选择到期时间"
              :disabled-date="quotaChangeState.disabledDate"
              v-model="quotaChangeState.form.quotaEndTime"
              type="date"
            />
          </el-form-item>
          <el-form-item label="申请理由" prop="quotaReason">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="quotaChangeState.form.quotaReason"
              placeholder="请输入申请理由"
            />
          </el-form-item>
        </template>
      </el-form>
    </basic-dialog>

    <basic-dialog
      @submit="onSubmit"
      :showFooter="reviewState.isEdit"
      width="580px"
      v-model="reviewState.visible"
      :title="reviewState.title"
    >
      <el-form
        size="small"
        class="review-quota-form"
        :model="reviewState.form"
        :rules="reviewState.rules"
        label-width="120px"
        ref="reviewRef"
      >
        <div class="flex">
          <el-form-item class="flex-1" label="客户代码：">{{ clientInfo.clientCode }}</el-form-item>
          <el-form-item class="flex-1" label="原额度：">{{ clientInfo.quotaOriginal }}</el-form-item>
        </div>
        <div class="flex">
          <el-form-item class="flex-1" label="申请额度：">{{ clientInfo.temporaryQuota }}</el-form-item>
          <el-form-item class="flex-1" label="币种：">{{ clientInfo.currencySymbol }}</el-form-item>
        </div>
        <div class="flex">
          <el-form-item class="flex-1" label="状态：">{{
            ['待审核', '审核通过', '审核驳回', '作废'][clientInfo.quotaStatus - 1]
          }}</el-form-item>
          <el-form-item class="flex-1" label="生效状态：">{{
            ['已生效', '已过期'][clientInfo.effectiveState - 1]
          }}</el-form-item>
        </div>
        <el-form-item label="有效时间：">
          {{ clientInfo.quotaStartTime }} - {{ clientInfo.quotaEndTime }}
        </el-form-item>
        <div class="flex">
          <el-form-item class="flex-1" label="申请人：">{{ clientInfo.nickName || '/' }}</el-form-item>
          <el-form-item class="flex-1" label="申请时间：">{{ clientInfo.createTime }}</el-form-item>
        </div>
        <el-form-item label="申请原因：">{{ clientInfo.quotaReason || '/' }}</el-form-item>
        <el-form-item label="审核：" v-if="reviewState.isEdit" prop="quotaStatus">
          <el-radio-group :model-value="reviewState.form.quotaStatus" @change="onChange">
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="reviewState.isEdit">
          <!-- TODO 待优化 -->
          <el-form-item label="通过额度：" prop="passQuota" v-if="reviewState.form.quotaStatus === 2">
            <el-input placeholder="请输入调整额度" v-model="reviewState.form.passQuota" disabled>
              <template #suffix>
                <span class="pl-5px pr-5px">USD</span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="通过额度：" v-else>
            <el-input v-model="reviewState.form.passQuota" disabled>
              <template #suffix>
                <span class="pl-5px pr-5px">USD</span>
              </template>
            </el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="通过额度：">
            <span class="text-publish">{{ clientInfo.passQuota }}</span>
          </el-form-item>
        </template>
        <el-form-item label="审核备注：" prop="remark">
          <template v-if="reviewState.isEdit">
            <el-input
              type="textarea"
              show-word-limit
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="reviewState.form.quotaRemark"
              placeholder="请输入审核备注"
            />
          </template>
          <template v-else>
            <span>{{ clientInfo.quotaRemark || '/' }}</span>
          </template>
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, h, Ref } from 'vue';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { getPickerDate, fillDateTime } from '@/utils/dateUtil';
  import { changeBalance, getBalance, getQuotaList, reviewBalance } from '@/api/finance/base';
  import { useClientCodeList, useUserList } from '@/hooks/select/useSelect';
  import { ClientItem, UserItem } from '@/api/sys';
  import { useMessage } from '@/hooks/web/useMessage';
  import { ClientInfoType, QuotaListItem } from '@/api/finance/base/model/quotaModel';

  export default defineComponent({
    name: 'QuotaBase',
    setup() {
      const columns = [
        {
          prop: 'clientCode',
          label: '客户代码',
        },
        {
          prop: 'quotaOriginal',
          label: '原额度',
        },
        {
          prop: 'temporaryQuota',
          label: '申请额度',
        },
        {
          prop: 'passQuota',
          label: '审核通过额度',
          formatter: (row) => {
            return row.passQuota ?? '/';
          },
        },
        {
          prop: 'quotaStatus',
          label: '申请状态',
          width: 120,
          formatter: (row) => {
            const value = ['待审核', '审核通过', '审核驳回', '作废'][row.quotaStatus - 1];
            const stateClass = ['', 'text-active', 'text-delete'][row.quotaStatus - 1];
            return h('span', { class: stateClass }, value);
          },
        },
        {
          prop: 'effectiveState',
          label: '生效状态',
          width: 120,
          formatter: (row) => {
            const value = ['已生效', '已过期'][row.effectiveState - 1];
            const stateClass = ['text-active', 'text-invalid'][row.effectiveState - 1];
            return h('span', { class: stateClass }, value);
          },
        },
        {
          prop: 'quotaReason',
          label: '申请原因',
          showOverflowTooltip: true,
        },
        {
          prop: 'nickName',
          label: '申请人',
          width: 120,
        },
        {
          prop: 'createTime',
          label: '申请时间',
        },
      ];
      const list = ref<QuotaListItem[]>([]);
      const pageParams = pageData();
      const reviewState = reactive({
        visible: false,
        title: '额度审核',
        submitLoading: false,
        isEdit: false,
        form: {
          balanceId: '', // 申请额度ID
          quotaStatus: 2, // 额度申请状态(1待审核 2审核通过 3审核驳回 4作废)
          passQuota: '',
          quotaRemark: '',
        },
        rules: {
          quotaStatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
          passQuota: [
            {
              required: true,
              validator: (_, value, callback) => {
                if (value === '') {
                  callback(new Error('通过额度不能为空'));
                } else if (value > clientInfo.value.temporaryQuota) {
                  callback(new Error('通过额度不能大于待审批额度'));
                } else {
                  callback();
                }
              },
              trigger: 'blur',
            },
          ],
        },
      });
      const clientInfo = ref({}) as Ref<ClientInfoType>;

      // select下拉数据
      const selectData = reactive<{
        clientCodeList: ClientItem[];
      }>({
        clientCodeList: [],
      });
      const quotaChangeState = reactive({
        visible: false,
        submitLoading: false,
        isOtherShow: false,
        loading: false,
        form: {
          clientCode: '',
          enterpriseRecordId: '', // id
          currentQuota: '', // 原始额度
          currencySymbol: '', // 币种
          temporaryQuota: '', // 申请额度
          quotaStartTime: new Date(), // 额度开始时间
          quotaEndTime: '', // 额度结束时间
          quotaReason: '', // 申请原因
        },
        rules: {
          clientCode: [{ required: true, message: '客户代码不能为空', trigger: 'change' }],
          currentQuota: [{ required: true }],
          currencySymbol: [{ required: true, message: '结算币种不能为空', trigger: 'blur' }],
          temporaryQuota: [{ required: true, message: '额度不能为空', trigger: 'blur' }],
          quotaEndTime: [{ required: true, message: '额度有效期不能为空', trigger: 'change' }],
        },
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      });
      const quotaChangeRef = ref();
      const clientList = ref<ClientItem[]>([]);
      const searchFormRef = ref();

      const userList = ref<UserItem[]>([]);
      const reviewRef = ref();
      const form = reactive({
        quotaStatus: '',
        effectiveState: '',
        clientCode: '',
        createBy: '',
        dateRange: [],
        startTime: '',
        endTime: '',
      });
      const searchForm = ref({});
      const { createBriefSuccessMsg } = useMessage();

      /**
       * @description 操作
       * @param {'info'|'review'|'change'} type
       * @param item
       */
      const operate = (type, item?: ClientInfoType) => {
        if (type === 'change') {
          quotaChangeState.visible = true;
          quotaChangeState.loading = true;
          formResetFields(quotaChangeRef);
        } else {
          reviewState.isEdit = type === 'review';
          if (reviewState.isEdit) {
            reviewState.title = '额度审核';
            reviewState.form.quotaStatus = 2;
            reviewState.form.passQuota = item!.temporaryQuota;
            reviewState.form.quotaRemark = '';
          } else {
            reviewState.title = '审核详情';
          }
          clientInfo.value = { ...item! };
          reviewState.form.balanceId = item!.balanceId;
          reviewState.visible = true;
        }
      };

      const onSubmit = async () => {
        await formValidate(reviewRef);
        try {
          await reviewBalance({ ...reviewState.form });
          await loadList();
          reviewState.visible = false;
          createBriefSuccessMsg('审核成功');
        } catch (e) {
          console.error(e);
        } finally {
          reviewState.submitLoading = false;
        }
      };

      const onChange = (val) => {
        reviewState.form.passQuota = val === 3 ? '0' : clientInfo.value.temporaryQuota;
        reviewState.form.quotaStatus = val;
      };

      const onChangeClose = async () => {
        await formResetFields(quotaChangeRef);
      };

      const onChangeOpened = async () => {
        quotaChangeState.loading = false;
      };

      const onSelect = async ({ clientCode }) => {
        if (clientCode) {
          try {
            const { currentQuota, enterpriseRecordId, currencySymbol } = await getBalance(clientCode);
            quotaChangeState.form.clientCode = clientCode;
            quotaChangeState.form.currentQuota = currentQuota;
            quotaChangeState.form.currencySymbol = currencySymbol;
            quotaChangeState.form.enterpriseRecordId = enterpriseRecordId;
            quotaChangeState.isOtherShow = true;
          } catch (e) {
            console.error(e);
            quotaChangeState.isOtherShow = false;
          }
        } else {
          quotaChangeState.isOtherShow = false;
        }
      };

      const onChangeSubmit = async () => {
        await formValidate(quotaChangeRef);
        const { startTime, endTime } = fillDateTime(
          quotaChangeState.form.quotaStartTime,
          quotaChangeState.form.quotaEndTime,
        );
        const params = {
          enterpriseRecordId: quotaChangeState.form.enterpriseRecordId,
          clientCode: quotaChangeState.form.clientCode,
          currencySymbol: quotaChangeState.form.currencySymbol,
          temporaryQuota: quotaChangeState.form.temporaryQuota,
          quotaStartTime: startTime,
          quotaEndTime: endTime,
          quotaReason: quotaChangeState.form.quotaReason,
        };
        try {
          await changeBalance(params);
          await loadList();
          quotaChangeState.visible = false;
          createBriefSuccessMsg('调整成功');
        } catch (e) {
          console.error(e);
        } finally {
          quotaChangeState.submitLoading = false;
        }
      };

      const onReset = () => {
        formResetFields(searchFormRef);
        loadList();
      };

      const onSearch = () => {
        pageParams.pageNum = 1;
        loadList();
      };

      const createFilter = (queryString) => {
        return ({ clientCode, companyName }) => {
          return (clientCode.toLowerCase() + companyName.toLowerCase()).includes(queryString.toLowerCase());
        };
      };

      let timeout;
      const querySearchAsync = (queryString, cb) => {
        const results = queryString ? clientList.value.filter(createFilter(queryString)) : clientList.value;

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          cb(results);
        }, 1000 * Math.random());
      };

      const loadList = async () => {
        try {
          const { startTime, endTime } = getPickerDate(form.dateRange);
          form.startTime = startTime;
          form.endTime = endTime;
          const params = {
            pageSize: pageParams.pageSize,
            pageNum: pageParams.pageNum,
            quotaStatus: form.quotaStatus,
            effectiveState: form.effectiveState,
            clientCode: form.clientCode || '',
            createBy: form.createBy || '',
            createTimeStart: form.startTime || '',
            createTimeEnd: form.endTime || '',
          };
          const { list: _list, pageNum, pageSize, total } = await getQuotaList(params);
          list.value = _list;
          pageParams.pageNum = pageNum;
          pageParams.pageSize = pageSize;
          pageParams.total = total;
        } catch (e) {
          console.error(e);
          list.value = [];
          pageParams.total = 0;
        }
      };

      const onPageChange = (params: PageChangeParams) => {
        params.pageSize && (pageParams.pageSize = params.pageSize);
        params.pageNum && (pageParams.pageNum = params.pageNum);
        loadList();
      };

      onMounted(async () => {
        await loadList();
        userList.value = await useUserList();
        selectData.clientCodeList = await useClientCodeList();
        clientList.value = await useClientCodeList();
      });

      return {
        columns,
        selectData,
        list,
        pageParams,
        form,
        searchForm,
        reviewState,
        reviewRef,
        quotaChangeState,
        quotaChangeRef,
        userList,
        searchFormRef,
        clientInfo,

        onPageChange,
        onReset,
        onSearch,
        querySearchAsync,
        onSelect,
        operate,
        onChangeClose,
        onChangeSubmit,
        onChangeOpened,
        onChange,
        onSubmit,
      };
    },
  });
</script>
