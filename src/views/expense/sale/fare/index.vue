<template>
  <div class="sale-fare">
    <el-form size="small" inline class="filter-form" :model="form" ref="filterFormRef">
      <el-form-item label="销售产品" prop="promotingProductsCode">
        <el-select placeholder="请选择销售产品" v-model="form.promotingProductsCode" clearable>
          <el-option
            v-for="item in saleProductList"
            :key="item.productsId"
            :label="item.promotingProductsCode"
            :value="item.promotingProductsCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="价格等级" prop="priceGrade">
        <el-select placeholder="请选择价格等级" v-model="form.priceGrade" filterable clearable>
          <el-option v-for="item in priceGradeList" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="收费币种" prop="currency">
        <el-select placeholder="请选择收费币种" v-model="form.currency" clearable filterable>
          <el-option
            v-for="item in currencyList"
            :key="item.currencyId"
            :label="item.currencyName"
            :value="item.currencySymbol"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select placeholder="请选择状态" v-model="form.status" clearable>
          <el-option label="草稿" value="0" />
          <el-option label="发布" value="1" />
          <el-option label="作废" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="生效状态" prop="effectiveState">
        <el-select placeholder="请选择生效状态" v-model="form.effectiveState" clearable>
          <el-option label="未生效" value="0" />
          <el-option label="生效" value="1" />
          <el-option label="过期" value="2" />
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
      <el-form-item>
        <basic-filter-search @search="onSearch" @reset="onReset" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <add-button @click="operate('add')" v-auth="['expenses:sale:fare:add']" />
    </div>

    <el-table :data="list" size="small" border stripe>
      <el-table-column prop="salesPriceName" label="名称" />
      <el-table-column prop="promotingProductsCode" label="销售产品编号" />
      <el-table-column prop="priceGrade" label="等级" />
      <el-table-column prop="startTime" label="生效时间" />
      <el-table-column prop="endTime" label="失效时间" />
      <el-table-column prop="currency" label="收费币种" />
      <el-table-column prop="effectiveState" label="生效状态" width="120">
        <template #default="{ row }">
          <effective-status-text :effective-state="row.effectiveState" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="90">
        <template #default="{ row }">
          <status-text :status="row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建者" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column
        prop="operate"
        label="操作"
        v-auth="['expense:sale:fare:detail:view', 'expenses:sale:fare:edit', 'expenses:sale:fare:pub']"
      >
        <template #default="{ row }">
          <template v-if="~~row.status === 0">
            <el-button type="text" size="small" @click="operate('edit', row)" v-auth="['expenses:sale:fare:edit']">
              编辑
            </el-button>
            <el-button type="text" size="small" @click="operate('pub', row)" v-auth="['expenses:sale:fare:pub']">
              发布
            </el-button>
          </template>
          <template v-else>
            <el-button
              type="text"
              size="small"
              @click="operate('look', row)"
              v-auth="['expense:sale:fare:detail:view']"
            >
              详情
            </el-button>
            <el-button type="text" size="small" @click="operate('saveAs', row)" v-auth="['expenses:sale:fare:saveAs']">
              另存为
            </el-button>
          </template>
          <el-button
            v-if="~~row.status !== 2"
            type="text"
            size="small"
            @click="operate('del', row)"
            v-auth="['expenses:sale:fare:del']"
          >
            作废
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <basic-pagination
      :current="pageParams.pageNum"
      :size="pageParams.pageSize"
      :total="pageParams.total"
      @page-change="onPageChange"
    />

    <pub-dialog v-model="pubState.visible" :data="pubState.data" @pub="onPubSubmit" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { PubDialog } from '@/components/Dialog';

  export default defineComponent({
    name: 'SaleFare',
    components: { PubDialog },
  });
</script>

