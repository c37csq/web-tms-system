<template>
  <div class="cost-fare-detail">
    <div class="mb-20px text-2xl" v-if="form.costPriceName"> {{ form.costPriceName }}名称的成本运费 </div>
    <el-form size="small" inline :model="form" :rules="rules" ref="formRef" class="filter-form" :disabled="isLook">
      <el-form-item label="服务商渠道编号" prop="serviceChannelCode">
        <el-select
          placeholder="请选择服务商渠道编号"
          :disabled="isEdit || isLook"
          :model-value="form.serviceChannelCode"
          @change="onChangeServiceChannel"
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
        <el-select placeholder="请选择收费币种" v-model="form.currency" clearable filterable :disabled="isEdit">
          <el-option
            v-for="item in currencyList"
            :key="item.currencyId"
            :label="item.currencyName"
            :value="item.currencySymbol"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="成本运费名称" prop="costPriceName">
        <el-input v-model="form.costPriceName" placeholder="请输入成本运费名称" />
      </el-form-item>
      <el-form-item label="有效期" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="生效时间"
          end-placeholder="到期时间"
        />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <import-button
        :disabled="!form.serviceChannelCode || isLook"
        :loading="loading.importLoading"
        @click="operate('import')"
      />
      <add-button
        :disabled="!form.serviceChannelCode || isLook"
        :loading="loading.exportLoading"
        @click="operate('export')"
      >
        导出
      </add-button>
      <import-button :loading="loading.saveAsLoading" :disabled="isAdd || isEdit || isLook" @click="operate('saveAs')">
        另存为
      </import-button>
      <el-button
        round
        size="small"
        type="primary"
        :disabled="isSaveAs || !form.serviceChannelCode || isLook"
        :loading="loading.saveLoading"
        @click="operate('save')"
      >
        保存
      </el-button>
    </div>

    <el-table
      :data="listData.tableBody"
      size="small"
      border
      stripe
      class="custom-table"
      v-loading="loading.dataLoading"
    >
      <el-table-column
        v-for="(item, index) in listData.tableHeader"
        :key="index"
        :fixed="item.prop === 'weight'"
        :prop="item.prop"
        :label="item.label"
      >
        <template #default="scope">
          <template v-if="scope.column.property === 'weight'">
            <span> {{ scope.row.weight }}</span>
          </template>
          <template v-else>
            <el-input size="small" v-model="scope.row[item.prop]" :disabled="isLook" />
          </template>
        </template>
      </el-table-column>
    </el-table>

    <import-dialog
      v-model="importData.visible"
      :action="importData.action"
      :params="importData.params"
      :template-url="importData.templateUrl"
      @success="onImportSuccess"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ImportButton } from '@/components/Button';
  import ImportDialog from '@/components/Dialog/src/ImportDialog.vue';

  export default defineComponent({
    name: 'CostFareDetail',
    components: { ImportButton, ImportDialog },
  });
</script>

