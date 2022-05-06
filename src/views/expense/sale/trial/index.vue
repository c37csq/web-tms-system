<template>
  <div class="sale-trial">
    <el-form size="small" inline :model="form" :rules="rules" ref="trialFormRef" class="filter-form mb-20px">
      <el-form-item label="销售产品" prop="promotingProductsCode">
        <el-select placeholder="请选择销售产品" v-model="form.promotingProductsCode" clearable filterable>
          <el-option
            v-for="item in saleProductList"
            :key="item.productsId"
            :label="item.promotingProductsCode"
            :value="item.promotingProductsCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="仓库" prop="warehouseCode">
        <el-select placeholder="请选择仓库" v-model="form.warehouseCode" clearable filterable>
          <el-option
            v-for="item in warehouseList"
            :key="item.warehouseId"
            :label="item.warehouseCode"
            :value="item.warehouseCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="目的国家" prop="stateCode">
        <el-select placeholder="请选择目的国家" v-model="form.stateCode" clearable filterable>
          <el-option
            v-for="item in countryList"
            :key="item.stateCode"
            :label="item.stateChineseName"
            :value="item.stateCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="州" prop="state">
        <el-input placeholder="请输入州" v-model="form.state" clearable />
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <el-input placeholder="请输入城市" v-model="form.city" clearable />
      </el-form-item>
      <el-form-item label="目的邮编" prop="zipCode">
        <el-input placeholder="请输入目的邮编" v-model="form.zipCode" clearable />
      </el-form-item>
      <el-form-item label="尺寸 长" prop="length">
        <el-input placeholder="长" v-model="form.length" clearable />
      </el-form-item>
      <el-form-item label="宽" prop="wide">
        <el-input placeholder="宽" v-model="form.wide" clearable />
      </el-form-item>
      <el-form-item label="高" prop="high">
        <el-input placeholder="高" v-model="form.high" clearable />
      </el-form-item>
      <el-form-item label="重量(KG)" prop="weight">
        <el-input placeholder="请输入重量" v-model="form.weight" clearable />
      </el-form-item>
      <el-form-item>
        <search-button @click="onSubmit">确认</search-button>
        <reset-button @click="onReset" />
      </el-form-item>
    </el-form>

    <el-table :data="list" size="small" border stripe v-loading="loading" empty-text="暂无结果">
      <el-table-column type="expand">
        <template #default="props">
          <div class="trial-detail-info" v-if="props.row.detailList.length">
            <div>
              <span>
                分区方案：<span class="font-bold">{{ props.row.schemeName }}</span>
              </span>
              <span class="ml-30px">
                分区代码：<span class="font-bold">{{ props.row.zoneCode }}</span>
              </span>
              <span class="ml-30px" v-if="props.row.weight">
                计费重量：<span class="font-bold">{{ props.row.weight }}</span>
              </span>
            </div>
            <el-table :data="props.row.detailList" size="small" border stripe>
              <el-table-column prop="costType" label="费用类型" />
              <el-table-column prop="chargeUnit" label="计费单位">
                <template #default="scope">
                  {{ scope.row.chargeUnit === '1' ? '票' : '百分比' }}
                </template>
              </el-table-column>
              <el-table-column prop="costValue" label="费用" />
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="promotingProductsCode" label="物流产品" />
      <el-table-column prop="costPrice" label="基本费用" />
      <el-table-column prop="otherCost" label="其他费用" />
      <el-table-column prop="allCost" label="总费用" />
      <el-table-column prop="currency" label="货币" />
    </el-table>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'SaleTrial',
  });
</script>

<script lang="ts" setup>
  import { ref, onMounted, reactive } from 'vue';
  import { useCountryList, useSaleProductList, useWarehouseList } from '@/hooks/select/useSelect';
  import { CountryItem, SaleProductItem, WarehouseItem } from '@/api/sys';
  import { checkLength, checkWide, checkHigh, checkWeight, validateZipCode } from '@/utils/check';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { saleTrial } from '@/api/expense/sale/trial';
  import { TrialResultItem } from '@/api/expense';

  const form = reactive({
    promotingProductsCode: '', // 产品编号
    warehouseCode: '', // 仓库代码
    stateCode: '', // 目的国家代码
    state: '', // 州
    city: '', // 城市
    zipCode: '', // 邮编
    length: '', // 体积长
    wide: '', // 体积宽
    high: '', // 体积高
    weight: '', // 重量
  });
  const rules = {
    promotingProductsCode: [{ required: true, message: '请选择产品编号', trigger: 'change' }],
    warehouseCode: [{ required: true, message: '请选择仓库', trigger: 'change' }],
    stateCode: [{ required: true, message: '请选择国家', trigger: 'change' }],
    zipCode: [{ required: true, validator: validateZipCode, trigger: 'blur' }],
    length: [{ required: true, validator: checkLength, trigger: 'blur' }],
    wide: [{ required: true, validator: checkWide, trigger: 'blur' }],
    high: [{ required: true, validator: checkHigh, trigger: 'blur' }],
    weight: [{ required: true, validator: checkWeight, trigger: 'blur' }],
  };

  const list = ref<TrialResultItem[]>([]);
  const trialFormRef = ref();
  const loading = ref(false);
  async function onSubmit() {
    await formValidate(trialFormRef);
    loading.value = true;
    try {
      const data = await saleTrial(form);
      list.value = data.map((e) => {
        e.detailList = e.costHandleDetailVoList;
        return e;
      });
    } catch (e) {
      console.error(e);
      list.value = [];
    } finally {
      loading.value = false;
    }
  }
  function onReset() {
    formResetFields(trialFormRef);
    list.value = [];
  }

  const saleProductList = ref<SaleProductItem[]>([]);
  const warehouseList = ref<WarehouseItem[]>([]);
  const countryList = ref<CountryItem[]>([]);
  onMounted(async () => {
    countryList.value = await useCountryList();
    warehouseList.value = await useWarehouseList();
    saleProductList.value = await useSaleProductList();
  });
</script>
