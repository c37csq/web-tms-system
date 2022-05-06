<template>
  <div>
    <div class="top_content">
      <div>
        <h3>成本流水</h3>
        <div style="margin-top: 20px" class="costWaterForm">
          <el-form
            ref="searchFormRef"
            size="small"
            label-width="85px"
            inline
            :model="costWaterForm"
            class="filter-form"
          >
            <el-form-item label="服务商名称" prop="serviceProviderId">
              <el-select placeholder="请选择服务商名称" v-model="costWaterForm.serviceProviderId" clearable filterable>
                <el-option
                  v-for="item in selectData.serviceCodeList"
                  :key="item.serviceProviderId"
                  :label="item.serviceProviderName"
                  :value="item.serviceProviderId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="流水类型" prop="amountType">
              <el-select placeholder="请选择流水类型" v-model="costWaterForm.amountType" clearable>
                <el-option key="1" value=" " label="全部" />
                <el-option key="2" value="-" label="扣款" />
                <el-option key="3" value="+" label="入款" />
              </el-select>
            </el-form-item>
            <el-form-item label="订单号" prop="externalno">
              <el-input placeholder="请输入订单号" v-model="costWaterForm.externalno" clearable />
            </el-form-item>
            <el-form-item label="费用类型" prop="expenseType">
              <el-select placeholder="请选择费用类型" v-model="costWaterForm.expenseType" clearable>
                <el-option
                  v-for="item in selectData.expenseTypeList"
                  :key="item.feeId"
                  :label="item.feeNameCn"
                  :value="item.feeNameCn"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="申请时间" prop="applactionDateRange">
              <el-date-picker
                v-model="costWaterForm.applactionDateRange"
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
          <div>
            <export-button :api="exportCost" :params="costWaterForm" filename="成本流水" />
          </div>
        </div>
      </div>
    </div>
    <div class="mt-10px">
      <el-table :data="tableList" size="small" border stripe v-loading="tableListLoading">
        <el-table-column prop="externalno" label="订单号" />
        <el-table-column prop="serviceProviderName" label="服务商名称" />
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
  import { getPickerDate } from '@/utils/dateUtil';
  import { getCostList, exportCost } from '@/api/finance/flow';
  import { CostListItem } from '@/api/finance/flow/model/costModel';
  import { getServiceSelectList } from '@/api/logistics/service';
  import { ServiceListItem } from '@/api/logistics/service/model/ServiceModel';
  import { useFeeTypeList } from '@/hooks/select/useSelect';
  import { FeeTypeItem } from '@/api/sys';

  export default defineComponent({
    name: 'CostFlow',
    setup() {
      // 成本流水表单
      const costWaterForm = reactive({
        serviceProviderId: '',
        amountType: '',
        externalno: '',
        expenseType: '',
        applactionDateRange: [],
        createStartTime: '',
        createEndTime: '',
      });
      // select下拉数据
      const selectData = reactive<{
        serviceCodeList: ServiceListItem[];
        expenseTypeList: FeeTypeItem[];
      }>({
        expenseTypeList: [],
        serviceCodeList: [],
      });
      // 给服务商余额列表
      const serviceData = ref([]);
      // 分页的数据
      const pageParams = pageData();
      const searchFormRef = ref();
      const tableListLoading = ref(false);
      // 数据列表
      const tableList = ref<CostListItem[]>([]);
      const exportLoading = ref(false);

      // 获取列表
      const loadList = async () => {
        tableListLoading.value = true;
        try {
          const { startTime: createStartTime, endTime: createEndTime } = getPickerDate(
            costWaterForm.applactionDateRange,
          );
          costWaterForm.createStartTime = createStartTime;
          costWaterForm.createEndTime = createEndTime;
          const params = {
            pageNum: pageParams.pageNum,
            pageSize: pageParams.pageSize,
            serviceProviderId: costWaterForm.serviceProviderId,
            externalno: costWaterForm.externalno,
            amountType: costWaterForm.amountType,
            expenseType: costWaterForm.expenseType,
            createStartTime: costWaterForm.createStartTime,
            createEndTime: costWaterForm.createEndTime,
          };
          const { list: _list, pageNum, pageSize, total } = await getCostList(params);
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

      const onReset = () => {
        formResetFields(searchFormRef);
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

      onMounted(async () => {
        await loadList();
        selectData.serviceCodeList = await getServiceSelectList();
        selectData.expenseTypeList = await useFeeTypeList();
      });

      return {
        costWaterForm,
        tableList,
        tableListLoading,
        pageParams,
        selectData,
        exportLoading,
        serviceData,
        searchFormRef,

        onPageChange,
        onReset,
        onSearch,
        exportCost,
      };
    },
  });
</script>