<script lang="ts" setup>
  import { reactive, ref, onMounted, Ref, unref } from 'vue';
  import { CurrencyItem, DictOptionItem, SaleProductItem } from '@/api/sys';
  import { useCurrencyList, useDictData, useSaleProductList } from '@/hooks/select/useSelect';
  import { formResetFields } from '@/utils/tools';
  import { getPickerDate } from '@/utils/dateUtil';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { PubDialogState } from '@/components/Dialog';
  import {
    SaleFareStatusParams,
    changeSaleFareStatus,
    SaleFareItem,
    getSaleFareListByPage,
    SaleFareSearchParams,
  } from '@/api/expense';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useRouter } from 'vue-router';
  import { upperFirst } from 'lodash-es';
  import { listPageListener } from '@/logics/mitt/updateRoute';

  const { createConfirm, createBriefSuccessMsg } = useMessage();

  const router = useRouter();

  const form = reactive({
    promotingProductsCode: '',
    priceGrade: '', // 运费等级
    currency: '',
    status: '',
    effectiveState: '',
    dateRange: [],
    startTime: '',
    endTime: '',
  });
  const filterFormRef = ref();

  const pageParams = pageData();
  const onPageChange = (params: PageChangeParams) => {
    params.pageSize && (pageParams.pageSize = params.pageSize);
    params.pageNum && (pageParams.pageNum = params.pageNum);
    loadList();
  };

  async function onSearch() {
    pageParams.pageNum = 1;
    await loadList();
  }
  async function onReset() {
    formResetFields(filterFormRef);
    await loadList();
  }

  const pubState = reactive<PubDialogState>({
    visible: false,
    canClick: true,
    data: [],
  });
  const pubParams = ref({}) as Ref<SaleFareStatusParams>;
  async function onPubSubmit({ closeLoading, closeDialog }) {
    pubParams.value.verify = 1;
    try {
      await changeSaleFareStatus(unref(pubParams));
      await loadList();
      createBriefSuccessMsg('发布成功');
      closeDialog();
    } finally {
      closeLoading();
    }
  }

  const list = ref<SaleFareItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    try {
      dataLoading.value = true;

      const { startTime, endTime } = getPickerDate(form.dateRange);
      form.startTime = startTime;
      form.endTime = endTime;

      const params: SaleFareSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
      };
      form.status && (params.status = form.status);
      form.effectiveState && (params.effectiveState = form.effectiveState);
      form.currency && (params.currency = form.currency);
      form.promotingProductsCode && (params.promotingProductsCode = form.promotingProductsCode);
      form.startTime && (params.startTime = form.startTime);
      form.endTime && (params.endTime = form.endTime);
      form.priceGrade && (params.priceGrade = form.priceGrade);
      const { list: lists, total, pageNum } = await getSaleFareListByPage(params);
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

  const saleProductList = ref<SaleProductItem[]>([]);
  const currencyList = ref<CurrencyItem[]>([]);
  const priceGradeList = ref<DictOptionItem[]>([]);

  onMounted(async () => {
    await loadList();
    currencyList.value = await useCurrencyList();
    saleProductList.value = await useSaleProductList();
    priceGradeList.value = await useDictData('priceGrade');
  });

  type OperateType = 'add' | 'edit' | 'del' | 'pub' | 'saveAs' | 'look';
  async function operate(type: OperateType, item?: SaleFareItem) {
    if (type === 'del') {
      createConfirm({
        title: '作废销售运费',
        message: `请确认是否作废销售运费`,
        type: 'info',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            try {
              await changeSaleFareStatus({
                sellSalesPriceIds: [item!.salesPriceId],
                status: 2,
              });
              await loadList();
              createBriefSuccessMsg('作废成功');
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
    } else if (type === 'pub') {
      if (!pubState.canClick) return;
      pubState.canClick = false;
      try {
        pubParams.value = {
          sellSalesPriceIds: [item!.salesPriceId],
          status: 1,
          verify: 0,
        };
        pubState.data = await changeSaleFareStatus(unref(pubParams));
        pubState.visible = true;
      } catch (e) {
        console.error(e);
      } finally {
        pubState.canClick = true;
      }
    } else {
      await router.push({
        name: 'SaleFareDetail',
        params: {
          id: item ? item.salesPriceId : 0,
          type: `is${upperFirst(type)}`,
        },
      });
    }
  }

  listPageListener(async () => {
    await loadList();
  });
</script>
