<template>
  <div class="incidentals-detail">
    <el-form size="small" inline :model="form" :rules="rules" ref="formRef" class="filter-form">
      <el-form-item label="服务商渠道编号" prop="serviceChannelCode">
        <el-select
          placeholder="请选择服务商渠道编号"
          @change="onChangeService"
          :disabled="isEdit || isLook"
          :model-value="form.serviceChannelCode"
          clearable
          filterable
        >
          <el-option
            v-for="item in serviceChannelList"
            :key="item.serviceChannelId"
            :label="item.serviceChannelCode"
            :value="item.serviceChannelCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收费币种" prop="currency">
        <el-select
          placeholder="请选择收费币种"
          v-model="form.currency"
          clearable
          filterable
          :disabled="isEdit || isLook"
        >
          <el-option
            v-for="item in currencyList"
            :key="item.currencyId"
            :label="item.currencyName"
            :value="item.currencySymbol"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="有效期" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="daterange"
          range-separator="至"
          :disabled="isLook"
          start-placeholder="生效时间"
          end-placeholder="到期时间"
        />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <add-button @click="operate('add')" :loading="loading.addLoading" :disabled="isLook" />
      <danger-button
        @click="operate('del')"
        :loading="loading.delLoading"
        :disabled="!selectTableData.length || isLook"
      />
      <import-button :loading="loading.saveAsLoading" :disabled="!isSaveAs || isLook" @click="operate('saveAs')"
        >另存为</import-button
      >
      <el-button
        round
        size="small"
        :loading="loading.saveLoading"
        type="primary"
        :disabled="!list.length || isSaveAs || isLook"
        @click="operate('save')"
      >
        保存
      </el-button>
    </div>

    <el-table
      :data="list"
      size="small"
      border
      stripe
      class="custom-table"
      @selection-change="onSelectTableData"
      v-loading="loading.dataLoading"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="costType" label="费用类型">
        <template #default="scope">
          <el-select
            size="small"
            :model-value="scope.row.costType"
            :disabled="isLook"
            @change="(val) => onChangePriceType(val, scope.$index)"
            filterable
          >
            <el-option
              v-for="item in feeTypeList.slice(2)"
              :key="item.feeId"
              :label="item.feeNameCn"
              :value="item.feeCode"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="chargeUnit" label="计费单位">
        <template #default="scope">
          <el-select
            size="small"
            @change="(val) => onChangeChargeUnit(val, scope.row)"
            :model-value="scope.row.chargeUnit"
            :disabled="isLook"
          >
            <el-option v-for="item in chargeUnitList" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="baseFeeList" label="基费">
        <template #default="scope">
          <el-select
            @change="(val) => onSelectChange(val, scope.row, 'baseFeeList')"
            size="small"
            :model-value="scope.row.baseFeeList"
            :disabled="[0, 1].includes(scope.row.chargeUnit) || isLook"
            multiple
            filterable
          >
            <el-option v-for="item in feeTypeList" :key="item.feeId" :label="item.feeNameCn" :value="item.feeNameCn" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" label="单价">
        <template #default="scope">
          <el-input
            size="small"
            v-model="scope.row.unitPrice"
            @change="(val) => onUnitPriceChange(val, scope.row)"
            placeholder="单价"
            :disabled="scope.row.chargeUnit === '4' || isLook"
          />
        </template>
      </el-table-column>
      <el-table-column prop="extraService" label="额外服务">
        <template #default="scope">
          <el-select size="small" v-model="scope.row.extraService" :disabled="isLook" clearable filterable>
            <el-option
              v-for="(item, idx) in extraServiceList"
              :key="idx"
              :label="item.extraServiceNameCn"
              :value="item.extraServiceCode"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="zoningCodeList" label="分区">
        <template #default="scope">
          <el-select
            @change="(val) => onSelectChange(val, scope.row, 'zoningCodeList')"
            size="small"
            :model-value="scope.row.zoningCodeList"
            filterable
            multiple
            :disabled="isLook"
          >
            <el-option
              v-for="item in partitionList"
              :key="item.zoningId"
              :label="item.zoningCode"
              :value="item.zoningCode"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="startWeight" label="起始重量">
        <template #default="scope">
          <el-input
            size="small"
            v-model="scope.row.startWeight"
            @change="(val) => onWeightChange(val, scope.row, 'start')"
            placeholder="起始重量"
            :disabled="isLook"
          />
        </template>
      </el-table-column>
      <el-table-column prop="endWeight" label="结束重量">
        <template #default="scope">
          <el-input
            size="small"
            v-model="scope.row.endWeight"
            @change="(val) => onWeightChange(val, scope.row, 'end')"
            placeholder="结束重量"
            :disabled="isLook"
          />
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="生效时间" width="160">
        <template #default="scope">
          <el-date-picker
            size="small"
            v-model="scope.row.startTime"
            @change="(val) => onDateChange(val, scope.row, 'start')"
            type="date"
            placeholder="生效时间"
            :disabled="isLook"
          />
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="160">
        <template #default="scope">
          <el-date-picker
            size="small"
            v-model="scope.row.endTime"
            @change="(val) => onDateChange(val, scope.row, 'end')"
            type="date"
            placeholder="结束时间"
            :disabled="isLook"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ImportButton } from '@/components/Button';

  export default defineComponent({
    name: 'CostIncidentalsDetail',
    components: { ImportButton },
  });
