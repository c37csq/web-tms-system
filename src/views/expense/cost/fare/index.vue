<template>
  <div class="cost-fare" v-loading="dataLoading">
    <el-form size="small" inline class="filter-form" :model="form" ref="filterFormRef">
      <el-form-item label="服务商渠道编号" prop="serviceChannelCode">
        <el-select placeholder="请选择服务商渠道编号" v-model="form.serviceChannelCode" clearable filterable>
          <el-option
            v-for="item in serviceChannelList"
            :key="item.serviceChannelId"
            :label="item.serviceChannelCode"
            :value="item.serviceChannelCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收费币种" prop="currency">
        <el-select placeholder="请选择收费币种" v-model="form.currency" clearable>
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
      <add-button @click="operate('add')" v-auth="['expenses:cost:fare:operate']" />
    </div>

    <el-table :data="list" size="small" border stripe>
      <el-table-column prop="costPriceName" label="名称" />
      <el-table-column prop="serviceChannelCode" label="服务商渠道代码" />
      <el-table-column prop="currency" label="币种" />
      <el-table-column prop="startTime" label="生效时间" />
      <el-table-column prop="endTime" label="失效时间" />
      <el-table-column prop="effectiveState" label="生效状态" width="120">
        <template #default="{ row }">
          <effective-status-text :effectiveState="row.effectiveState" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <status-text :status="row.status" />
        </template>
      </el-table-column>
      <el-table-column
        prop="operate"
        label="操作"
        v-auth="['expenses:cost:fare:operate', 'expenses:cost:fare:review', 'expense:cost:fare:detail:view']"
      >
        <template #default="{ row }">
          <template v-if="row.status === '0'">
            <el-button type="text" size="small" @click="operate('edit', row)" v-auth="['expenses:cost:fare:operate']">
              编辑
            </el-button>
            <el-button type="text" size="small" @click="operate('pub', row)" v-auth="['expenses:cost:fare:review']">
              发布
            </el-button>
          </template>
          <template v-else>
            <el-button
              type="text"
              size="small"
              @click="operate('look', row)"
              v-auth="['expense:cost:fare:detail:view']"
            >
              详情
            </el-button>
            <el-button type="text" size="small" @click="operate('saveAs', row)" v-auth="['expenses:cost:fare:operate']">
              另存为
            </el-button>
          </template>
          <el-button
            v-if="row.status !== '2'"
            type="text"
            size="small"
            @click="operate('del', row)"
            v-auth="['expenses:cost:fare:review']"
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
    name: 'CostFare',
    components: { PubDialog },
  });
</script>

<script lang="ts" setup>
  import { useMessage } from '@/hooks/web/useMessage';
  import { useRouter } from 'vue-router';
  import { onMounted, reactive, Ref, ref, unref } from 'vue';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { formResetFields } from '@/utils/tools';
  import { getPickerDate } from '@/utils/dateUtil';
  import { PubDialogState } from '@/components/Dialog';
  import {
    changeCostFareStatus,
    getCostFareListByPage,
    CostFareItem,
    CostFareSearchParams,
    CostFareStatusParams,
  } from '@/api/expense';
  import { CurrencyItem, ServiceChannelItem } from '@/api/sys';
  import { useCurrencyList, useServiceChannelList } from '@/hooks/select/useSelect';
  import { upperFirst } from 'lodash-es';
  import { listPageListener } from '@/logics/mitt/updateRoute';

  const { createConfirm, createBriefSuccessMsg } = useMessage();

  const router = useRouter();

  const form = reactive({
    serviceChannelCode: '',
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
  const pubParams = ref({}) as Ref<CostFareStatusParams>;
  async function onPubSubmit({ closeLoading, closeDialog }) {
    pubParams.value.verify = 1;
    try {
      await changeCostFareStatus(unref(pubParams));
      await loadList();
      createBriefSuccessMsg('发布成功');
      closeDialog();
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading();
    }
  }

  const list = ref<CostFareItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    dataLoading.value = true;
    try {
      const { startTime, endTime } = getPickerDate(form.dateRange);
      form.startTime = startTime;
      form.endTime = endTime;
      const params: CostFareSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
      };
      form.status && (params.status = form.status);
      form.effectiveState && (params.effectiveState = form.effectiveState);
      form.currency && (params.currency = form.currency);
      form.serviceChannelCode && (params.serviceChannelCode = form.serviceChannelCode);
      form.startTime && (params.startTime = form.startTime);
      form.endTime && (params.endTime = form.endTime);
      const { list: lists, total, pageNum } = await getCostFareListByPage(params);
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

  const serviceChannelList = ref<ServiceChannelItem[]>([]);
  const currencyList = ref<CurrencyItem[]>([]);

  onMounted(async () => {
    await loadList();
    currencyList.value = await useCurrencyList();
    serviceChannelList.value = await useServiceChannelList();
  });

  type OperateType = 'add' | 'edit' | 'del' | 'pub' | 'saveAs' | 'look';
  async function operate(type: OperateType, item?: CostFareItem) {
    if (type === 'del') {
      createConfirm({
        title: '作废成本运费',
        message: `请确认是否作废成本运费`,
        type: 'info',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            try {
              await changeCostFareStatus({
                costPriceIds: [item!.costPriceId],
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
          costPriceIds: [item!.costPriceId],
          status: 1,
          verify: 0,
        };
        pubState.data = await changeCostFareStatus(unref(pubParams));
        pubState.visible = true;
      } catch (e) {
        console.error(e);
      } finally {
        pubState.canClick = true;
      }
    } else {
      await router.push({
        name: 'CostFareDetail',
        params: {
          id: item ? item.costPriceId : 0,
          type: `is${upperFirst(type)}`,
        },
      });
    }
  }

  listPageListener(async () => {
    await loadList();
  });
</script>
