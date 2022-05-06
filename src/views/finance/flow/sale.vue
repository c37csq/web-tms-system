<template>
  <div class="sale_water">
    <h3>销售流水</h3>
    <div class="saleWaterForm mt-20px">
      <el-form ref="searchFormRef" size="small" label-width="80px" inline :model="saleWaterForm" class="filter-form">
        <el-form-item label="客户代码" prop="enterpriseRecordId">
          <el-select placeholder="请选择客户代码" filterable clearable v-model="saleWaterForm.enterpriseRecordId">
            <el-option
              v-for="item in selectData.clientCodeList"
              :key="item.clientCode"
              :label="`${item.clientCode}[${item.companyName}]`"
              :value="item.clientCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="流水类型" prop="amountType">
          <el-select placeholder="请选择流水类型" v-model="saleWaterForm.amountType" clearable>
            <el-option key="1" value=" " label="全部" />
            <el-option key="2" value="-" label="扣款" />
            <el-option key="3" value="+" label="入款" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号" prop="externalno">
          <el-input placeholder="请输入订单号" v-model="saleWaterForm.externalno" clearable />
        </el-form-item>
        <el-form-item label="费用类型" prop="expenseType">
          <el-select placeholder="请选择费用类型" v-model="saleWaterForm.expenseType" clearable>
            <el-option
              v-for="item in selectData.expenseTypeList"
              :key="item.feeId"
              :label="item.feeNameCn"
              :value="item.feeNameCn"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="到账时间" prop="startTime">
          <el-date-picker
            v-model="saleWaterForm.startTime"
            type="date"
            :disabled-date="startDisabledDate"
            style="margin-right: 20px; width: 220px !important"
            placeholder="开始时间"
          />
          <el-date-picker
            v-model="saleWaterForm.endTime"
            type="date"
            style="width: 220px !important"
            :disabled-date="endDisabledDate"
            placeholder="结束时间"
            :default-time="defaultTime"
          />
        </el-form-item>
        <el-form-item>
          <basic-filter-search @reset="onReset" @search="onSearch" />
        </el-form-item>
      </el-form>
    </div>
    <div v-if="searchList.length !== 0 && saleWaterForm.enterpriseRecordId" style="margin: 20px 0">
      <el-table :data="searchList" size="small" row-key="id" border v-loading="searchLoading">
        <el-table-column prop="companyName" label="公司名称" />
        <el-table-column prop="objectName" label="名称" />
        <el-table-column prop="accountBalance" label="当前余额" />
        <el-table-column prop="accountFrozen" label="冻结金额" />
        <el-table-column prop="currency" label="币种" />
      </el-table>
    </div>
    <div class="mb-20px">
      <export-button :api="exportSale" :params="getExportParams()" :filename="`销售流水`" />
    </div>
    <div>
      <el-table :data="tableList" size="small" border stripe v-loading="tableListLoading">
        <el-table-column prop="externalno" label="订单号" />
        <el-table-column prop="clientCode" label="客户代码" />
        <el-table-column prop="amountType" label="流水类型">
          <template #default="scope">
            <span v-if="scope.row.amountType === '-'" class="text-delete">扣款</span>
            <span class="text-publish" v-else>入款</span>
          </template>
        </el-table-column>
        <el-table-column prop="actualAmount" label="实际金额" />
        <el-table-column prop="currency" label="币种" />
        <el-table-column prop="expenseType" label="费用类型" />
        <el-table-column prop="accountBalance" label="账号余额" />
        <el-table-column prop="createTime" label="发生时间" />
      </el-table>
      <basic-pagination
        :current="pageParams.pageNum"
        :size="pageParams.pageSize"
        :total="pageParams.total"
        @page-change="onPageChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { formResetFields } from '@/utils/tools';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { exportSale, getSaleList } from '@/api/finance/flow';
  import { SaleListItem, SaleListParams } from '@/api/finance/flow/model/saleModel';
  import { useClientCodeList, useFeeTypeList } from '@/hooks/select/useSelect';
  import { ClientItem, FeeTypeItem } from '@/api/sys';
  import { clientBaseInfo, ServiceEntry } from '@/api/finance/base';

  export default defineComponent({
    name: 'SaleFlow',
    setup() {
      // 销售流水表单
      const saleWaterForm = reactive({
        enterpriseRecordId: '',
        amountType: '',
        externalno: '',
        expenseType: '',
        startTime: '',
        endTime: '',
        createStartTime: '',
        createEndTime: '',
      });
      const searchFormRef = ref();
      // select下拉数据
      const selectData = reactive<{
        expenseTypeList: FeeTypeItem[];
        clientCodeList: ClientItem[];
      }>({
        expenseTypeList: [],
        clientCodeList: [],
      });
      // 分页数据
      const pageParams = pageData();
      const searchLoading = ref(false);
      const tableListLoading = ref(false);
      const searchList = ref<ServiceEntry[]>([]);
      // 表格数据
      const tableList = ref<SaleListItem[]>([]);
      const exportLoading = ref(false);

      // 客户公司数据
      async function searchClientInfoById() {
        searchList.value = [];
        if (saleWaterForm.enterpriseRecordId) {
          try {
            const data = await clientBaseInfo(saleWaterForm.enterpriseRecordId, 1);
            searchList.value.push(data);
          } catch (e) {
            console.error(e);
            searchList.value = [];
          }
        }
      }

      // 请求列表数据
      const loadList = async () => {
        tableListLoading.value = true;
        try {
          const params: SaleListParams = {
            pageNum: pageParams.pageNum,
            pageSize: pageParams.pageSize,
            enterpriseRecordId: saleWaterForm.enterpriseRecordId,
            externalno: saleWaterForm.externalno,
            amountType: saleWaterForm.amountType,
            expenseType: saleWaterForm.expenseType,
          };
          saleWaterForm.startTime && (params.createStartTime = formatToDateTime(saleWaterForm.startTime));
          saleWaterForm.endTime && (params.createEndTime = formatToDateTime(saleWaterForm.endTime));
          const { list: _list, pageNum, pageSize, total } = await getSaleList(params);
          tableList.value = _list;
          pageParams.pageNum = pageNum;
          pageParams.total = total;
          pageParams.pageSize = pageSize;
        } catch (e) {
          tableList.value = [];
          pageParams.total = 0;
        } finally {
          tableListLoading.value = false;
        }
      };

      // 导出
      const getExportParams = () => {
        const params: SaleListParams = {
          pageNum: pageParams.pageNum,
          pageSize: pageParams.pageSize,
          enterpriseRecordId: saleWaterForm.enterpriseRecordId,
          amountType: saleWaterForm.amountType,
          externalno: saleWaterForm.externalno,
          expenseType: saleWaterForm.expenseType,
        };
        saleWaterForm.startTime && (params.createStartTime = formatToDateTime(saleWaterForm.startTime));
        saleWaterForm.endTime && (params.createEndTime = formatToDateTime(saleWaterForm.endTime));
        return params;
      };

      const onReset = () => {
        formResetFields(searchFormRef);
        saleWaterForm.endTime = '';
        searchList.value = [];
        loadList();
      };

      const onSearch = () => {
        pageParams.pageNum = 1;
        loadList();
        searchClientInfoById();
      };

      // 开始时间不能超过当天也不能超过结束时间
      const startDisabledDate = (time) => {
        if (saleWaterForm.endTime) {
          return time.getTime() > (saleWaterForm.endTime as any).getTime();
        } else {
          return time.getTime() > Date.now();
        }
      };

      const endDisabledDate = (time) => {
        if (saleWaterForm.startTime) {
          return time.getTime() < (saleWaterForm.startTime as any).getTime() || time.getTime() > Date.now();
        } else {
          return time.getTime() > Date.now();
        }
      };

      const defaultTime = [new Date(2000, 2, 1, 23, 59, 59)];

      const onPageChange = (params: PageChangeParams) => {
        params.pageSize && (pageParams.pageSize = params.pageSize);
        params.pageNum && (pageParams.pageNum = params.pageNum);
        loadList();
      };

      onMounted(async () => {
        await loadList();
        selectData.expenseTypeList = await useFeeTypeList();
        selectData.clientCodeList = await useClientCodeList();
      });

      return {
        saleWaterForm,
        searchLoading,
        searchList,
        tableList,
        tableListLoading,
        pageParams,
        selectData,
        exportLoading,
        searchFormRef,

        onPageChange,
        getExportParams,
        endDisabledDate,
        defaultTime,
        startDisabledDate,
        onSearch,
        onReset,
        exportSale,
      };
    },
  });
</script>