</script>

<script lang="ts" setup>
  import { ref, onMounted, reactive, unref } from 'vue';

  import { useRoute, useRouter } from 'vue-router';
  import { useTabs } from '@/hooks/web/useTabs';
  import {
    addCostIncidentals,
    getCostIncidentalsDetail,
    CostIncidentalsParams,
    updateCostIncidentals,
  } from '@/api/expense';
  import {
    useCurrencyList,
    useDictData,
    useExtraServiceList,
    useFeeTypeList,
    usePartitionList,
    useServiceChannelList,
  } from '@/hooks/select/useSelect';
  import {
    CurrencyItem,
    DictOptionItem,
    ExtraServiceItem,
    FeeTypeItem,
    PartitionItem,
    ServiceChannelItem,
  } from '@/api/sys';
  import { useMessage } from '@/hooks/web/useMessage';
  import { isNumGreaterEqualZero } from '@/utils/check';
  import { formValidate, getArrayDifference } from '@/utils/tools';
  import { getPickerDate, fillDateTime } from '@/utils/dateUtil';
  import { closeDetailRoute } from '@/logics/mitt/updateRoute';

  const { createConfirm, createMessage, createBriefSuccessMsg } = useMessage();

  const route = useRoute();
  const router = useRouter();
  const { setTitle, closeCurrent } = useTabs();

  const id = ~~route.params.id;
  const operateTitleMap = {
    isAdd: '新增成本杂费',
    isEdit: '编辑成本杂费',
    isSaveAs: '另存为成本杂费',
    isLook: '成本杂费详情',
  };
  const operateType = route.params.type as string; // isEdit isAdd isLook isSaveAs
  const isEdit = ref(operateType === 'isEdit'); // 编辑状态
  const isLook = ref(operateType === 'isLook'); // 详情
  const isSaveAs = ref(operateType === 'isSaveAs'); // 另存为

  type FormData = {
    serviceChannelCode: string;
    currency: string;
    dateRange: string[];
  };
  const form = reactive<FormData>({
    serviceChannelCode: '',
    currency: '',
    dateRange: [],
  });
  const rules = {
    serviceChannelCode: [{ required: true, message: '服务商渠道编号不能为空', trigger: 'change' }],
    currency: [{ required: true, message: '收费币种不能为空', trigger: 'change' }],
    dateRange: [{ required: true, message: '有效期不能为空', trigger: 'change' }],
  };
  const formRef = ref();

  /**
   * 切换服务商
   * @param val
   */
  async function onChangeService(val) {
    partitionList.value = []; // 重置分区
    const curService = unref(serviceChannelList).find((e) => e.serviceChannelCode === val);
    if (curService) {
      const { serviceChannelCode, teamCode } = curService;
      partitionList.value = await usePartitionList(teamCode);
      partitionList.value.unshift({
        zoningId: -1,
        zoningCode: '全部',
      });
      form.serviceChannelCode = serviceChannelCode;
    } else {
      form.serviceChannelCode = '';
    }
  }

  const list = ref<any[]>([]);
  const selectTableData = ref<any[]>([]);
  function onSelectTableData(val) {
    selectTableData.value = val;
  }
  const listId = ref(1);
  const loading = reactive({
    dataLoading: false,
    addLoading: false,
    delLoading: false,
    saveLoading: false,
    saveAsLoading: false,
  });

  async function initial() {
    if (!!id) {
      const { serviceChannelCode, currency, startTime, endTime, costSundryChargesDetailsList } =
        await getCostIncidentalsDetail(id);
      if (serviceChannelCode) {
        form.serviceChannelCode = serviceChannelCode;
        form.currency = currency;
        form.dateRange = [startTime, endTime];
        list.value = costSundryChargesDetailsList.map((e, idx) => {
          e.id = idx + 1; // 编辑也要保证有 id
          e.chargeUnit = +e.chargeUnit;
          e.zoningCode && (e.zoningCodeList = e.zoningCode.split(','));
          e.baseFee && (e.baseFeeList = e.baseFee.split(','));
          return e;
        });
        listId.value = costSundryChargesDetailsList.length + 1; // 改变唯一值

        // 编辑状态下获取当前渠道下的分区列表
        serviceChannelList.value = await useServiceChannelList();
        const curService = unref(serviceChannelList).find((e) => e.serviceChannelCode === serviceChannelCode);
        if (curService) {
          const { teamCode } = curService;
          const schemeList = await usePartitionList(teamCode);
          partitionList.value = [...unref(partitionList), ...schemeList];
        }
      } else {
        createMessage.error('加载成本杂费详情异常');
        await closeCurrent();
      }
    }
  }

  const serviceChannelList = ref<ServiceChannelItem[]>([]); // 服务商渠道
  const currencyList = ref<CurrencyItem[]>([]);
  const feeTypeList = ref<FeeTypeItem[]>([]);
  const extraServiceList = ref<ExtraServiceItem[]>([]);
  const chargeUnitList = ref<DictOptionItem[]>([]);
  const partitionList = ref<PartitionItem[]>([{ zoningId: 0, zoningCode: '全部' }]); // 分区下拉

  onMounted(async () => {
    loading.dataLoading = true;
    try {
      await initial();
      serviceChannelList.value = await useServiceChannelList();
      currencyList.value = await useCurrencyList();
      feeTypeList.value = await useFeeTypeList();
      feeTypeList.value.unshift({
        feeId: 9999999,
        feeCode: 'all',
        feeNameCn: '全部',
      });
      extraServiceList.value = await useExtraServiceList();
      chargeUnitList.value = await useDictData('chargeUnit');

      await setTitle(operateTitleMap[operateType]);
    } catch (e) {
      console.error(e);
    } finally {
      loading.dataLoading = false;
    }
  });

  function onChangePriceType(val, idx) {
    const costTypeName = unref(feeTypeList).find((e) => e.feeCode === val)?.feeNameCn;
    if (costTypeName) {
      list.value[idx].costType = val;
      list.value[idx].costTypeName = costTypeName;
    }
  }
  // 基费/分区改变事件
  const onSelectChange = (val, item, type) => {
    const length = val.length;
    item[type] = val;

    if (val[length - 1] === '全部') {
      val.splice(0, length - 1);
    } else if (val.includes('全部')) {
      val.splice(
        val.findIndex((item) => item === '全部'),
        1,
      );
    }
  };
  // 切换计费单位
  const onChangeChargeUnit = (val, item) => {
    if ([0, 1].includes(val)) {
      item.baseFeeList = ['全部'];
    } else if (val.toString() === '4') {
      item.unitPrice = '0';
    }
    item.chargeUnit = val;
  };
  const onUnitPriceChange = (val, item) => {
    if (val && !isNumGreaterEqualZero(val)) {
      createMessage.error('输入的值需要大于等于0');
    }
    item.unitPrice = val;
  };
  const onWeightChange = (val, item, type = 'start') => {
    switch (type) {
      case 'start':
        if (!!item.endWeight && +val > +item.endWeight) {
          createMessage.error('起始重量不能大于结束重量');
        }
        item.startWeight = val;
        break;
      case 'end':
        if (!!item.startWeight && +val < +item.startWeight) {
          createMessage.error('结束重量不能小于起始重量');
        }
        item.endWeight = val;
        break;
    }
  };
  const onDateChange = (val, item, type) => {
    switch (type) {
      case 'start':
        if (item.endTime && +val > +item.endTime) {
          createMessage.error('生效时间不能大于结束时间');
        }
        break;
      case 'end':
        if (item.startTime && +val < +item.startTime) {
          createMessage.error('结束时间不能小于生效时间');
        }
        break;
    }
  };

  async function operate(type) {
    switch (type) {
      case 'add':
        loading.addLoading = true;
        list.value.push({
          id: listId.value++,
          costType: '', // 费用类型
          costTypeName: '', // 费用类型名称
          chargeUnit: '', // 计费单位
          baseFeeList: ['全部'], // 基费代码
          baseFee: '', // 基费
          unitPrice: '', // 单价
          extraService: '', // 额外服务
          extraServiceName: '', // 额外服务名称
          zoningCodeList: ['全部'], // 分区代码
          zoningCode: '', // 分区代码
          startWeight: '', // 开始重量段
          endWeight: '', // 结束重量段
          startTime: '', // 结束时间
          endTime: '', // 结束时间
        });
        loading.addLoading = false;
        break;
      case 'del':
        createConfirm({
          title: '提示',
          message: '请确认是否删除选中的数据',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
        })
          .then(() => {
            if (unref(list).length === unref(selectTableData).length) {
              list.value = [];
            }
            list.value = getArrayDifference(unref(list), unref(selectTableData));
          })
          .catch(() => {});
        break;
      case 'save':
      case 'saveAs':
        await formValidate(formRef);
        if (isSaveAs.value) {
          loading.saveAsLoading = true;
        } else {
          loading.saveLoading = true;
        }
        const { startTime, endTime } = getPickerDate(form.dateRange);

        const params: CostIncidentalsParams = {
          serviceChannelCode: form.serviceChannelCode,
          currency: form.currency,
          startTime: startTime,
          endTime: endTime,
        };

        // 处理列表数据
        params.costSundryChargesDetailsList = list.value.map((e) => {
          if (e.startTime || e.endTime) {
            const { startTime, endTime } = fillDateTime(e.startTime, e.endTime);
            e.startTime = startTime;
            e.endTime = endTime;
          }

          e.zoningCode = e.zoningCodeList.join(',');
          e.baseFee = e.baseFeeList.join(',');
          return e;
        });

        try {
          if (unref(isEdit)) {
            await updateCostIncidentals({ ...params, sundryChargesId: id });
            createBriefSuccessMsg('编辑成功');
          } else {
            await addCostIncidentals(params);
            createBriefSuccessMsg('创建成功');
          }
          await closeCurrent();
          await router.push({
            name: 'CostIncidentals',
          });
          closeDetailRoute();
        } catch (e) {
          console.error(e);
        }
        if (isSaveAs.value) {
          loading.saveAsLoading = false;
        } else {
          loading.saveLoading = false;
        }
        break;
    }
  }
</script>
