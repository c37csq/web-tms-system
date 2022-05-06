<template>
  <div class="incidentals-discount" v-loading="dataLoading">
    <el-form size="small" inline class="filter-form" :model="form" ref="filterFormRef">
      <el-form-item label="销售产品编号" prop="promotingProductsCode">
        <el-select placeholder="请选择销售产品编号" v-model="form.promotingProductsCode" clearable filterable>
          <el-option
            v-for="item in saleProductList"
            :key="item.productsId"
            :label="item.promotingProductsCode"
            :value="item.promotingProductsCode"
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
      <el-form-item labl="有效期" prop="dateRange">
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
      <add-button v-auth="['expenses:sale:discount:add']" @click="operate('add')" />
    </div>

    <el-table :data="list" size="small" border stripe>
      <el-table-column prop="promotingProductsCode" label="销售产品编号" />
      <el-table-column prop="priceGrade" label="杂费等级" />
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
      <el-table-column prop="operate" label="操作">
        <template #default="{ row }">
          <template v-if="row.status === '0'">
            <el-button type="text" size="small" @click="operate('edit', row)" v-auth="['expenses:sale:discount:edit']">
              编辑
            </el-button>
            <el-button type="text" size="small" @click="operate('pub', row)" v-auth="['expenses:sale:discount:pub']">
              发布
            </el-button>
          </template>
          <template v-else>
            <el-button type="text" size="small" @click="operate('look', row)">详情</el-button>
            <el-button
              type="text"
              size="small"
              @click="operate('saveAs', row)"
              v-auth="['expenses:sale:discount:saveAs']"
            >
              另存为
            </el-button>
          </template>
          <el-button
            v-if="row.status !== '2'"
            type="text"
            size="small"
            @click="operate('del', row)"
            v-auth="['expenses:sale:discount:del']"
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

    <basic-dialog
      v-model="dialogVisible"
      width="800px"
      is-scroll
      :title="getTitle"
      @submit="onSubmit"
      @close="onClose"
      @opened="onOpened"
      :show-submit-btn="operateType !== 'isLook'"
    >
      <div v-loading="dialogFormLoading">
        <el-form
          size="small"
          inline
          label-width="180px"
          class="discount-dialog-form"
          :model="dialogFormData"
          :rules="dialogFormRules"
          :disabled="operateType === 'isLook'"
          ref="dialogFormRef"
        >
          <div class="*flex-center">
            <el-form-item label="销售产品编号" prop="promotingProductsCode">
              <el-select
                placeholder="请选择销售产品编号"
                v-model="dialogFormData.promotingProductsCode"
                filterable
                @change="onPromotingProductsCodeChange"
                :disabled="operateType === 'isEdit'"
                style="width: 180px"
              >
                <el-option
                  v-for="item in saleProductList"
                  :key="item.productsId"
                  :label="item.promotingProductsCode"
                  :value="item.promotingProductsCode"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="杂费等级" prop="priceGrade">
              <el-select
                placeholder="请选择杂费等级"
                v-model="dialogFormData.priceGrade"
                filterable
                style="width: 180px"
              >
                <el-option v-for="item in priceGradeList" :key="item.id" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </div>
          <div class="*flex-center">
            <el-form-item label="生效时间" prop="startTime">
              <el-date-picker
                :disabled-date="disabledStartDate"
                v-model="dialogFormData.startTime"
                type="date"
                placeholder="生效时间"
                style="width: 180px"
              />
            </el-form-item>
            <el-form-item label="失效时间" prop="endTime">
              <el-date-picker
                :disabled-date="disabledEndDate"
                v-model="dialogFormData.endTime"
                type="date"
                placeholder="失效时间"
                style="width: 180px"
              />
            </el-form-item>
          </div>
        </el-form>

        <div class="mb-20px">
          <add-button
            @click="onDialogOperate('add')"
            :disabled="operateType === 'isLook' || !dialogFormData.promotingProductsCode"
          />
          <danger-button
            @click="onDialogOperate('del')"
            :disabled="operateType === 'isLook' || !selectDialogOptionList.length"
          />
        </div>

        <el-table
          :data="dialogOptionList"
          size="small"
          border
          stripe
          class="custom-table"
          @selection-change="onDialogSelectTable"
        >
          <el-table-column type="selection" width="50" :selectable="() => operateType !== 'isLook'" />
          <el-table-column prop="costType" label="费用类型">
            <template #default="{ row }">
              <el-select size="small" v-model="row.costType" clearable filterable :disabled="operateType === 'isLook'">
                <el-option
                  v-for="item in feeTypeList"
                  :key="item.feeId"
                  :label="item.feeNameCn"
                  :value="item.feeNameCn"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="discountType" label="折扣类型">
            <template #default="{ row }">
              <el-select size="small" v-model="row.discountType" :disabled="operateType === 'isLook'">
                <el-option label="加" value="+" />
                <el-option label="减" value="-" />
                <el-option label="乘" value="*" />
                <el-option label="除" value="/" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="zoningCodeList" label="分区">
            <template #default="{ row }">
              <el-select
                v-model="row.zoningCodeList"
                size="small"
                multiple
                @change="(val) => onZoningCodeChange(val, row)"
                :disabled="operateType === 'isLook'"
              >
                <el-option
                  v-for="item in partitionList"
                  :key="item.teamId"
                  :label="item.zoningCode"
                  :value="item.zoningCode"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="discountValue" label="折扣值">
            <template #default="{ row }">
              <el-input
                size="small"
                :disabled="operateType === 'isLook'"
                v-model="row.discountValue"
                placeholder="请输入折扣值"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { PubDialog } from '@/components/Dialog';

  export default defineComponent({
    name: 'SaleIncidentalsDiscount',
    components: { PubDialog },
  });
