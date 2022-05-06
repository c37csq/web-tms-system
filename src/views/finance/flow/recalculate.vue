<template>
  <div class="recalculate">
    <el-form ref="searchFormRef" :model="form" size="small" inline class="filter-form">
      <el-form-item label="订单号" prop="externalno">
        <el-input
          class="long-input"
          v-model="form.externalno"
          placeholder="支持模糊查询/批量查询(用逗号/空格隔开)"
          clearable
        />
      </el-form-item>
      <el-form-item label="仓库代码" prop="warehouseCode">
        <el-select placeholder="请选择仓库代码" v-model="form.warehouseCode" clearable filterable>
          <el-option
            v-for="item in warehouseList"
            :key="item.warehouseId"
            :label="item.warehouseCode"
            :value="item.warehouseCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服务商及渠道" prop="serviceProviderCode">
        <el-select
          placeholder="请选择服务商"
          :model-value="form.serviceProviderCode"
          @change="onChangeService"
          clearable
          filterable
        >
          <el-option
            v-for="item in serviceCodeList"
            :key="item.serviceProviderId"
            :label="item.serviceProviderCode"
            :value="item.serviceProviderCode"
          />
        </el-select>
        <el-select placeholder="请选择服务商渠道" v-model="form.serviceChannelCode" clearable filterable>
          <el-option
            v-for="item in serviceChannelCodeList"
            :key="item.serviceChannelId"
            :label="item.serviceChannelCode"
            :value="item.serviceChannelCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发生时间" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]"
        />
      </el-form-item>
      <el-form-item label="账单类型" prop="billType">
        <el-select v-model="form.billType" @change="onSearch">
          <el-option label="销售" value="1" />
          <el-option label="成本" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <basic-filter-search @reset="onReset" @search="onSearch" />
      </el-form-item>
    </el-form>

    <div class="mt-20px mb-20px">
      <import-button v-if="form.billType === '1'" @click="recalculate('batchSale')"> 批量销售重新计费 </import-button>
      <add-button v-if="form.billType === '2'" @click="recalculate('batchCost')"> 批量成本重新计费 </add-button>
    </div>

    <el-table :data="list" size="small" border stripe @selection-change="onTableSelect" ref="tableRef">
      <el-table-column type="selection" width="50" />
      <el-table-column
        v-for="(item, idx) in columns"
        :key="idx"
        :prop="item.prop"
        :label="item.label"
        :formatter="item.formatter"
      />
    </el-table>

    <basic-pagination
      :current="pageParams.pageNum"
      :size="pageParams.pageSize"
      :total="pageParams.total"
      @page-change="onPageChange"
    />

    <basic-dialog
      @close="onRecalculateClose"
      :showFooter="false"
      width="880px"
      v-model="recalculateDialogVisible"
      title="重新计费"
    >
      <el-tabs v-model="tabsName" type="card" @tab-click="onTabClick">
        <el-tab-pane label="销售" name="sale">
          <import-button @click="recalculate('sale')">销售重新计费</import-button>
        </el-tab-pane>
        <el-tab-pane label="成本" name="cost">
          <add-button @click="recalculate('cost')">成本重新计费</add-button>
        </el-tab-pane>
      </el-tabs>

      <el-table
        style="height: 300px !important; overflow-y: auto !important"
        :data="recalculateList"
        size="small"
        border
        stripe
        class="mt-20px"
        :key="tableKey"
        ref="tableRef"
      >
        <el-table-column
          v-for="(item, idx) in recalculateColumns"
          :key="idx"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
        />
      </el-table>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, h, onMounted, reactive, ref } from 'vue';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { formResetFields } from '@/utils/tools';
  import { getPickerDate } from '@/utils/dateUtil';
  import { getFlow, getRecalculateList, recalculateChange } from '@/api/finance/flow';
  import { RecalculateListItem } from '@/api/finance/flow/model/recalculate';
  import { useServiceChannelList, useWarehouseList } from '@/hooks/select/useSelect';
  import { ServiceChannelItem, WarehouseItem } from '@/api/sys';
  import { getServiceSelectList } from '@/api/logistics/service';
  import { ServiceListItem } from '@/api/logistics/service/model/ServiceModel';
  import { useMessage } from '@/hooks/web/useMessage';
  import BasicDialog from '@/components/Dialog/src/BasicDialog.vue';
  import { BasicTableColumn } from '@/components/Table/';

  export default defineComponent({
    name: 'Recalculate',
    components: { BasicDialog },
    setup() {
      const columns: BasicTableColumn[] = [
        {
          label: '订单号',
          prop: 'externalno',
          formatter: (row) => {
            return row.externalno;
          },
        },
        {
          label: '服务商代码',
          prop: 'serviceProviderCode',
          formatter: (row) => {
            return row.serviceProviderCode;
          },
        },
        {
          label: '仓库',
          prop: 'warehouseCode',
          formatter: (row) => {
            return row.warehouseCode;
          },
        },
        {
          label: '币种',
          prop: 'currency',
          formatter: (row) => {
            return row.currency;
          },
        },
        {
          label: '计费金额',
          prop: 'price',
          formatter: (row) => {
            return row.price;
          },
        },
        {
          label: '操作',
          prop: 'operate',
          formatter: (row) => {
            return h(
              'span',
              {
                class: 'el-button el-button--text el-button--small cursor-pointer',
                onClick: () => showRecalculate(row),
              },
              '重新计费',
            );
          },
        },
      ];
      const { createConfirm, createBriefSuccessMsg, createMessage } = useMessage();

      const tabsName = ref('sale');
      const recalculateColumns: BasicTableColumn[] = [
        {
          label: '客户代码',
          prop: 'clientCode',
          formatter: (row) => {
            return row.clientCode;
          },
        },
        {
          label: '费用类型',
          prop: 'expenseType',
          formatter: (row) => {
            return row.expenseType;
          },
        },
        {
          label: '计费金额',
          prop: 'actualAmount',
          formatter: (row) => {
            return row.actualAmount;
          },
        },
        {
          label: '发生时间',
          prop: 'createTime',
          formatter: (row) => {
            return row.createTime;
          },
        },
        {
          label: '流水类型',
          prop: 'amountType',
          formatter: (row) => {
            return h('span', {}, row.amountType === '+' ? '入款' : '扣款');
          },
        },
        {
          label: '创建人',
          prop: 'createBy',
          formatter: (row) => {
            return row.createBy;
          },
        },
      ];
      const serviceChannelCodeList = ref<ServiceChannelItem[]>([]);
      const typeMap = {
        cost: {
          message: '确认重计成本费用吗？',
          val: 2,
          params: [],
          label: '服务商代码',
          prop: 'serviceProviderName',
          list: [],
        },
        sale: {
          message: '确认重计销售费用吗？',
          val: 1,
          params: [],
          label: '客户代码',
          prop: 'clientCode',
          list: [],
        },
        batchCost: { message: '确认批量重计成本费用吗？', val: 2, params: [] },
        batchSale: { message: '确认批量重计销售费用吗？', val: 1, params: [] },
      };
      const list = ref<RecalculateListItem[]>([]);
      const pageParams = pageData();
      const form = reactive({
        externalno: '',
        warehouseCode: '',
        serviceProviderCode: '',
        dateRange: [],
        createStartTime: '',
        createEndTime: '',
        serviceChannelCode: '',
        billType: '1', // 账单类型 1 销售 2 成本
      });
      const warehouseList = ref<WarehouseItem[]>([]);
      const serviceCodeList = ref<ServiceListItem[]>([]);
      const tableSelectedData = ref([]);
      const tableRef = ref();
      const tableKey = ref(1);
      const curRecalculate = ref({});
      const requestTmp = ref(true);
      const recalculateDialogVisible = ref(false);
      const recalculateList = ref([]);
      const searchFormRef = ref();

      const showRecalculate = async (item) => {
        if (!requestTmp.value) {
          return;
        }
        requestTmp.value = false;
        try {
          const { cspProviderBalanceLogList: costList, sysEnterpriseBalanceLogList: saleList } = (await getFlow(
            item.externalno,
          )) as any;
          typeMap.cost.list = costList;
          typeMap.sale.list = saleList;
          recalculateList.value = typeMap[tabsName.value].list;
          curRecalculate.value = item;
          tableKey.value++;
          recalculateDialogVisible.value = true;
        } catch (e) {
          console.error(e);
        } finally {
          requestTmp.value = true;
        }
      };

      const onRecalculateClose = () => {
        tabsName.value = 'sale';
        curRecalculate.value = {};
        recalculateList.value = [];
        recalculateColumns.splice(0, 1, {
          label: '客户代码',
          prop: 'clientCode',
          formatter: (row) => {
            return row.clientCode;
          },
        });
        recalculateDialogVisible.value = false;
      };

      const onReset = () => {
        formResetFields(searchFormRef);
        form.serviceChannelCode = '';
        loadList();
      };

      const onTabClick = ({ props: { name } }) => {
        tableKey.value++;
        recalculateList.value = typeMap[tabsName.value].list;
        recalculateColumns.splice(0, 1, {
          label: typeMap[name].label,
          prop: typeMap[name].prop,
          formatter: (row) => {
            return row[typeMap[name].prop];
          },
        });
      };

      /**
       * 重新计费(成本/销售)
       * @param {'cost'|'sale'|'batchCost'|'batchSale'} type
       */
      const recalculate = async (type) => {
        if (!tableSelectedData.value.length && type.includes('batch')) {
          createMessage.info('请至少选择一个订单进行重置');
          return;
        }
        try {
          try {
            createConfirm({
              title: '提示',
              message: typeMap[type].message,
              type: 'info',
              beforeClose: async (action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true;
                  try {
                    if ((curRecalculate.value as any).externalno) {
                      typeMap[type].params = [(curRecalculate.value as any).externalno];
                    } else {
                      typeMap[type].params = tableSelectedData.value.map((e: any) => e.externalno);
                    }
                    await recalculateChange({
                      costType: typeMap[type].val,
                      orderCodeList: typeMap[type].params,
                    });
                    createBriefSuccessMsg('成功');
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
              .then(() => {
                loadList();
              })
              .catch(() => {});
          } catch (e) {
            console.error(e);
          }
        } catch (e) {
          console.error(e);
        }
      };

      const onTableSelect = (val) => {
        (tableSelectedData.value as any) = [...val];
      };

      const onChangeService = async (val) => {
        form.serviceChannelCode = '';
        try {
          serviceChannelCodeList.value = await useServiceChannelList(val);
          form.serviceProviderCode = val;
        } catch (e) {
          console.error(e);
        }
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

      const loadList = async () => {
        try {
          const { startTime, endTime } = getPickerDate(form.dateRange);
          form.createStartTime = startTime;
          form.createEndTime = endTime;
          const params = {
            pageNum: pageParams.pageNum,
            pageSize: pageParams.pageSize,
            externalno: form.externalno,
            warehouseCode: form.warehouseCode,
            serviceProviderCode: form.serviceProviderCode,
            serviceChannelCode: form.serviceChannelCode,
            createStartTime: form.createStartTime,
            createEndTime: form.createEndTime,
            billType: form.billType,
          };
          const { list: _list, pageNum, pageSize, total } = await getRecalculateList(params);
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

      onMounted(async () => {
        await loadList();
        warehouseList.value = await useWarehouseList();
        serviceCodeList.value = await getServiceSelectList();
      });

      return {
        columns,
        tabsName,
        recalculateColumns, // 单个审核列表
        tableRef,
        tableKey,
        recalculateDialogVisible,
        recalculateList,
        serviceChannelCodeList,
        typeMap,
        list,
        pageParams,
        form,
        warehouseList,
        serviceCodeList,
        searchFormRef,

        onPageChange,
        recalculate,
        onReset,
        onSearch,
        onTableSelect,
        onChangeService,
        onTabClick,
        onRecalculateClose,
      };
    },
  });
</script>
