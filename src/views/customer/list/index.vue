<template>
  <div class="customer-list">
    <el-form size="small" inline :model="form" :rules="rules" ref="filterFormRef" class="filter-form">
      <el-form-item label="客户代码" prop="clientCode">
        <el-select
          placeholder="请选择客户代码"
          filterable
          clearable
          v-model="form.clientCode"
          @change="onClientCodeChange"
        >
          <el-option
            v-for="item in clientCodeList"
            :key="item.clientCode"
            :label="`${item.clientCode}[${item.companyName}]`"
            :value="item.clientCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客服代表" prop="serviceRepresent">
        <el-select placeholder="请选择客服代表" v-model="form.serviceRepresent" filterable clearable>
          <el-option v-for="item in CSRList" :key="item.id" :label="item.nickName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="销售代表" prop="sellRepresent">
        <el-select placeholder="请选择销售代表" v-model="form.sellRepresent" filterable clearable>
          <el-option v-for="item in saleList" :key="item.id" :label="item.nickName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="公司名称" prop="companyName">
        <el-input placeholder="请输入公司名称" v-model="form.companyName" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="enterpriseStatus">
        <el-select placeholder="请选择状态" v-model="form.enterpriseStatus" filterable clearable>
          <el-option label="全部" value=" " />
          <el-option label="待审核" value="0" />
          <el-option label="审核通过" value="1" />
          <el-option label="停用" value="2" />
          <el-option label="审核不通过" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="合同状态" prop="effectiveState">
        <el-select placeholder="请选择合同状态" v-model="form.effectiveState" filterable clearable>
          <el-option label="未生效" value="0" />
          <el-option label="生效" value="1" />
          <el-option label="过期" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="可用余额范围" prop="currentBalanceStart">
        <div class="flex">
          <el-input
            placeholder="请输入可用余额开始值"
            v-model="form.currentBalanceStart"
            clearable
            @blur="onStartBlur('balance')"
          />
          <span class="mr-2 ml-2">-</span>
          <el-input
            placeholder="请输入可用余额结束值"
            v-model="form.currentBalanceEnd"
            clearable
            @blur="onEndBlur('balance')"
          />
        </div>
      </el-form-item>
      <el-form-item label="信用额度范围" prop="currentQuotaStart">
        <div class="flex">
          <el-input
            placeholder="请输入信用额度开始值"
            v-model="form.currentQuotaStart"
            clearable
            @blur="onStartBlur('quota')"
          />
          <span class="mr-2 ml-2">-</span>
          <el-input
            placeholder="请输入信用额度结束值"
            v-model="form.currentQuotaEnd"
            clearable
            @blur="onEndBlur('quota')"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <basic-filter-search @search="onSearch" @reset="onReset" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <add-button @click="onOperate('batchWarehouse')" :disabled="!checkCustomerList.length || !canBatchBtnClick">
        批量分配仓库
      </add-button>
      <add-button @click="onOperate('batchRepresent')" :disabled="!checkCustomerList.length || !canBatchBtnClick">
        批量分配代表
      </add-button>
      <add-button @click="onOperate('add')"> 开户 </add-button>

      <import-button @click="onBtnClick('import')" v-auth="['client:batch:add']"> 批量开户 </import-button>
      <import-button @click="onBtnClick('export')" :disabled="!checkCustomerList.length" :loading="exportLoading">
        导出
      </import-button>
    </div>

    <el-table
      :data="list"
      id="customer-list"
      size="small"
      border
      stripe
      @selection-change="onSelectTableUser"
      ref="multipleTableRef"
      v-loading="dataLoading"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="客户代码" prop="clientCode" width="90" />
      <el-table-column label="客户名称" prop="clientName" />
      <el-table-column label="公司名称" prop="companyName" />
      <el-table-column label="已分配仓库" prop="warehouseList" width="100">
        <template #default="{ row }">
          <template v-if="row.warehouseList">
            <div class="flex items-center">
              <span class="text-active">{{ row.warehouseList.split(',').length }}</span>
              <el-popover
                placement="top-start"
                title="已分配仓库"
                :width="400"
                trigger="hover"
                :content="row.warehouseList"
              >
                <template #reference>
                  <svg-icon class="ml-1" name="question" />
                </template>
              </el-popover>
            </div>
          </template>
          <template v-else> 暂未分配仓库 </template>
        </template>
      </el-table-column>
      <el-table-column label="账户余额" prop="customerBalance" sortable />
      <el-table-column prop="currentBalance" sortable width="120">
        <template #header>
          <span>可用余额</span>
          <el-popover
            placement="top-start"
            :width="300"
            trigger="hover"
            content="可用余额 = 充值总金额 + 固定额度 + 信用额度 - 冻结金额 - 销售订单金额"
          >
            <template #reference>
              <svg-icon class="ml-1" size="18" name="question" />
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="信用额度" prop="currentQuota" :sortable="true" />
      <el-table-column label="固定额度" prop="fixedQuota" :sortable="true" />
      <el-table-column label="冻结金额" prop="accountFrozen" :sortable="true" />
      <el-table-column label="货币" width="70" prop="currencySymbol" />
      <el-table-column label="客服代表" prop="serviceRepresent" sortable width="100">
        <template #default="{ row }">
          <span v-if="row.serviceRepresent">{{ row.serviceRepresent }}</span>
          <span v-else>暂未分配客服代表</span>
        </template>
      </el-table-column>
      <el-table-column label="销售代表" prop="sellRepresent" sortable width="100">
        <template #default="{ row }">
          <span v-if="row.sellRepresent">{{ row.sellRepresent }}</span>
          <span v-else>暂未分配销售代表</span>
        </template>
      </el-table-column>
      <el-table-column label="经济公司名称" prop="economics" show-overflow-tooltip />
      <el-table-column
        v-for="item in statusColumns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :formatter="item.formatter"
        :width="item.width"
      />
      <el-table-column label="注册时间" prop="createDate" show-overflow-tooltip />
      <el-table-column prop="operate" label="操作" width="100">
        <template #default="{ row }">
          <el-dropdown @command="(command) => onOperate(command, row)">
            <span class="text-active el-dropdown-link cursor-pointer">
              更多操作 <el-icon><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="edit">编辑</el-dropdown-item>
                <template v-if="row.enterpriseStatus === 0">
                  <el-dropdown-item command="review" v-auth="['client:review']"> 审核 </el-dropdown-item>
                </template>
                <template v-if="row.enterpriseStatus === 2 || row.enterpriseStatus === 3">
                  <el-dropdown-item command="awaitReview">转到待审核</el-dropdown-item>
                </template>
                <template v-if="row.enterpriseStatus === 1">
                  <el-dropdown-item command="represent">分配代表</el-dropdown-item>
                  <el-dropdown-item command="warehouse">分配仓库</el-dropdown-item>
                  <el-dropdown-item command="apply">申请额度</el-dropdown-item>
                  <el-dropdown-item command="fixed" v-auth="['client:fixed']"> 固定额度 </el-dropdown-item>
                  <el-dropdown-item command="freeze" v-auth="['client:freeze']"> 冻结金额 </el-dropdown-item>
                  <el-dropdown-item command="priceMaintain">价格维护</el-dropdown-item>
                  <el-dropdown-item command="status" v-auth="['client:review']">
                    {{ row.enterpriseStatus === 1 ? '停用用户' : '启用用户' }}
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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

    <!--  仓库分配  -->
    <basic-dialog
      v-model="allotWarehouseState.visible"
      width="600px"
      :title="allotWarehouseState.title"
      @submit="onWarehouseSubmit"
      @opened="onOpened('warehouse')"
    >
      <el-form
        size="small"
        label-width="120px"
        :model="allotWarehouseState.form"
        :rules="allotWarehouseRules"
        ref="allotWarehouseFormRef"
        v-loading="allotWarehouseFormLoading"
      >
        <el-form-item label="客户代码" prop="clientCode">
          <el-select
            placeholder="请选择客户"
            v-model="allotWarehouseState.form.clientCode"
            filterable
            clearable
            multiple
            :disabled="!allotWarehouseState.isBatch"
          >
            <el-option
              v-for="item in clientCodeList"
              :key="item.clientCode"
              :label="`${item.clientCode}[${item.companyName}]`"
              :value="item.clientCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库列表" prop="warehouseCodeList">
          <el-select
            placeholder="请选择仓库"
            v-model="allotWarehouseState.form.warehouseCodeList"
            clearable
            filterable
            multiple
          >
            <el-option
              v-for="item in warehouseList"
              :key="item.warehouseId"
              :label="item.warehouseCode"
              :value="item.warehouseCode"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </basic-dialog>

    <!--  代表分配  -->
    <basic-dialog
      v-model="allotRepresentState.visible"
      width="600px"
      :title="allotRepresentState.title"
      @submit="onRepresentSubmit"
      @opened="onOpened('represent')"
    >
      <el-form
        size="small"
        label-width="120px"
        :model="allotRepresentState.form"
        :rules="allotRepresentRules"
        ref="allotRepresentFormRef"
        v-loading="allotRepresentFormLoading"
      >
        <el-form-item label="客户代码" prop="clientCode">
          <el-select
            placeholder="请选择客户"
            v-model="allotRepresentState.form.clientCode"
            filterable
            clearable
            multiple
            :disabled="!allotRepresentState.isBatch"
          >
            <el-option
              v-for="item in clientCodeList"
              :key="item.clientCode"
              :label="`${item.clientCode}[${item.companyName}]`"
              :value="item.clientCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="销售代表" prop="sellRepresent">
          <el-select placeholder="请选择销售代表" v-model="allotRepresentState.form.sellRepresent" filterable>
            <el-option v-for="item in saleList" :key="item.id" :label="item.nickName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="客服代表" prop="serviceRepresent">
          <el-select placeholder="请选择客服代表" v-model="allotRepresentState.form.serviceRepresent" filterable>
            <el-option v-for="item in CSRList" :key="item.id" :label="item.nickName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </basic-dialog>

    <!--  开户/编辑  -->
    <basic-dialog
      v-model="customerState.visible"
      width="660px"
      :title="customerState.title"
      @submit="onAccountSubmit"
      @opened="onOpened('account')"
    >
      <el-form
        size="small"
        label-width="120px"
        inline
        :model="customerState.form"
        :rules="customerRules"
        ref="customerFormRef"
        v-loading="customerFormLoading"
      >
        <template v-if="!customerState.isEdit">
          <el-form-item label="账号名" prop="loginName">
            <el-input v-model="customerState.form.loginName" placeholder="请输入账户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="customerState.form.password" placeholder="请输入密码" />
          </el-form-item>
        </template>
        <el-form-item label="客户代码" prop="clientCode">
          <el-input
            v-model.trim="customerState.form.clientCode"
            placeholder="请输入客户代码"
            :disabled="customerState.isEdit"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="clientName">
          <el-input v-model="customerState.form.clientName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="电话" prop="telephone">
          <el-input v-model.number="customerState.form.telephone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="customerState.form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="customerState.form.address" placeholder="请输入联系地址" />
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="customerState.form.companyName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="提醒金额" prop="remindSum">
          <el-input v-model="customerState.form.remindSum" placeholder="请输入提醒金额" />
        </el-form-item>
        <el-form-item label="结算币种" prop="currencySymbol">
          <el-select
            placeholder="请选择结算币种"
            v-model="customerState.form.currencySymbol"
            filterable
            :disabled="customerState.isEdit"
          >
            <el-option
              v-for="item in currencyList"
              :key="item.currencyId"
              :label="item.currencyName"
              :value="item.currencySymbol"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合同有效期" prop="dateRange">
          <el-date-picker
            v-model="customerState.form.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="合同到期提醒" prop="contractExpire">
          <el-input v-model.number="customerState.form.contractExpire" placeholder="请输入合同到期提醒">
            <template #suffix>
              <span class="px-2">天</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="经济公司名称" prop="economics;">
          <el-input v-model="customerState.form.economics" placeholder="请输入经济公司名称" />
        </el-form-item>
      </el-form>
    </basic-dialog>

    <basic-dialog
      v-model="reviewDialogVisible"
      width="400px"
      title="审核"
      @submit="onReviewSubmit"
      @opened="onOpened('review')"
    >
      <el-form
        size="small"
        label-width="120px"
        :model="reviewDialogForm"
        ref="reviewDialogFormRef"
        v-loading="reviewDialogFormLoading"
      >
        <el-form-item
          label="操作"
          prop="status"
          :rules="[{ required: true, message: '启用或停用必选一个', trigger: 'change' }]"
        >
          <el-radio-group v-model="reviewDialogForm.status">
            <el-radio label="1">审核通过</el-radio>
            <el-radio label="3">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </basic-dialog>

    <basic-dialog
      v-model="applyQuotaState.visible"
      title="申请额度"
      width="680px"
      @submit="onApplySubmit"
      @opened="onOpened('apply')"
    >
      <el-form
        size="small"
        label-width="140px"
        :model="applyQuotaState.form"
        :rules="applyQuotaFormRules"
        ref="applyQuotaFormRef"
        v-loading="applyQuotaFormLoading"
      >
        <el-form-item label="客户代码" prop="clientCode">
          <el-input disabled :model-value="applyQuotaState.form.clientCode" />
        </el-form-item>
        <el-form-item label="可用余额" prop="currentBalance">
          <el-input disabled :model-value="applyQuotaState.form.currentBalance" />
        </el-form-item>
        <el-form-item label="申请临时额度" prop="temporaryQuota">
          <el-input v-model="applyQuotaState.form.temporaryQuota" placeholder="请输入申请临时额度" />
        </el-form-item>
        <el-form-item label="临时额度有效期" prop="quotaEndTime" class="form-date-range">
          <div class="flex items-center form-date-range">
            <el-date-picker v-model="applyQuotaState.form.quotaStartTime" disabled />
            <span class="mr-2 ml-2">至</span>
            <el-date-picker v-model="applyQuotaState.form.quotaEndTime" :disabled-date="applyQuotaState.disabledDate" />
          </div>
        </el-form-item>
        <el-form-item label="申请理由" prop="quotaReason">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="applyQuotaState.form.quotaReason"
            placeholder="请输入申请理由"
          />
        </el-form-item>
      </el-form>
    </basic-dialog>

    <!-- 固定/冻结 -->
    <basic-dialog
      v-model="balanceState.visible"
      :title="balanceState.title"
      width="500px"
      @submit="onBalanceSubmit"
      @opened="onOpened('balance')"
    >
      <el-form
        size="small"
        label-width="140px"
        :model="balanceState.form"
        :rules="balanceFormRules"
        ref="balanceFormRef"
        v-loading="balanceFormLoading"
      >
        <el-form-item label="客户代码" prop="clientCode">
          <el-input disabled :model-value="balanceState.form.clientCode" />
        </el-form-item>
        <el-form-item label="固定额度" prop="fixedQuota" v-show="balanceState.isFixed">
          <el-input v-model="balanceState.form.fixedQuota" placeholder="请输入固定额度" />
        </el-form-item>
        <el-form-item label="冻结金额" prop="accountFrozen" v-show="!balanceState.isFixed">
          <el-input v-model="balanceState.form.accountFrozen" placeholder="请输入要冻结的金额" />
        </el-form-item>
      </el-form>
    </basic-dialog>

    <basic-dialog
      v-model="priceMaintainState.visible"
      title="价格维护"
      width="680px"
      @submit="onPriceMaintainSubmit"
      @opened="onOpened('priceMaintain')"
    >
      <div v-loading="priceMaintainFormLoading">
        <el-form size="small" label-width="80px" :model="priceMaintainState.form" ref="priceMaintainFormRef">
          <el-form-item label="客户代码" prop="clientCode">
            <el-input disabled :model-value="priceMaintainState.form.clientCode" />
          </el-form-item>
          <el-form-item label="Tips:">
            <span class="text-sm text-secondary-600">未分配的销售产品默认为公报价</span>
          </el-form-item>
          <div class="mb-20px">
            <add-button @click="onPriceMaintainOperate('add')" />
            <danger-button @click="onPriceMaintainOperate('del')" :disabled="!priceSelectList.length" />
          </div>
        </el-form>
        <el-table
          :data="priceMaintainState.list"
          size="small"
          border
          stripe
          class="custom-table"
          @selection-change="onPriceTableSelect"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column prop="costType" label="销售产品">
            <template #default="scope">
              <el-select v-model="scope.row.productsId" filterable size="small" placeholder="选择销售产品">
                <el-option
                  v-for="item in saleProductList"
                  :key="item.productsId"
                  :label="item.promotingProductsCode"
                  :value="item.productsId"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="discountType" label="运费等级" width="120">
            <template #default="scope">
              <el-select v-model="scope.row.freightLevel" filterable size="small">
                <el-option v-for="item in priceGradeList" :key="item.id" :label="item.label" :value="item.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="discountValue" label="杂费等级" width="120">
            <template #default="scope">
              <el-select v-model="scope.row.extrasLevel" filterable size="small">
                <el-option v-for="item in priceGradeList" :key="item.id" :label="item.label" :value="item.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="volumeFactor" label="体积系数" width="110">
            <template #default="scope">
              <el-input v-model="scope.row.volumeFactor" size="small" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ImportButton } from '@/components/Button';
  import ImportDialog from '@/components/Dialog/src/ImportDialog.vue';
  import { ArrowDown } from '@element-plus/icons-vue';

  export default defineComponent({
    name: 'CustomerManagementList',
    components: { ImportButton, ImportDialog, ArrowDown },
  });