</script>

<script lang="ts" setup>
  import { ref, onMounted, reactive, unref, computed } from 'vue';
  import type { Ref } from 'vue';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { formResetFields, formValidate, getArrayDifference } from '@/utils/tools';
  import { getPickerDate, fillDateTime } from '@/utils/dateUtil';
  import {
    SaleIncidentalsDiscountDetailItem,
    SaleIncidentalsDiscountItem,
    SaleIncidentalsDiscountParams,
    SaleIncidentalsDiscountSearchParams,
    SaleIncidentalsDiscountStatusParams,
    addSaleIncidentalsDiscount,
    changeSaleIncidentalsDiscountStatus,
    getSaleIncidentalsDiscountDetail,
    getSaleIncidentalsDiscountListByPage,
    updateSaleIncidentalsDiscount,
  } from '@/api/expense';

  import { useDictData, useFeeTypeList, usePartitionList, useSaleProductList } from '@/hooks/select/useSelect';
  import { DictOptionItem, FeeTypeItem, PartitionItem, SaleProductItem } from '@/api/sys';
  import { useMessage } from '@/hooks/web/useMessage';
  import { PubDialogState } from '@/components/Dialog';
  import { upperFirst } from 'lodash-es';

  const { createConfirm, createBriefSuccessMsg, createMessage } = useMessage();

  const form = reactive({
    promotingProductsCode: '',
    status: '',
    effectiveState: '',
    startTime: '',
    endTime: '',
    dateRange: [],
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

  const list = ref<SaleIncidentalsDiscountItem[]>([]);
  const dataLoading = ref(false);
  async function loadList() {
    dataLoading.value = true;
    try {
      const { startTime, endTime } = getPickerDate(form.dateRange);
      form.startTime = startTime;
      form.endTime = endTime;

      const params: SaleIncidentalsDiscountSearchParams = {
        pageSize: pageParams.pageSize,
        pageNum: pageParams.pageNum,
      };
      form.promotingProductsCode && (params.promotingProductsCode = form.promotingProductsCode);
      form.effectiveState && (params.effectiveState = form.effectiveState);
      form.status && (params.status = form.status);
      form.startTime && (params.startTime = form.startTime);
      form.endTime && (params.endTime = form.endTime);
      const { list: lists, total, pageNum } = await getSaleIncidentalsDiscountListByPage(params);
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

  const priceGradeList = ref<DictOptionItem[]>([]);
  const saleProductList = ref<SaleProductItem[]>([]);
  const feeTypeList = ref<FeeTypeItem[]>([]);
  async function initial() {
    await loadList();
    saleProductList.value = await useSaleProductList();
    priceGradeList.value = await useDictData('priceGrade');
    feeTypeList.value = await useFeeTypeList();
  }

  onMounted(() => {
    initial();
  });

  const pubState = reactive<PubDialogState>({
    visible: false,
    canClick: true,
    data: [],
  });
  const pubParams = ref({}) as Ref<SaleIncidentalsDiscountStatusParams>;
  async function onPubSubmit({ closeLoading, closeDialog }) {
    pubParams.value.verify = 1;
    try {
      await changeSaleIncidentalsDiscountStatus(unref(pubParams));
      await loadList();
      createBriefSuccessMsg('发布成功');
      closeDialog();
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading();
    }
  }

  const dialogVisible = ref(false);
  const operateType = ref('isAdd');
  const operateTitleMap = {
    isAdd: '新增',
    isEdit: '编辑',
    isSaveAs: '另存为',
    isLook: '查看',
  };
  const getTitle = computed(() => operateTitleMap[unref(operateType)]);
  const curData = ref({}) as Ref<SaleIncidentalsDiscountItem>;
  const dialogFormData = reactive({
    promotingProductsCode: '', // 销售产品代码
    priceGrade: '公报价', // 销售杂费价格等级
    startTime: '', // 生效时间
    endTime: '', // 结束时间
  });

  const partitionList = ref<PartitionItem[]>([{ zoningId: 0, zoningCode: '全部' }]);
  /**
   * 切换销售产品
   * @param code
   */
  async function onPromotingProductsCodeChange(code) {
    try {
      partitionList.value = []; // 重置分区
      if (unref(dialogOptionList)) {
        dialogOptionList.value = unref(dialogOptionList).map((e) => {
          e.zoningCodeList = ['全部'];
          return e;
        });
      }
      const curSaleProduct = unref(saleProductList).find((e) => e.promotingProductsCode === code);
      if (curSaleProduct) {
        const { promotingProductsCode, teamCode } = curSaleProduct;
        partitionList.value = await usePartitionList(teamCode);
        partitionList.value.unshift({
          zoningId: -1,
          zoningCode: '全部',
        });
        dialogFormData.promotingProductsCode = promotingProductsCode;
      } else {
        dialogFormData.promotingProductsCode = '';
      }
    } catch (e) {
      console.error(e);
    }
  }
  /**
   * 切换分区
   * @param zoningCodeList
   * @param item
   */
  async function onZoningCodeChange(zoningCodeList: string[], item: SaleIncidentalsDiscountDetailItem) {
    const zoningCodeListLen = zoningCodeList.length;
    item.zoningCodeList = zoningCodeList;

    if (!+zoningCodeListLen) {
      item.zoningCodeList = ['全部'];
      return;
    }
    item.zoningCodeList = zoningCodeList;
    if (zoningCodeList[zoningCodeListLen - 1] === '全部') {
      zoningCodeList.splice(0, zoningCodeListLen - 1);
    } else if (zoningCodeList.includes('全部')) {
      zoningCodeList.splice(
        zoningCodeList.findIndex((item) => item === '全部'),
        1,
      );
    }
  }

  function disabledStartDate(time) {
    if (dialogFormData.endTime) {
      return time.getTime() > new Date(dialogFormData.endTime).getTime();
    }
    return false;
  }
  function disabledEndDate(time) {
    if (dialogFormData.startTime) {
      return time.getTime() < new Date(dialogFormData.startTime).getTime();
    }
    return false;
  }
  const dialogFormRules = {
    promotingProductsCode: [{ required: true, message: '销售产品编号不能为空', trigger: 'change' }],
    priceGrade: [{ required: true, message: '杂费等级不能为空', trigger: 'change' }],
    // TODO 生效时间应小于失效时间 后续添加check
    startTime: [{ required: true, message: '生效时间不能为空', trigger: 'change' }],
    endTime: [{ required: true, message: '失效时间不能为空', trigger: 'change' }],
  };
  const dialogFormRef = ref();
  const dialogFormLoading = ref(false);
  async function onSubmit({ showLoading, closeLoading, closeDialog }) {
    await formValidate(dialogFormRef);

    if (!unref(dialogOptionList).length) {
      return createMessage.info('至少需要一条记录');
    }

    const costTypeIsEmpty = !unref(dialogOptionList).every((e) => !!e.costType);
    const discountTypeIsEmpty = !unref(dialogOptionList).every((e) => !!e.discountType);
    const discountValueIsEmpty = !unref(dialogOptionList).every((e) => !!e.discountValue);
    if (unref(dialogOptionList).length && (costTypeIsEmpty || discountTypeIsEmpty || discountValueIsEmpty)) {
      return createMessage.info('请确保费用类型、折扣类型、折扣值都填写完毕');
    }

    showLoading && showLoading();
    try {
      const params: SaleIncidentalsDiscountParams = {
        ...unref(dialogFormData),
        salePriceDiscountDetailsList: unref(dialogOptionList).map((e) => {
          if (e.zoningCodeList) {
            e.zoningCode = e.zoningCodeList.join(',');
          }
          return e;
        }),
      };
      const { startTime, endTime } = fillDateTime(params.startTime, params.endTime);
      params.startTime = startTime;
      params.endTime = endTime;

      if (unref(operateType) === 'isEdit') {
        await updateSaleIncidentalsDiscount({
          ...params,
          salePriceDiscountId: unref(curData).salePriceDiscountId,
        });
        createBriefSuccessMsg('编辑成功');
      } else {
        await addSaleIncidentalsDiscount(params);
        createBriefSuccessMsg(unref(operateType) === 'isAdd' ? '新建成功' : '另存为成功');
      }
      await loadList();
      closeDialog && closeDialog();
    } catch (e) {
      console.error(e);
    } finally {
      closeLoading();
    }
  }
  function onClose() {
    dialogOptionList.value = [];
    formResetFields(dialogFormRef);
  }
  function onOpened() {
    if (unref(operateType) !== 'isAdd') {
      const { startTime, endTime, promotingProductsCode, priceGrade, salePriceDiscountDetailsList } = unref(curData);
      dialogFormData.promotingProductsCode = promotingProductsCode;
      dialogFormData.priceGrade = priceGrade;
      dialogFormData.startTime = startTime;
      dialogFormData.endTime = endTime;
      dialogOptionList.value = salePriceDiscountDetailsList.map((e, idx) => {
        e.id = idx + 1;
        e.zoningCode && (e.zoningCodeList = e.zoningCode.split(','));
        return e;
      });
      dialogOptionIdVal.value = salePriceDiscountDetailsList.length + 1;
    }
    dialogFormLoading.value = false;
  }

  const dialogOptionList = ref<SaleIncidentalsDiscountDetailItem[]>([]);
  const dialogOptionIdVal = ref(1);
  const selectDialogOptionList = ref<SaleIncidentalsDiscountDetailItem[]>([]);
  function onDialogSelectTable(val: SaleIncidentalsDiscountDetailItem[]) {
    selectDialogOptionList.value = val;
  }
  function onDialogOperate(type: 'add' | 'del') {
    if (type === 'add') {
      if (unref(dialogOptionList).length && !unref(dialogOptionList).every((e) => !!e.costType)) {
        return;
      }
      dialogOptionList.value.push({
        id: dialogOptionIdVal.value++,
        costType: '',
        zoningCodeList: ['全部'],
        zoningCode: '全部',
        discountType: '', // 折扣类型
        discountValue: '', // 折扣值
      });
    } else {
      createConfirm({
        title: '提示',
        message: '请确认是否删除选中的数据',
      })
        .then(() => {
          if (dialogOptionList.value.length === selectDialogOptionList.value.length) {
            dialogOptionList.value = [];
          } else {
            dialogOptionList.value = getArrayDifference(unref(dialogOptionList), unref(selectDialogOptionList));
          }
        })
        .catch(() => {});
    }
  }

  type OperateType = 'add' | 'edit' | 'del' | 'pub' | 'saveAs' | 'look';
  async function operate(type: OperateType, item?: SaleIncidentalsDiscountItem) {
    if (type === 'del') {
      createConfirm({
        title: '作废',
        message: `请确认是否作废《${item?.promotingProductsCode}》`,
        type: 'info',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            try {
              await changeSaleIncidentalsDiscountStatus({
                salePriceDiscountIds: [item!.salePriceDiscountId],
                status: 2,
              });
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
        .then(() => {
          loadList();
        })
        .catch(() => {});
    } else if (type === 'pub') {
      if (!pubState.canClick) return;
      pubState.canClick = false;
      try {
        pubParams.value = {
          salePriceDiscountIds: [item!.salePriceDiscountId],
          status: 1,
          verify: 0,
        };
        pubState.data = await changeSaleIncidentalsDiscountStatus(unref(pubParams));
        pubState.visible = true;
      } catch (e) {
        console.error(e);
      } finally {
        pubState.canClick = true;
      }
    } else {
      operateType.value = `is${upperFirst(type)}`;

      if (unref(operateType) !== 'isAdd') {
        const { salePriceDiscountId, promotingProductsCode } = item!;
        curData.value = await getSaleIncidentalsDiscountDetail(salePriceDiscountId);

        const curSaleProduct = unref(saleProductList).find((e) => e.promotingProductsCode === promotingProductsCode);
        if (curSaleProduct) {
          const { teamCode } = curSaleProduct;
          partitionList.value = await usePartitionList(teamCode);
          partitionList.value.unshift({
            zoningId: -1,
            zoningCode: '全部',
          });
        }
      }

      dialogFormLoading.value = true;
      dialogVisible.value = true;
    }
  }
</script>
