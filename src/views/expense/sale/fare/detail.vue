<template>
  <div class="sale-fare-detail">
    <div class="mb-20px text-2xl" v-if="form.salesPriceName"> {{ form.salesPriceName }}名称的销售运费 </div>
    <el-form size="small" inline :model="form" :rules="rules" ref="formRef" class="filter-form" :disabled="isLook">
      <el-form-item label="销售产品编号" prop="promotingProductsCode">
        <el-select
          placeholder="请选择销售产品编号"
          :disabled="isEdit"
          :model-value="form.promotingProductsCode"
          @change="onChangeProductCode"
          filterable
        >
          <el-option
            v-for="item in saleProductList"
            :key="item.productsId"
            :label="item.promotingProductsCode"
            :value="item.promotingProductsCode"
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
      <el-form-item label="销售运费价格名称" prop="salesPriceName">
        <el-input v-model="form.salesPriceName" placeholder="请输入销售运费价格名称" />
      </el-form-item>
      <el-form-item label="销售运费价格等级" prop="priceGrade">
        <el-select placeholder="请选择销售运费价格等级" v-model="form.priceGrade" filterable>
          <el-option v-for="item in priceGradeList" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
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
        :disabled="!form.promotingProductsCode || isLook"
        :loading="loading.importLoading"
        @click="operate('import')"
      />
      <add-button
        :disabled="!form.promotingProductsCode || isLook"
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
        :disabled="isSaveAs || !form.promotingProductsCode || isLook"
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
    name: 'SaleFareDetail',
    components: { ImportButton, ImportDialog },
  });
</script>

<script lang="ts" setup>
  import { onMounted, reactive, ref, unref } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useRoute, useRouter } from 'vue-router';
  import { useTabs } from '@/hooks/web/useTabs';
  import {
    addSaleFare,
    CommonFarePriceDetailList,
    exportSaleFare,
    getSaleFareDetail,
    getSaleFarePriceDetail,
    SaleFareParams,
    updateSaleFare,
  } from '@/api/expense';
  import { useCurrencyList, useDictData, useSaleProductList } from '@/hooks/select/useSelect';
  import { CurrencyItem, DictOptionItem, SaleProductItem } from '@/api/sys';
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
    isAdd: '新增销售运费',
    isEdit: '编辑销售运费',
    isSaveAs: '另存为销售运费',
    isLook: '销售运费详情',
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

  const importDataParams = ref({ promotingProductsCode: '' });
  const importData = importDialogState(UploadApi.SaleFare, '', importDataParams);
  async function onImportSuccess({ getData, close }) {
    const { tableHeader, tableBody } = getData();
    listData.tableHeader = tableHeader;
    listData.tableBody = tableBody;
    close && close();
  }

  const form = reactive({
    promotingProductsCode: '',
    currency: '',
    salesPriceName: '',
    priceGrade: '公报价',
    dateRange: [] as string[],
    startTime: '',
    endTime: '',
  });
  const formRef = ref('');
  const rules = reactive({
    promotingProductsCode: [{ required: true, message: '请选择一个产品编号', trigger: 'change' }],
    currency: [{ required: true, message: '请选择收费币种', trigger: 'change' }],
    salesPriceName: [{ required: true, message: '销售运费价格名称不能为空', trigger: 'blur' }],
    priceGrade: [{ required: true, message: '销售运费价格等级不能为空', trigger: 'blur' }],
    dateRange: [{ required: true, message: '请选择生效至结束时间', trigger: 'change' }],
  });
  const loading = reactive({
    dataLoading: false,
    saveLoading: false,
    saveAsLoading: false,
    exportLoading: false,
    importLoading: false,
  });

  async function onChangeProductCode(val) {
    loading.dataLoading = true;
    try {
      const data = await getSaleFarePriceDetail(val);
      if (!data) return;
      const { tableHeader, tableBody } = data;
      listData.tableHeader = tableHeader;
      listData.tableBody = tableBody;
      form.promotingProductsCode = val;
      importDataParams.value.promotingProductsCode = val;
    } catch (e) {
      console.error(e);
    } finally {
      loading.dataLoading = false;
    }
  }

  async function initial() {
    if (!!id) {
      const {
        promotingProductsCode,
        salesPriceName,
        priceGrade,
        currency,
        startTime,
        endTime,
        sellSalesPriceDetailsListTemp: { tableHeader, tableBody },
      } = await getSaleFareDetail(id);

      form.promotingProductsCode = promotingProductsCode;
      form.salesPriceName = salesPriceName;
      form.currency = currency;
      form.priceGrade = priceGrade;
      form.dateRange = [startTime, endTime];
      listData.tableHeader = tableHeader;
      listData.tableBody = tableBody;
    }
  }

  const saleProductList = ref<SaleProductItem[]>([]); // 销售产品
  const currencyList = ref<CurrencyItem[]>([]);
  const priceGradeList = ref<DictOptionItem[]>([]);

  onMounted(async () => {
    loading.dataLoading = true;
    try {
      await initial();
      saleProductList.value = await useSaleProductList();
      currencyList.value = await useCurrencyList();
      priceGradeList.value = await useDictData('priceGrade');

      await setTitle(operateTitleMap[operateType]);
    } catch (e) {
      console.error(e);
    } finally {
      loading.dataLoading = false;
    }
  });

  async function operate(type: 'import' | 'export' | 'save' | 'saveAs') {
    if (type === 'import') {
      importDataParams.value.promotingProductsCode = form.promotingProductsCode;
      importData.visible = true;
    } else if (type === 'export') {
      loading.exportLoading = true;
      try {
        const { file } = await exportSaleFare(listData);
        let fileName = '销售运费模板';
        if (form.salesPriceName) {
          fileName = `${form.salesPriceName}下的${form.promotingProductsCode}销售运费模板`;
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
      const otherParams = pick(form, 'currency', 'priceGrade', 'promotingProductsCode', 'salesPriceName');

      const params: SaleFareParams = {
        startTime,
        endTime,
        ...otherParams,
        sellSalesPriceDetailsListTemp: listData,
      };
      try {
        if (unref(isEdit)) {
          await updateSaleFare({ ...params, salesPriceId: id });
          createBriefSuccessMsg('编辑成功');
        } else {
          await addSaleFare(params);
          createBriefSuccessMsg('创建成功');
        }
        await closeCurrent();
        await router.push({
          name: 'SaleFare',
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
