<template>
  <div class="error-list">
    <el-form :model="form" ref="searchFormRef" size="small" inline class="filter-form">
      <el-form-item label="订单号" prop="externalno">
        <el-input v-model="form.externalno" placeholder="请输入订单号" />
      </el-form-item>
      <el-form-item label="快递单号" prop="trackingNo">
        <el-input v-model="form.trackingNo" placeholder="请输入快递单号" />
      </el-form-item>
      <el-form-item label="参考号" prop="externalno2">
        <el-input v-model="form.externalno2" placeholder="请输入参考号" />
      </el-form-item>
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
      <el-form-item label="下单时间" prop="orderDateRange">
        <el-date-picker
          v-model="form.orderDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item label="发货时间" prop="deliveryDateRange">
        <el-date-picker
          v-model="form.deliveryDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item>
        <basic-filter-search @reset="onReset" @search="onSearch" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <el-button size="small" round type="primary" @click="onSync">再次同步订单</el-button>
      <danger-button @click="backOrder({ id: undefined })" :disabled="!selectList.length">批量回退订单</danger-button>
    </div>

    <el-table :data="list" size="small" border stripe v-loading="loading" @selection-change="orderSelectChange">
      <el-table-column type="selection" :selectable="errorOrderCheck" width="50" />
      <el-table-column
        v-for="(item, idx) in columns"
        :key="idx"
        :prop="item.prop"
        :label="item.label"
        :width="item?.width"
        :formatter="item.formatter"
      />
      <el-table-column prop="operate" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="operate('look', scope.row)">查看</el-button>
          <el-button v-if="!scope.row.backOff" type="text" size="small" @click="operate('back', scope.row)"
            >回退订单</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <basic-pagination
      :current="pageParams.pageNum"
      :size="pageParams.pageSize"
      :total="pageParams.total"
      @page-change="onPageChange"
    />

    <basic-dialog width="380px" @submit="onSubmit" v-model="backDialogVisible" :title="backDialogTitle">
      <el-form size="small" label-width="100px" id="backOrderDialog" :model="backForm" :rules="rules" ref="backRef">
        <el-form-item label="异常类型" prop="exceptionType">
          <el-select size="small" placeholder="请选择异常类型" v-model="backForm.exceptionType" filterable>
            <el-option v-for="item in exceptionTypeList" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="backForm.remark"
            placeholder="请输入不通过理由"
          />
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import { errorOrderSync, getErrorList } from '@/api/order/order-manage/errorList';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { getPickerDate } from '@/utils/dateUtil';
  import { useDictData, useSaleProductList, useWarehouseList } from '@/hooks/select/useSelect';
  import { DictOptionItem, SaleProductItem, WarehouseItem } from '@/api/sys';
  import { useMessage } from '@/hooks/web/useMessage';
  import { backErrorOrder } from '@/api/order/order-manage';
  import { OrderListItem } from '@/api/order/order-manage/model/OrderListModel';

  export default defineComponent({
    name: 'ErrorList',
    setup() {
      const router = useRouter();

      const columns = [
        {
          prop: 'externalno',
          label: '订单号',
          formatter: (row) => {
            return row.externalno || '/';
          },
        },
        {
          prop: 'externalno2',
          label: '参考号',
          formatter: (row) => {
            return row.externalno2 || '/';
          },
        },
        {
          prop: 'warehouseCode',
          label: '仓库编号',
          formatter: (row) => {
            return row.warehouseCode || '/';
          },
          width: 90,
        },
        {
          prop: 'promotingProductsCode',
          label: '销售产品编号',
          formatter: (row) => {
            return row.promotingProductsCode || '/';
          },
        },
        {
          prop: 'senderCountry',
          label: '国家',
          formatter: (row) => {
            return row.senderCountry || '/';
          },
          width: 60,
        },
        {
          prop: 'receiverFirstname',
          label: '收件人',
          formatter: (row) => {
            return row.receiverFirstname || '/';
          },
        },
        {
          prop: 'createDate',
          label: '下单时间',
          formatter: (row) => {
            return row.createDate || '/';
          },
        },
        {
          prop: 'orderStatusRemark',
          label: '异常原因',
          formatter: (row) => {
            return row.orderStatusRemark || '/';
          },
        },
        {
          prop: 'remark',
          label: '回退备注',
          formatter: (row) => {
            return row.remark || '/';
          },
        },
      ];

      const rules = {
        exceptionType: [{ required: true, message: '请选择异常类型', trigger: 'change' }],
        remark: [],
      };

      const backRef = ref();

      const form = reactive({
        externalno: '',
        externalno2: '',
        trackingNo: '',
        referenceNo: '',
        promotingProductsCode: '',
        warehouseCode: '',
        orderDateRange: [],
        createStartTime: '',
        createEndTime: '',
        deliveryDateRange: [],
        deliveryStartTime: '',
        deliveryEndTime: '',
      });
      const list = ref<OrderListItem[]>([]);
      const pageParams = pageData();
      const loading = ref(false);
      const selectList = ref([]);
      const searchFormRef = ref();
      const backForm = reactive({
        exceptionType: '渠道不支持',
        remark: '',
      });

      const saleProductList = ref<SaleProductItem[]>([]);
      const warehouseList = ref<WarehouseItem[]>([]);

      const backDialogVisible = ref(false);
      const backDialogTitle = ref('批量回退订单');
      const backOrderId = ref('');
      const { createBriefSuccessMsg, createMessage } = useMessage();

      const loadList = async () => {
        loading.value = true;
        try {
          // 订单开始结束时间
          const { startTime: createStartTime, endTime: createEndTime } = getPickerDate(form.orderDateRange);
          form.createStartTime = createStartTime;
          form.createEndTime = createEndTime;
          // 发货开始和结束时间
          const { startTime: deliveryStartTime, endTime: deliveryEndTime } = getPickerDate(form.deliveryDateRange);
          form.deliveryStartTime = deliveryStartTime;
          form.deliveryEndTime = deliveryEndTime;
          const params = {
            pageNum: pageParams.pageNum,
            pageSize: pageParams.pageSize,
            externalno: form.externalno,
            externalno2: form.externalno2,
            trackingNo: form.trackingNo,
            referenceNo: form.referenceNo,
            promotingProductsCode: form.promotingProductsCode,
            warehouseCode: form.warehouseCode,
            createStartTime: form.createStartTime,
            createEndTime: form.createEndTime,
            deliveryStartTime: form.deliveryStartTime,
            deliveryEndTime: form.deliveryEndTime,
            orderStatus: 3,
          };
          const { list: _list, pageNum, pageSize, total } = await getErrorList(params);
          list.value = _list;
          pageParams.pageSize = pageSize;
          pageParams.pageNum = pageNum;
          pageParams.total = total;
        } catch (e) {
          console.error(e);
        } finally {
          loading.value = false;
        }
      };

      const errorOrderCheck = (row) => {
        return !row.backOff;
      };

      const onSync = async () => {
        if (!selectList.value.length) {
          createMessage.error('请选择问题件后再进行同步');
          return;
        }
        try {
          await errorOrderSync({ ids: selectList.value.map((e: any) => e.id) });
          await loadList();
          createBriefSuccessMsg('同步成功！');
        } catch (e) {
          console.error(e);
        }
      };

      const exceptionTypeList = ref<DictOptionItem[]>([]);

      const onReset = () => {
        formResetFields(searchFormRef);
        loadList();
      };

      const onSearch = () => {
        pageParams.pageNum = 1;
        loadList();
      };

      const orderSelectChange = (val) => {
        selectList.value = val;
      };

      const onPageChange = (params: PageChangeParams) => {
        params.pageSize && (pageParams.pageSize = params.pageSize);
        params.pageNum && (pageParams.pageNum = params.pageNum);
        loadList();
      };

      const backOrder = ({ id }) => {
        if (id) {
          backOrderId.value = id;
          backDialogTitle.value = '回退订单';
        } else {
          backOrderId.value = '';
          backDialogTitle.value = '批量回退订单';
        }
        formResetFields(backRef);
        backDialogVisible.value = true;
      };

      const operate = (type, item) => {
        if (type === 'look') {
          router.push({ name: 'OrderDetail', params: { id: item.id } });
        } else {
          backOrder(item);
        }
      };

      const onSubmit = async () => {
        await formValidate(backRef);

        try {
          let externalOrderIds;
          if (backOrderId.value) {
            externalOrderIds = [backOrderId.value];
          } else {
            externalOrderIds = selectList.value.map((e: any) => e.id);
          }
          await backErrorOrder({
            externalOrderIds,
            exceptionType: backForm.exceptionType,
            remark: backForm.remark,
          });
          createBriefSuccessMsg('回退成功！');
          await loadList();
          backDialogVisible.value = false;
        } catch (e) {
          console.error(e);
        }
      };

      onMounted(async () => {
        await loadList();
        saleProductList.value = await useSaleProductList();
        warehouseList.value = await useWarehouseList();
        try {
          exceptionTypeList.value = await useDictData('exceptionType');
        } catch (e) {
          (exceptionTypeList.value as any) = [
            { id: 1, label: '渠道不支持', value: '渠道不支持' },
            { id: 2, label: '地址没有街道号码', value: '地址没有街道号码' },
            { id: 3, label: '地址没有门牌号', value: '地址没有门牌号' },
            { id: 4, label: '地址和邮编对不上', value: '地址和邮编对不上' },
          ];
        }
      });

      return {
        form,
        columns,
        list,
        selectList,
        pageParams,
        loading,
        saleProductList,
        warehouseList,
        exceptionTypeList,
        backDialogVisible,
        backDialogTitle,
        searchFormRef,
        backForm,
        rules,
        backRef,

        orderSelectChange,
        onPageChange,
        onReset,
        onSearch,
        errorOrderCheck,
        backOrder,
        onSync,
        operate,
        onSubmit,
      };
    },
  });
</script>