<script lang="ts" setup>
  import { onMounted, reactive, ref, unref } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useRoute, useRouter } from 'vue-router';
  import { useTabs } from '@/hooks/web/useTabs';
  import {
    addCostFare,
    CommonFarePriceDetailList,
    exportCostFare,
    getCostFareDetail,
    getCostFarePriceDetail,
    CostFareParams,
    updateCostFare,
  } from '@/api/expense';
  import { useCurrencyList, useServiceChannelList } from '@/hooks/select/useSelect';
  import { CurrencyItem, ServiceChannelItem } from '@/api/sys';
  import { importDialogState, UploadApi } from '@/api/sys/upload';
  import { formValidate } from '@/utils/tools';
  import { getPickerDate } from '@/utils/dateUtil';
  import { downloadByBase64 } from '@/utils/file/download';
  import { MimeEnum } from '@/enums/mimeEnum';
  import { pick } from 'lodash-es';
  import { closeDetailRoute } from '@/logics/mitt/updateRoute';

  const { createBriefSuccessMsg } = useMessage();

  const route = useRoute();
  const router = useRouter();
  const { setTitle, closeCurrent } = useTabs();

  const id = ~~route.params.id;
  const operateTitleMap = {
    isAdd: '新增成本运费',
    isEdit: '编辑成本运费',
    isSaveAs: '另存为成本运费',
    isLook: '成本运费详情',
  };
  const operateType = route.params.type as string; // isEdit isAdd isLook isSaveAs
  const isAdd = ref(operateType === 'isAdd');
  const isEdit = ref(operateType === 'isEdit'); // 编辑状态
  const isLook = ref(operateType === 'isLook'); // 详情
  const isSaveAs = ref(operateType === 'isSaveAs'); // 另存为

  const listData = reactive<CommonFarePriceDetailList>({
    tableHeader: [],
    tableBody: [],
  });

  const importDataParams = ref({ serviceChannelCode: '' });
  const importData = importDialogState(UploadApi.CostFare, '', importDataParams);
  async function onImportSuccess({ getData, close }) {
    const { tableHeader, tableBody } = getData();
    listData.tableHeader = tableHeader;
    listData.tableBody = tableBody;
    close && close();
  }

  const form = reactive({
    serviceChannelCode: '',
    costPriceName: '',
    currency: '',
    dateRange: [] as string[],
    startTime: '',
    endTime: '',
  });
  const formRef = ref('');
  const rules = reactive({
    serviceChannelCode: [{ required: true, message: '请选择一个服务商渠道', trigger: 'change' }],
    costPriceName: [{ required: true, message: '成本运费名称不能为空', trigger: 'blur' }],
    currency: [{ required: true, message: '请选择一个币种', trigger: 'change' }],
    dateRange: [{ required: true, message: '请选择生效至结束时间', trigger: 'change' }],
  });
  const loading = reactive({
    dataLoading: false,
    saveLoading: false,
    saveAsLoading: false,
    exportLoading: false,
    importLoading: false,
  });

  async function onChangeServiceChannel(val) {
    loading.dataLoading = true;
    try {
      const data = await getCostFarePriceDetail(val);
      if (!data) return;
      const { tableHeader, tableBody } = data;
      listData.tableHeader = tableHeader;
      listData.tableBody = tableBody;
      form.serviceChannelCode = val;
      importDataParams.value.serviceChannelCode = val;
    } catch (e) {
      console.error(e);
    } finally {
      loading.dataLoading = false;
    }
  }

  async function initial() {
    if (!!id) {
      const {
        serviceChannelCode,
        costPriceName,
        currency,
        startTime,
        endTime,
        costPriceDetailsListTemp: { tableHeader, tableBody },
      } = await getCostFareDetail(id);

      form.serviceChannelCode = serviceChannelCode;
      form.costPriceName = costPriceName;
      form.currency = currency;
      form.dateRange = [startTime, endTime];
      listData.tableHeader = tableHeader;
      listData.tableBody = tableBody;
    }
  }

  const serviceChannelList = ref<ServiceChannelItem[]>([]);
  const currencyList = ref<CurrencyItem[]>([]);

  onMounted(async () => {
    loading.dataLoading = true;
    try {
      await initial();
      currencyList.value = await useCurrencyList();
      serviceChannelList.value = await useServiceChannelList();

      await setTitle(operateTitleMap[operateType]);
    } catch (e) {
      console.error(e);
    } finally {
      loading.dataLoading = false;
    }
  });

  async function operate(type: 'import' | 'export' | 'save' | 'saveAs') {
    if (type === 'import') {
      importDataParams.value.serviceChannelCode = form.serviceChannelCode;
      importData.visible = true;
    } else if (type === 'export') {
      loading.exportLoading = true;
      try {
        const { file } = await exportCostFare(listData);
        let fileName = '销售运费模板';
        if (form.costPriceName) {
          fileName = `${form.costPriceName}下的${form.serviceChannelCode}销售运费模板`;
        }
        downloadByBase64(file, `${fileName}_${+new Date()}`, MimeEnum.xlsx);
      } catch (e) {
        console.error(e);
      } finally {
        loading.exportLoading = false;
      }
    } else {
      await formValidate(formRef);
      if (unref(isSaveAs)) {
        loading.saveAsLoading = true;
      } else {
        loading.saveLoading = true;
      }
      const { startTime, endTime } = getPickerDate(form.dateRange);
      const otherParams = pick(form, 'currency', 'serviceChannelCode', 'costPriceName');
      const params: CostFareParams = {
        startTime,
        endTime,
        ...otherParams,
        costPriceDetailsListTemp: listData,
      };
      try {
        if (unref(isEdit)) {
          await updateCostFare({ ...params, costPriceId: id });
          createBriefSuccessMsg('编辑成功');
        } else {
          await addCostFare(params);
          createBriefSuccessMsg('创建成功');
        }
        await closeCurrent();
        await router.push({
          name: 'CostFare',
        });
        closeDetailRoute();
      } catch (e) {
        console.error(e);
      } finally {
        if (unref(isSaveAs)) {
          loading.saveAsLoading = false;
        } else {
          loading.saveLoading = false;
        }
      }
    }
  }
</script>