</script>

<script lang="ts" setup>
  import { computed, onMounted, reactive, Ref, ref, unref, onDeactivated, onActivated } from 'vue';
  import {
    useClientCodeList,
    useCurrencyList,
    useDictData,
    useSaleProductList,
    useUserByRoleId,
    useWarehouseList,
  } from '@/hooks/select/useSelect';
  import {
    ClientItem,
    CurrencyItem,
    DictOptionItem,
    SaleProductItem,
    SelectUserByRoleIdItem,
    WarehouseItem,
  } from '@/api/sys';
  import { formResetFields, formValidate, getArrayDifference } from '@/utils/tools';
  import { getPickerDate } from '@/utils/dateUtil';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import {
    addCustomer,
    allotRepresent,
    allotWarehouse,
    changeCustomerStatus,
    getCustomerListByPage,
    updateCustomer,
    CustomerItem,
    CustomerParams,
    CustomerSearchParams,
    ApplyQuotaParams,
    applyQuota,
    fixedQuotaApi,
    freezeAmount,
    CustomerPriceResultModel,
    SysEnterprisePriceItem,
    getCustomerPrice,
    customerPriceMaintain,
  } from '@/api/customer';
  import { statusColumns, CommandType, DialogType } from './data';
  import { jsonToSheetXlsx } from '@/components/Excel';
  import { cloneDeep, pick } from 'lodash-es';
  import { importDialogState, UploadApi } from '@/api/sys/upload';
  import { useMessage } from '@/hooks/web/useMessage';
  import { checkEmail, checkBalance } from '@/utils/check';
  import { useParamsStore } from '@/store/modules/params';
  import { DialogSubmitAction } from '@/components/Dialog';

  const { createConfirm, createBriefSuccessMsg, createMessage } = useMessage();

  const form = reactive({
    clientCode: '', //  客户代码
    serviceRepresent: '', // 客服代表
    sellRepresent: '', // 销售代表
    companyName: '',
    enterpriseStatus: '', // 企业状态（0待审核、1启用、2停用）
    effectiveState: '', // 合同生效状态（0未生效1生效2过期）
    currentBalanceStart: '', // 开始余额
    currentBalanceEnd: '', // 截至余额
    currentQuotaStart: '', // 开始额度
    currentQuotaEnd: '', // 截至额度
  });
  const rules = {
    currentBalanceStart: [],
  };
  const filterFormRef = ref();

  const pageParams = pageData();
  const onPageChange = (params: PageChangeParams) => {
    params.pageSize && (pageParams.pageSize = params.pageSize);
    params.pageNum && (pageParams.pageNum = params.pageNum);
    loadList();
  };

  function onStartBlur(type: 'quota' | 'balance') {
    if (type === 'quota') {
      if (form.currentQuotaEnd && form.currentQuotaEnd < form.currentQuotaStart) {
        createMessage.info('信用额度结束值不能小于开始值');
        form.currentQuotaEnd = '';
      }
    } else {
      if (form.currentBalanceEnd && form.currentBalanceEnd < form.currentBalanceStart) {
        createMessage.info('可用结束值不能小于开始值');
        form.currentBalanceEnd = '';
      }
    }
  }
  function onEndBlur(type: 'quota' | 'balance') {
    if (type === 'quota') {
      if (form.currentQuotaStart && form.currentQuotaEnd < form.currentQuotaStart) {
        createMessage.info('信用额度结束值不能小于开始值');
        form.currentQuotaEnd = '';
      }
    } else {
      if (form.currentBalanceStart && form.currentBalanceEnd < form.currentBalanceStart) {
        createMessage.info('可用结束值不能小于开始值');
        form.currentBalanceEnd = '';
      }
    }
  }
  async function onSearch() {
    pageParams.pageNum = 1;
    await loadList();
  }
  async function onReset() {
    formResetFields(filterFormRef);
    form.currentBalanceEnd = '';
    form.currentQuotaEnd = '';
    await loadList();
  }

  const canBatchBtnClick = computed((): boolean => {
    return unref(checkCustomerList).every((e) => [1].includes(~~e.enterpriseStatus));
  });

  const list = ref<CustomerItem[]>([]);
  const checkCustomerList = ref<CustomerItem[]>([]);
  const dataLoading = ref(true);
  async function loadList() {
    dataLoading.value = true;
    try {
      const params: CustomerSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
      };
      form.clientCode && (params.clientCode = form.clientCode);
      form.companyName && (params.companyName = form.companyName);
      form.effectiveState && (params.effectiveState = form.effectiveState);
      form.serviceRepresent && (params.serviceRepresent = form.serviceRepresent);
      form.sellRepresent && (params.sellRepresent = form.sellRepresent);
      form.enterpriseStatus && (params.enterpriseStatus = form.enterpriseStatus);
      // 存在0的情况
      params.currentBalanceStart = form.currentBalanceStart;
      form.currentBalanceEnd && (params.currentBalanceEnd = form.currentBalanceEnd);
      params.currentQuotaStart = form.currentQuotaStart;
      form.currentQuotaEnd && (params.currentQuotaEnd = form.currentQuotaEnd);
      const { list: lists, total, pageNum } = await getCustomerListByPage(params);
      list.value = lists;
      pageParams.total = total;
      pageParams.pageNum = pageNum;
    } catch (e) {
      pageParams.total = 0;
      list.value = [];
    } finally {
      dataLoading.value = false;
    }
  }

  const multipleTableRef = ref();
  function onSelectTableUser(val) {
    checkCustomerList.value = val;
  }

  const importData = importDialogState(UploadApi.OpenAccount);
  async function onImportSuccess({ close }) {
    await loadList();
    close && close();
  }

  const clientCodeList = ref<ClientItem[]>([]);
  const CSRList = ref<SelectUserByRoleIdItem[]>([]); // 客服列表
  const saleList = ref<SelectUserByRoleIdItem[]>([]); //  销售列表

  const warehouseList = ref<WarehouseItem[]>([]); // 仓库列表
  const currencyList = ref<CurrencyItem[]>([]);
  const saleProductList = ref<SaleProductItem[]>([]);
  const priceGradeList = ref<DictOptionItem[]>([]);

  onMounted(async () => {
    clientCodeList.value = await useClientCodeList();
    CSRList.value = await useUserByRoleId('6bb22324-fcfa-bfe0-4055-ca37c4bff46f');
    saleList.value = await useUserByRoleId('3704e0b8-0f9f-0bbf-9572-607b3e79075e');
    warehouseList.value = await useWarehouseList();
    currencyList.value = await useCurrencyList();

    await loadList();
  });

  const exportLoading = ref(false);
  type OperateType = 'import' | 'export';
  async function onBtnClick(type: OperateType) {
    if (type === 'export') {
      exportLoading.value = true;
      const exportData = cloneDeep(unref(checkCustomerList));
      jsonToSheetXlsx({
        data: exportData.map((e) => {
          e.warehouseList = e.warehouseList || '暂未分配仓库';
          e.sellRepresent = e.sellRepresent || '暂未分配销售代表';
          e.serviceRepresent = e.serviceRepresent || '暂未分配客服代表';
          e.effectiveState = ['未生效', '生效', '过期'][e.effectiveState];
          e.enterpriseStatus = ['待审核', '启用', '停用'][e.enterpriseStatus];
          return e;
        }),
        header: {
          address: '地址',
          balanceStatus: 'balanceStatus', // 是否冻结 0  1已冻结
          clientCode: '客户代码',
          clientName: '客户名称',
          companyName: '公司名称',
          currentQuota: '信用额度',
          fixedQuota: '固定额度',
          warehouseList: '已经分配仓库',
          accountFrozen: '冻结金额',
          currencySymbol: '结算币种',
          serviceRepresent: '客服代表',
          sellRepresent: '销售代表',
          economics: '经济公司名称',
          effectiveState: '合同状态',
          enterpriseStatus: '企业状态',
          createDate: '注册时间',
          extrasLevel: '杂费等级',
          remindSum: '提醒金额',
          email: '邮箱',
          contractEndTime: 'contractEndTime',
          contractExpire: '合同到期提醒',
          contractStartTime: 'contractStartTime',
          createBy: 'createBy',
          currentBalance: 'currentBalance',
          customerBalance: '账户余额',
          freightLevel: '运费等级',
          id: 'ID',
          telephone: '电话',
          updateBy: '更新人',
          updateDate: '更新时间',
        },
        filename: `客户列表数据_${+new Date()}.xlsx`,
        json2sheetOpts: {
          header: [],
        },
      });
      multipleTableRef.value.clearSelection();
      exportLoading.value = false;
    } else {
      importData.visible = true;
    }
  }

  // 正在编辑的item
  const editItem = ref({}) as Ref<CustomerItem>;

  type CommonState = {
    visible: boolean;
    title: string;
  };
  // warehouse dialog about
  type AllotWarehouseState = CommonState & {
    isBatch: boolean;
    form: {
      clientCode: string[];
      warehouseCodeList: string[];
    };
  };
  const allotWarehouseState = reactive<AllotWarehouseState>({
    visible: false,
    isBatch: true,
    title: '批量分配仓库',
    form: {
      clientCode: [],
      warehouseCodeList: [],
    },
  });
  const allotWarehouseRules = {
    clientCode: [{ required: true, message: '客户不能为空', trigger: 'change' }],
    warehouseCodeList: [{ required: true, message: '仓库不能为空', trigger: 'change' }],
  };
  const allotWarehouseFormRef = ref();
  const allotWarehouseFormLoading = ref(false);

  // represent dialog about
  type AllotRepresentState = CommonState & {
    isBatch: boolean;
    form: {
      clientCode: string[];
      serviceRepresent: string; // 客服代表
      sellRepresent: string; // 销售代表
    };
  };
  const allotRepresentState = reactive<AllotRepresentState>({
    visible: false,
    isBatch: true,
    title: '批量分配代表',
    form: {
      clientCode: [],
      serviceRepresent: '', // 客服代表
      sellRepresent: '', // 销售代表
    },
  });
  const allotRepresentRules = {
    clientCode: [{ required: true, message: '客户不能为空', trigger: 'change' }],
    sellRepresent: [{ required: true, message: '销售代表不能为空', trigger: 'change' }],
    serviceRepresent: [{ required: true, message: '客服代表不能为空', trigger: 'change' }],
  };
  const allotRepresentFormRef = ref();
  const allotRepresentFormLoading = ref(false);

  // customer dialog about
  type CustomerState = CommonState & {
    isEdit: boolean;
    form: CustomerParams;
  };
  const customerState = reactive<CustomerState>({
    visible: false,
    isEdit: false,
    title: '开户',
    form: {
      loginName: '', // 账户名
      password: '', // 密码
      clientCode: '', // 客户代码
      clientName: '', // 客户姓名
      telephone: '', // 电话
      email: '', // 邮箱
      address: '', // 联系地址
      companyName: '', // 公司名称
      remindSum: '', // 提醒金额
      currencySymbol: '', // 结算币种
      contractStartTime: '',
      contractEndTime: '',
      dateRange: [], // contractStartTime contractEndTime
      contractExpire: '', // 合同到期提醒
      freightLevel: '公报价', // 运费等级
      extrasLevel: '公报价', // 杂费等级
      economics: '', // 经济公司名称
    },
  });
  const customerRules = {
    loginName: [{ required: true, message: '账户名不能为空', trigger: 'blur' }],
    password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
    clientCode: [{ required: true, message: '客户代码不能为空', trigger: 'blur' }],
    clientName: [{ required: true, message: '客户姓名不能为空', trigger: 'blur' }],
    telephone: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
    email: [{ required: true, validator: checkEmail, trigger: 'blur' }],
    address: [{ required: true, message: '联系地址不能为空', trigger: 'blur' }],
    companyName: [{ required: true, message: '公司名称不能为空', trigger: 'blur' }],
    remindSum: [{ required: true, message: '提醒金额不能为空', trigger: 'blur' }],
    currencySymbol: [{ required: true, message: '结算币种不能为空', trigger: 'blur' }],
    dateRange: [{ required: true, message: '合同有效期不能为空', trigger: 'change' }],
    contractExpire: [{ required: true, message: '合同到期日不能为空', trigger: 'blur' }],
  };
  const customerFormRef = ref();
  const customerFormLoading = ref(false);

  // review dialog
  const reviewDialogVisible = ref(false);
  const reviewDialogForm = ref({}) as Ref<{ id: string; status: string }>;
  const reviewDialogFormRef = ref();
  const reviewDialogFormLoading = ref(false);

  // applyQuota dialog
  type ApplyQuota = {
    visible: boolean;
    form: ApplyQuotaParams;
    disabledDate(params): boolean;
  };
  const applyQuotaState = reactive<ApplyQuota>({
    visible: false,
    form: {
      enterpriseRecordId: '', // 客户ID
      clientCode: '', // 客户代码
      currentBalance: '', // 当前余额
      temporaryQuota: '', // 临时额度
      currencySymbol: '', // 币种
      quotaStartTime: new Date(),
      quotaEndTime: '',
      quotaReason: '', // 申请原因
    },
    disabledDate(time) {
      return time.getTime() < Date.now();
    },
  });
  const applyQuotaFormRules = {
    clientCode: [{ required: true }],
    currentBalance: [{ required: true }],
    temporaryQuota: [{ required: true, message: '临时额度不能为空', trigger: 'blur' }],
    currencySymbol: [{ required: true, message: '额度币种不能为空', trigger: 'change' }],
    quotaEndTime: [{ required: true, message: '临时额度有效期不能为空', trigger: 'change' }],
  };
  const applyQuotaFormRef = ref();
  const applyQuotaFormLoading = ref();

  // 固定额度 冻结金额
  type BalanceState = CommonState & {
    isFixed: boolean;
    form: {
      enterpriseRecordId: string; // 客户代码
      currentBalance: string; // 可用余额 用于冻结金额时 placeholder
      clientCode: string; // 客户代码
      fixedQuota: string; // 固定额度
      accountFrozen: string; // 冻结额度
    };
  };
  const balanceState = reactive<BalanceState>({
    title: '固定额度',
    isFixed: true,
    visible: false,
    form: {
      enterpriseRecordId: '', // 客户代码
      currentBalance: '', // 可用余额 用于冻结金额时 placeholder
      clientCode: '', // 客户代码
      fixedQuota: '', // 固定额度
      accountFrozen: '', // 冻结额度
    },
  });
  const balanceFormRules = {
    clientCode: [{ required: true }],
    fixedQuota: [{ required: true, message: '固定额度不能为空', trigger: 'blur' }],
    accountFrozen: [{ required: true, validator: checkBalance, trigger: 'blur' }],
  };
  const balanceFormRef = ref();
  const balanceFormLoading = ref(false);

  // 价格维护
  type PriceMaintainState = {
    visible: boolean;
    canClick: boolean;
    listIdVal: number;
    list: SysEnterprisePriceItem[];
    form: CustomerPriceResultModel;
  };
  const priceMaintainState = reactive<PriceMaintainState>({
    visible: false,
    canClick: true,
    listIdVal: 1,
    list: [],
    form: {
      enterpriseRecordId: '',
      clientCode: '',
      sysEnterprisePrices: [],
    },
  });
  // const priceMaintainFormRules = {
  //   freightLevel: [{ required: true, message: '运费等级不能为空', trigger: 'change' }],
  //   extrasLevel: [{ required: true, message: '杂费等级不能为空', trigger: 'change' }],
  // };
  const priceMaintainFormRef = ref();
  const priceMaintainFormLoading = ref(false);
  const priceMaintainData = ref({}) as Ref<CustomerPriceResultModel>;

  const priceSelectList = ref<SysEnterprisePriceItem[]>([]);
  function onPriceTableSelect(val) {
    priceSelectList.value = val;
  }
  function onPriceMaintainOperate(type: 'add' | 'del') {
    if (type === 'add') {
      priceMaintainState.list.push({
        id: ++priceMaintainState.listIdVal,
        productsId: '', // 销售产品id
        freightLevel: '公报价', // 运费等级
        extrasLevel: '公报价', // 杂费等级
        volumeFactor: '', // 体积系数
      });
    } else {
      createConfirm({
        message: '请确认是否删除选中的数据',
        title: '删除提示',
        type: 'info',
      })
        .then(() => {
          if (priceMaintainState.list.length === unref(priceSelectList).length) {
            priceMaintainState.list = [];
          }
          priceMaintainState.list = getArrayDifference(priceMaintainState.list, unref(priceSelectList));
        })
        .catch(() => {});
    }
  }

  async function onAccountSubmit({ showLoading, closeLoading, closeDialog }: DialogSubmitAction) {
    try {
      await formValidate(customerFormRef);
      showLoading();
      const { startTime, endTime } = getPickerDate(customerState.form.dateRange);
      customerState.form.contractStartTime = startTime;
      customerState.form.contractEndTime = endTime;
      if (customerState.isEdit) {
        await updateCustomer({ ...customerState.form, id: unref(editItem).id });
        createBriefSuccessMsg('编辑成功');
      } else {
        await addCustomer(customerState.form);
        createBriefSuccessMsg('开户成功');
      }
      await loadList();
      closeDialog();
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading();
    }
  }
  async function onReviewSubmit({ showLoading, closeLoading, closeDialog }: DialogSubmitAction) {
    try {
      await formValidate(reviewDialogFormRef);
      showLoading();
      await changeCustomerStatus(unref(reviewDialogForm));
      await loadList();
      createBriefSuccessMsg('操作成功');
      closeDialog();
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading();
    }
  }
  async function onApplySubmit({ showLoading, closeLoading, closeDialog }: DialogSubmitAction) {
    try {
      await formValidate(applyQuotaFormRef);
      showLoading();
      await applyQuota(applyQuotaState.form);
      await loadList();
      createBriefSuccessMsg('操作成功');
      closeDialog();
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading();
    }
  }
  async function onBalanceSubmit({ showLoading, closeLoading, closeDialog }: DialogSubmitAction) {
    try {
      showLoading();
      const { enterpriseRecordId, fixedQuota, accountFrozen } = balanceState.form;
      if (balanceState.isFixed) {
        await fixedQuotaApi({ enterpriseRecordId, fixedQuota });
        createBriefSuccessMsg('操作成功');
      } else {
        await freezeAmount({ enterpriseRecordId, accountFrozen });
        createBriefSuccessMsg('冻结金额成功');
      }
      await loadList();
      closeDialog();
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading();
    }
  }
  async function onPriceMaintainSubmit({ showLoading, closeLoading, closeDialog }: DialogSubmitAction) {
    try {
      await formValidate(priceMaintainFormRef);
      showLoading();
      await customerPriceMaintain({
        enterpriseRecordId: priceMaintainState.form.enterpriseRecordId,
        sysEnterprisePrices: priceMaintainState.list,
      });
      createBriefSuccessMsg('操作成功');
      await loadList();
      closeDialog();
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading();
    }
  }
  async function onWarehouseSubmit({ showLoading, closeLoading, closeDialog }: DialogSubmitAction) {
    try {
      await formValidate(allotWarehouseFormRef);
      showLoading();
      await allotWarehouse({
        clientCode: allotWarehouseState.form.clientCode,
        warehouseList: allotWarehouseState.form.warehouseCodeList.join(','),
      });
      createBriefSuccessMsg('分配仓库成功');
      await loadList();
      closeDialog();
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading();
    }
  }
  async function onRepresentSubmit({ showLoading, closeLoading, closeDialog }: DialogSubmitAction) {
    try {
      await formValidate(allotRepresentFormRef);
      showLoading();
      await allotRepresent(allotRepresentState.form);
      createBriefSuccessMsg('分配代表成功');
      await loadList();
      closeDialog();
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading();
    }
  }

  async function onOpened(type: DialogType) {
    if (type === 'warehouse') {
      const { clientCode, warehouseList } = unref(editItem);
      formResetFields(allotWarehouseFormRef);
      if (allotWarehouseState.isBatch) {
        if (checkCustomerList.value.length) {
          allotWarehouseState.form.clientCode = checkCustomerList.value.map((e) => e.clientCode);
        }
      } else {
        allotWarehouseState.form.clientCode = [clientCode];
        if (warehouseList.length) {
          allotWarehouseState.form.warehouseCodeList = warehouseList.split(',');
        }
      }
      allotWarehouseFormLoading.value = false;
    } else if (type === 'represent') {
      const { clientCode, serviceRepresent, sellRepresent } = unref(editItem);
      formResetFields(allotRepresentFormRef);
      if (allotRepresentState.isBatch) {
        if (checkCustomerList.value.length) {
          allotRepresentState.form.clientCode = checkCustomerList.value.map((e) => e.clientCode);
        }
      } else {
        allotRepresentState.form.clientCode = [clientCode];
        allotRepresentState.form.serviceRepresent =
          unref(CSRList).find((e) => e.nickName === serviceRepresent)?.id || serviceRepresent;
        allotRepresentState.form.sellRepresent =
          unref(saleList).find((e) => e.nickName === sellRepresent)?.id || sellRepresent;
      }
      allotRepresentFormLoading.value = false;
    } else if (type === 'account') {
      formResetFields(customerFormRef);
      if (customerState.isEdit) {
        const { contractStartTime, contractEndTime } = unref(editItem);
        customerState.form = {
          ...pick(unref(editItem), ...Object.keys(customerState.form)),
          dateRange: [contractStartTime, contractEndTime],
        } as unknown as CustomerParams;
      } else {
        customerState.form.freightLevel = '公报价';
        customerState.form.extrasLevel = '公报价';
      }
      customerFormLoading.value = false;
    } else if (type === 'review') {
      formResetFields(reviewDialogFormRef);
      reviewDialogFormLoading.value = false;
    } else if (type === 'apply') {
      formResetFields(applyQuotaFormRef);
      applyQuotaState.form = Object.assign(applyQuotaState.form, {
        enterpriseRecordId: unref(editItem).id,
        ...pick(unref(editItem), 'clientCode', 'currentBalance', 'currencySymbol'),
      });
      applyQuotaFormLoading.value = false;
    } else if (type === 'balance') {
      formResetFields(balanceFormRef);
      balanceState.form = Object.assign(balanceState.form, {
        ...pick(unref(editItem), 'clientCode', 'currentBalance'),
        enterpriseRecordId: unref(editItem).id,
      });
      if (balanceState.isFixed) {
        balanceState.form.fixedQuota = unref(editItem).fixedQuota as string;
      } else {
        balanceState.form.accountFrozen = '';
      }
      balanceFormLoading.value = false;
    } else if (type === 'priceMaintain') {
      formResetFields(priceMaintainFormRef);
      const { clientCode, enterpriseRecordId, sysEnterprisePrices } = unref(priceMaintainData);
      priceMaintainState.form.clientCode = clientCode;
      priceMaintainState.form.enterpriseRecordId = enterpriseRecordId;
      priceMaintainState.list = sysEnterprisePrices.map((e, idx) => {
        e.id = idx + 1;
        return e;
      });
      priceMaintainState.listIdVal = sysEnterprisePrices.length;
      priceMaintainFormLoading.value = false;
    }
  }

  async function onOperate(type: CommandType, item?: CustomerItem) {
    switch (type) {
      case 'batchWarehouse':
      case 'warehouse':
        allotWarehouseState.isBatch = type === 'batchWarehouse';

        if (allotWarehouseState.isBatch) {
          allotWarehouseState.title = '批量分配仓库';
        } else {
          allotWarehouseState.title = '分配仓库';
          editItem.value = item!;
        }

        allotWarehouseFormLoading.value = true;
        allotWarehouseState.visible = true;
        break;
      case 'batchRepresent':
      case 'represent':
        allotRepresentState.isBatch = type === 'batchRepresent';

        if (allotRepresentState.isBatch) {
          allotRepresentState.title = '批量分配代表';
        } else {
          allotRepresentState.title = '分配代表';
          editItem.value = item!;
        }

        allotRepresentFormLoading.value = true;
        allotRepresentState.visible = true;
        break;
      case 'add':
      case 'edit':
        customerState.isEdit = type === 'edit';

        if (customerState.isEdit) {
          editItem.value = item!;
          customerState.title = '编辑';
        } else {
          customerState.title = '开户';
        }

        customerFormLoading.value = true;
        customerState.visible = true;
        break;
      case 'review':
        reviewDialogForm.value.id = item!.id;
        reviewDialogFormLoading.value = true;
        reviewDialogVisible.value = true;
        break;
      case 'awaitReview':
        createConfirm({
          title: '转到待审核',
          message: `请确认是否将《${item?.clientName}》客户转到待审核`,
          type: 'info',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                await changeCustomerStatus({ id: item!.id, status: 0 });
                await loadList();
                createBriefSuccessMsg('操作成功');
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
      case 'status':
        createConfirm({
          title: '停用用户',
          message: `请确认是否停用客户名称为《${item?.clientName}》该客户`,
          type: 'info',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                await changeCustomerStatus({ id: item!.id, status: 2 });
                await loadList();
                createBriefSuccessMsg('停用成功');
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
      case 'apply':
        editItem.value = item!;
        applyQuotaFormLoading.value = true;
        applyQuotaState.visible = true;
        break;
      case 'fixed':
      case 'freeze':
        balanceState.isFixed = type === 'fixed';

        editItem.value = item!;
        if (balanceState.isFixed) {
          balanceState.title = '固定额度';
        } else {
          balanceState.title = '冻结金额';
        }

        balanceFormLoading.value = true;
        balanceState.visible = true;
        break;
      case 'priceMaintain':
        if (!priceMaintainState.canClick) return;
        priceMaintainState.canClick = false;

        saleProductList.value = await useSaleProductList();
        priceGradeList.value = await useDictData('priceGrade');
        priceMaintainData.value = await getCustomerPrice(item!.id);

        priceMaintainState.canClick = true;
        priceMaintainFormLoading.value = true;
        priceMaintainState.visible = true;
        break;
    }
  }

  const paramsStore = useParamsStore();

  function onClientCodeChange() {
    paramsStore.setClientCode('');
    loadList();
  }

  onActivated(() => {
    const clientCode = paramsStore.getClientCode;
    if (clientCode) {
      form.clientCode = clientCode;
      pageParams.pageNum = 1;
      loadList();
    }
  });
  onDeactivated(() => {
    paramsStore.setClientCode('');
  });
</script>
