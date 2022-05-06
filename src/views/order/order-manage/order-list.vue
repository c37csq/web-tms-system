<template>
  <div class="order-list">
    <el-form :model="form" ref="searchFormRef" size="small" inline class="filter-form">
      <el-form-item label="订单号" prop="externalno">
        <el-input
          style="width: 280px"
          v-model="form.externalno"
          placeholder="支持模糊查询、批量查询（用逗号/空格隔开）"
          clearable
        />
      </el-form-item>
      <el-form-item label="参考号" prop="externalno2">
        <el-input
          style="width: 280px"
          v-model="form.externalno2"
          placeholder="支持模糊查询、批量查询（用逗号/空格隔开）"
          clearable
        />
      </el-form-item>
      <el-form-item label="快递单号" prop="trackingNo">
        <el-input
          style="width: 280px"
          v-model="form.trackingNo"
          placeholder="支持模糊查询、批量查询（用逗号/空格隔开）"
          clearable
        />
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
      <template v-if="isTop">
        <el-form-item label="仓库类型" prop="warehouseType">
          <el-select placeholder="请选择仓库类型" v-model="form.warehouseType" clearable filterable>
            <el-option v-for="item in warehouseTypeList" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户代码" prop="enterpriseRecordId">
          <el-select placeholder="请选择客户代码" v-model="form.enterpriseRecordId" filterable clearable>
            <el-option
              v-for="item in clientCodeList"
              :key="item.id"
              :label="`${item.clientCode}[${item.companyName}]`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="服务商及渠道" v-auth="['order:channel:service']" prop="serviceProviderCode">
          <el-select
            placeholder="请选择服务商"
            :model-value="form.serviceProviderCode"
            @change="onChangeService"
            clearable
            filterable
          >
            <el-option
              v-for="item in serviceProviderCodeList"
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
      </template>
      <el-form-item label="下单时间" prop="orderDateRange">
        <el-date-picker
          v-model="form.orderDateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="defaultTime"
        />
      </el-form-item>
      <el-form-item label="发货时间" prop="deliveryDateRange">
        <el-date-picker
          v-model="form.deliveryDateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="defaultTime"
        />
      </el-form-item>
      <el-form-item label="面单时间" v-auth="['order:list:show']" prop="expressDateRange">
        <el-date-picker
          v-model="form.expressDateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="defaultTime"
        />
      </el-form-item>
      <el-form-item label="投保状态" prop="insuranceSuccess">
        <el-select placeholder="请选择投保状态" v-model="form.insuranceSuccess" clearable>
          <el-option label="成功" value="1" />
          <el-option label="失败" value="0" />
          <el-option label="投保中" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <basic-filter-search @search="onSearch" @reset="onReset" />
      </el-form-item>
    </el-form>

    <div class="mb-20px">
      <export-button :api="exportOrder" :params="getRequestParams()" :filename="`订单列表`" />

      <export-button
        :api="exportOrderDetail"
        :params="getRequestParams()"
        :filename="`订单明细`"
        v-auth="['order:list:exportDetail']"
      >
        导出订单明细
      </export-button>
    </div>

    <div class="*flex-btc-ac">
      <el-tabs v-model="orderStatusActive" type="card" @tab-click="handleTabClick">
        <el-tab-pane v-for="item in orderStatusList" :key="item.id" :label="item.label" :name="item.name" />
      </el-tabs>

      <span v-if="pageParams.total">
        共
        <span class="text-active">{{ pageParams.total }}</span>
        条记录
      </span>
    </div>

    <el-table :data="list" size="small" border stripe v-loading="tabLoading">
      <template v-for="item in columns" :key="item.prop">
        <el-table-column
          v-if="item.isShow"
          :prop="item.prop"
          :label="item.label"
          :width="item?.width"
          :formatter="item.formatter"
        />
      </template>
      <el-table-column label="操作" prop="operate">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="operate('look', row)"> 查看 </el-button>
          <template v-if="!['4', '5', '8'].includes(row.orderStatus) && orderStatusActive !== 'forecast'">
            <el-button type="text" size="small" @click="operate('del', row)"> 取消 </el-button>
          </template>
          <template v-else-if="row.orderStatus !== '4' && orderStatusActive !== 'forecast'">
            <el-button v-auth="['order:review']" type="text" size="small" @click="operate('review', row)">
              审核
            </el-button>
          </template>
          <el-button type="text" size="small" @click="operate('log', row)"> 日志 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <basic-pagination
      :current="pageParams.pageNum"
      :size="pageParams.pageSize"
      :total="pageParams.total"
      @page-change="onPageChange"
    />

    <basic-dialog
      width="320px"
      title="审核"
      v-model="reviewDialog.visible"
      @submit="onReviewSubmit"
      @close="onReviewClose"
      @opened="onReviewOpened"
    >
      <el-form size="small" :model="reviewDialog.form" ref="reviewRef">
        <el-form-item label=" ">
          <el-radio-group v-model="reviewDialog.form.orderStatus">
            <el-radio label="4">通过</el-radio>
            <el-radio label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
          v-if="reviewDialog.form.orderStatus === '2'"
          :rules="[{ required: true, message: '不通过理由不能为空', trigger: 'blur' }]"
        >
          <el-input
            type="textarea"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="reviewDialog.form.remark"
            placeholder="请输入不通过理由"
          />
        </el-form-item>
      </el-form>
    </basic-dialog>

    <basic-dialog :showFooter="false" width="820px" is-scroll title="物流轨迹" v-model="trackVisible">
      <div @click="onRefresh" class="refresh-wrap">
        <el-icon size="28" class="cursor-pointer"><refresh /></el-icon>
      </div>
      <div class="tms-timeline" v-loading="trackLoading">
        <template v-if="!!+orderTrackList.length">
          <div v-for="(item, idx) in orderTrackList" :key="idx" class="tms-timeline-item">
            <div class="tms-timeline-item__tail"></div>
            <div class="tms-timeline-item__node" :class="{ active: item.isActive }"></div>
            <div class="tms-timeline-item__time" :class="{ active: item.isActive }">
              {{ item.createDate }}
            </div>
            <div class="tms-timeline-item__wrapper">
              <div :class="{ active: item.isActive }">
                {{ item.details }}
              </div>
              <div class="mt-10px">
                {{ item.statusDescription }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div style="text-align: center">暂无物流轨迹，请点击右上方刷新按钮进行刷新操作</div>
        </template>
      </div>
    </basic-dialog>

    <basic-dialog :showFooter="false" width="820px" title="订单日志" v-model="orderLogVisible">
      <el-table :data="logList" size="small" border stripe>
        <el-table-column prop="operateType" label="订单类型" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="createBy" label="操作人" />
        <el-table-column prop="interfaceType" label="接口类型" v-auth="['order:log:download']" />
        <el-table-column prop="operate" label="操作" v-auth="['order:log:download']">
          <template #default="scope">
            <export-button :api="exportLogInfo" :params="{ id: scope.row.id }" :filename="`订单日志`" :isTxtFile="true"
              >下载</export-button
            >
          </template>
        </el-table-column>
      </el-table>
    </basic-dialog>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, h, onMounted, reactive, ref, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';
  import { PageChangeParams, pageData } from '@/components/Pagination';
  import {
    changeStatus,
    exportLogInfo,
    exportOrder,
    exportOrderDetail,
    getOrder,
    getOrderById,
    getOrderList,
    updateLogistics,
  } from '@/api/order/order-manage/orderList';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { getPickerDate } from '@/utils/dateUtil';
  import {
    useClientCodeList,
    useDictData,
    useSaleProductList,
    useServiceChannelList,
    useWarehouseList,
  } from '@/hooks/select/useSelect';
  import { Refresh } from '@element-plus/icons-vue';
  import { ClientItem, DictOptionItem, SaleProductItem, ServiceChannelItem, WarehouseItem } from '@/api/sys';
  import { getServiceSelectList } from '@/api/logistics/service';
  import { ServiceListItem } from '@/api/logistics/service/model/ServiceModel';
  import { ChannelDetailListItem, LogListItem, OrderListItem } from '@/api/order/order-manage/model/OrderListModel';
  import { useMessage } from '@/hooks/web/useMessage';
  import BasicDialog from '@/components/Dialog/src/BasicDialog.vue';
  import ExportButton from '@/components/Button/src/ExportButton.vue';
  import { BasicTableColumn } from '@/components/Table';

  export default defineComponent({
    name: 'OrderList',
    components: {
      ExportButton,
      BasicDialog,
      Refresh,
    },
    setup() {
      const { createBriefSuccessMsg, createConfirm } = useMessage();

      const columns: BasicTableColumn[] = [
        {
          prop: 'externalno',
          label: '订单号',
          isShow: true,
          formatter: (row) => {
            return row.externalno || '/';
          },
        },
        {
          prop: 'externalno2',
          label: '参考号',
          isShow: true,
          formatter: (row) => {
            return row.externalno2 || '/';
          },
        },
        {
          prop: 'trackingNo',
          label: '快递单号',
          isShow: true,
          formatter: (row, _, cellValue) => {
            return h(
              'span',
              {
                class: cellValue && 'btn-text',
                onClick: () => onTrackNoClick(cellValue, row.id),
              },
              cellValue || '/',
            );
          },
        },
        {
          prop: 'promotingProductsCode',
          label: '销售产品编号',
          isShow: true,
          formatter: (row) => {
            return row.promotingProductsCode || '/';
          },
        },
        {
          prop: 'warehouseCode',
          label: '仓库编号',
          isShow: true,
          formatter: (row) => {
            return row.warehouseCode || '/';
          },
          width: 100,
        },
        {
          prop: 'price',
          label: '总金额',
          isShow: true,
          width: 80,
          formatter: (row) => {
            return row.price || '/';
          },
        },
        {
          prop: 'insuranceSuccess',
          label: '投保状态',
          isShow: true,
          width: 100,
          formatter: (_row, _column, cellValue) => {
            if (!cellValue) return h('span', {}, '/');
            const value = ['失败', '成功', '投保中'][cellValue];
            const stateClass = ['text-delete', 'text-invalid', 'text-active'][cellValue];
            return h('span', { class: stateClass }, value);
          },
        },
        {
          prop: 'createDate',
          label: '下单时间',
          isShow: true,
          width: 150,
          formatter: (row) => {
            return row.createDate || '/';
          },
        },
        {
          prop: 'deliveryDate',
          label: '扫描时间',
          isShow: true,
          width: 150,
          formatter: (row) => {
            return row.deliveryDate || '/';
          },
        },
        {
          prop: 'deliveryTime',
          label: '发货时间',
          width: 150,
          isShow: true,
          formatter: (row) => {
            return row.deliveryTime || '/';
          },
        },
        {
          prop: 'remark',
          label: '异常信息',
          width: 150,
          isShow: true,
          formatter: (row) => {
            return row.remark || '/';
          },
        },
        {
          prop: 'orderStatus',
          label: '状态',
          isShow: true,
          width: 120,
          formatter: (row, _, cellValue) => {
            return h(
              'span',
              {
                class: !['0', '4'].includes(cellValue)
                  ? 'text-active'
                  : '' + ' ' + ['4'].includes(cellValue)
                  ? 'text-invalid'
                  : '',
              },
              getOrderStatus(cellValue, row.orderTrackStatus),
            );
          },
        },
      ];
      const orderTrackList = ref<ChannelDetailListItem[]>([]);
      const trackLoading = ref(true);
      const trackVisible = ref(false);
      const curDialogOrderId = ref('');
      const router = useRouter();
      const userStore = useUserStore();
      const isTop = computed(() => userStore.getIsTop);
      const orderStatusActive = ref('all');
      const form = reactive({
        externalno: '',
        externalno2: '',
        enterpriseRecordId: '',
        trackingNo: '',
        promotingProductsCode: '',
        serviceProviderCode: '',
        serviceChannelCode: '',
        warehouseCode: '',
        warehouseType: '',
        orderDateRange: [],
        createStartTime: '',
        createEndTime: '',
        deliveryDateRange: [],
        expressDateRange: [],
        deliveryStartTime: '',
        deliveryEndTime: '',
        labelStartTime: '',
        labelEndTime: '',
        orderStatus: '', // 订单状态 0草稿 1已发货 2已预报 3问题件 4已取消 5取消待审核
        insuranceSuccess: '',
      });
      const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]);
      const list = ref<OrderListItem[]>([]);
      const logList = ref<LogListItem[]>([]);
      const pageParams = pageData();
      const exportLoading = ref(false);
      const exportExpressLoading = ref(false);
      const orderStatusList = ref([
        //  value * 0草稿 1已预报 2已发货 暂无法获取此状态* 3问题件 4已取消 5取消待审核 * 6待预报 7已获取面单 8待取消
        { id: 1, label: '所有订单', name: 'all', value: '' },
        { id: 2, label: '草稿', name: 'draft', value: '0' },
        { id: 3, label: '待预报', name: 'forecast', value: '6' },
        { id: 4, label: '物流处理', name: 'to_forecast', value: '33' },
        { id: 5, label: '问题件', name: 'problem', value: '3' },
        { id: 6, label: '已获面单', name: 'get_label', value: '7' },
        { id: 7, label: '取消待审核', name: 'cancel_pending', value: '5' },
        { id: 8, label: '已取消', name: 'canceled', value: '4' },
        { id: 9, label: '已发货', name: 'delivered', value: '2' },
        { id: 10, label: '已扫描', name: 'scan', value: '9' },
        { id: 11, label: '已签收', name: 'sign', value: '10' },
      ]);
      const saleProductList = ref<SaleProductItem[]>([]);
      const warehouseList = ref<WarehouseItem[]>([]);
      const clientCodeList = ref<ClientItem[]>([]);
      const warehouseTypeList = ref<DictOptionItem[]>([]);
      const serviceProviderCodeList = ref<ServiceListItem[]>([]);
      const serviceChannelCodeList = ref<ServiceChannelItem[]>([]);
      const tabLoading = ref(false);

      type ReviewDialogState = {
        visible: boolean;
        curData?: OrderListItem | null;
        form: {
          orderStatus: string;
          remark?: string;
        };
      };
      const reviewDialog = reactive<ReviewDialogState>({
        visible: false,
        curData: null,
        form: {
          orderStatus: '4',
          remark: '',
        },
      });

      const reviewRef = ref();
      async function onReviewSubmit({ showLoading, closeLoading, closeDialog }) {
        await formValidate(reviewRef);
        showLoading();
        try {
          await changeStatus({
            id: reviewDialog.curData!.id,
            orderStatus: +reviewDialog.form.orderStatus,
            remark: reviewDialog.form.remark,
          });
          closeDialog();
          await loadList();
          createBriefSuccessMsg('审核成功');
        } catch (e) {
          console.error(e);
        } finally {
          closeLoading();
        }
      }
      function onReviewClose() {
        reviewDialog.curData = null;
      }
      function onReviewOpened() {
        reviewDialog.form.remark = '';
      }

      const orderLogVisible = ref(false);
      const searchFormRef = ref();

      function getRequestParams() {
        // 订单开始结束时间
        const { startTime: createStartTime, endTime: createEndTime } = getPickerDate(form.orderDateRange);
        // 发货开始和结束时间
        const { startTime: deliveryStartTime, endTime: deliveryEndTime } = getPickerDate(form.deliveryDateRange);
        // 面单开始结束时间
        const { startTime: labelStartTime, endTime: labelEndTime } = getPickerDate(form.expressDateRange);

        return {
          pageNum: pageParams.pageNum,
          pageSize: pageParams.pageSize,
          externalno: form.externalno,
          externalno2: form.externalno2,
          enterpriseRecordId: form.enterpriseRecordId,
          serviceProviderCode: form.serviceProviderCode,
          serviceChannelCode: form.serviceChannelCode,
          warehouseType: form.warehouseType,
          trackingNo: form.trackingNo,
          promotingProductsCode: form.promotingProductsCode,
          warehouseCode: form.warehouseCode,
          createStartTime: createStartTime,
          createEndTime: createEndTime,
          deliveryStartTime: deliveryStartTime,
          deliveryEndTime: deliveryEndTime,
          labelStartTime: labelStartTime,
          labelEndTime: labelEndTime,
          orderStatus: form.orderStatus || '',
          insuranceSuccess: form.insuranceSuccess,
          listType: 1,
        };
      }

      const loadList = async () => {
        tabLoading.value = true;

        try {
          const params = getRequestParams();
          const { list: _list, pageNum, pageSize, total } = await getOrderList(params);
          list.value = _list;
          pageParams.pageSize = pageSize;
          pageParams.pageNum = pageNum;
          pageParams.total = total;
          tabLoading.value = false;
        } catch (e) {
          console.error(e);
          tabLoading.value = false;
        }
      };

      const onRefresh = async () => {
        try {
          trackLoading.value = true;
          let data = await updateLogistics(unref(curDialogOrderId));
          orderTrackDetailListOperate(data);
        } catch (e) {
          console.error(e);
        } finally {
          trackLoading.value = false;
        }
      };

      const operate = async (type, item) => {
        switch (type) {
          case 'look':
            await router.push({ name: 'OrderDetail', params: { id: item.id } });
            break;
          case 'del':
            try {
              createConfirm({
                title: '取消',
                message: '此操作将取消该记录！',
                type: 'info',
                beforeClose: async (action, instance, done) => {
                  if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    try {
                      await changeStatus({ id: item.id, orderStatus: 4 });
                      createBriefSuccessMsg(`删除成功`);
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
            break;
          case 'review':
            reviewDialog.form.orderStatus = '4';
            reviewDialog.curData = item;
            reviewDialog.visible = true;
            break;
          case 'log':
            try {
              const { orderApiLogList } = await getOrderById(item.id);
              logList.value = orderApiLogList;
              orderLogVisible.value = true;
            } catch (e) {
              console.error(e);
            }
            break;
        }
      };

      const onPageChange = (params: PageChangeParams) => {
        params.pageSize && (pageParams.pageSize = params.pageSize);
        params.pageNum && (pageParams.pageNum = params.pageNum);
        loadList();
      };

      const onSearch = () => {
        pageParams.pageNum = 1;
        loadList();
      };

      const onReset = () => {
        formResetFields(searchFormRef);
        form.serviceChannelCode = '';
        loadList();
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

      const handleTabClick = (val) => {
        const remarkIndex = columns.findIndex((e) => e.prop === 'orderStatusRemark');
        if (['problem', 'canceled'].includes(val.props.name)) {
          if (remarkIndex === -1) {
            columns.splice(9, 0, {
              prop: 'orderStatusRemark',
              label: '渠道异常信息',
              isShow: unref(isTop),
              width: 120,
              formatter: (row) => {
                return row.orderStatusRemark || '/';
              },
            });
          }
        } else {
          if (remarkIndex > -1) {
            columns.splice(remarkIndex, 1);
          }
        }
        form.orderStatus = orderStatusList.value.find((item) => item.name === val.props.name)!.value;
        loadList();
      };

      const getOrderStatus = (val, newVal) => {
        const statusList = [...orderStatusList.value, { label: '取消中', value: '8' }];
        if (
          newVal &&
          newVal.toString() !== '0' &&
          (val.toString() === '7' || val.toString() === '9' || val.toString() === '10')
        ) {
          const newValList = [
            { label: '查询不到', value: '1' },
            { label: '运输过久', value: '2' },
            { label: '投递失败', value: '3' },
            { label: '可能异常', value: '4' },
            { label: '到达代取', value: '5' },
            { label: '运输途中', value: '6' },
            { label: '成功签收', value: '7' },
          ];
          return newValList.find((e) => e.value === newVal)?.label;
        } else {
          return statusList.find((e) => e.value === val)?.label;
        }
      };

      const orderTrackDetailListOperate = (orderTrackDetailList) => {
        orderTrackList.value = orderTrackDetailList;
        orderTrackList.value = orderTrackList.value.map((e, idx) => {
          e.isActive = idx === 0;
          return e;
        });
      };

      /**
       * @description: 点击快递单号出来的物流轨迹弹窗
       * @param trackNo
       * @param id
       */
      const onTrackNoClick = async (trackNo, id) => {
        if (!trackNo) return;
        try {
          trackLoading.value = true;
          const { orderTrackDetailList } = await getOrder(id);
          curDialogOrderId.value = id;
          orderTrackDetailListOperate(orderTrackDetailList);
          trackVisible.value = true;
        } catch (e) {
          console.error(e);
        } finally {
          trackLoading.value = false;
        }
      };

      onMounted(async () => {
        await loadList();
        saleProductList.value = await useSaleProductList();
        warehouseList.value = await useWarehouseList();
        if (isTop.value) {
          clientCodeList.value = await useClientCodeList();
          warehouseTypeList.value = await useDictData('warehouseType');
          serviceProviderCodeList.value = await getServiceSelectList();
          serviceChannelCodeList.value = await useServiceChannelList();
        }
      });

      return {
        columns,
        orderTrackList,
        trackLoading,
        trackVisible,
        isTop,
        form,
        defaultTime,
        list,
        logList,
        pageParams,
        exportLoading,
        exportExpressLoading,
        orderStatusList,
        orderStatusActive,
        saleProductList,
        warehouseList,
        clientCodeList,
        warehouseTypeList,
        serviceProviderCodeList,
        serviceChannelCodeList,
        reviewDialog,
        onReviewSubmit,
        onReviewClose,
        onReviewOpened,
        reviewRef,
        orderLogVisible,
        tabLoading,
        searchFormRef,

        getRequestParams,
        handleTabClick,
        onRefresh,
        onChangeService,
        onSearch,
        onReset,
        onPageChange,
        operate,
        exportLogInfo,
        exportOrder,
        exportOrderDetail,
      };
    },
  });
</script>

<style scoped lang="scss">
  .refresh-wrap {
    display: flex;
    flex-direction: row-reverse;
    padding: 10px 20px;
  }
  .tms-timeline {
    padding: 20px;
    &-item {
      position: relative;
      padding-bottom: 20px;
    }
    &-item__time {
      width: 150px;
      &.active {
        color: #2f9b98;
      }
    }
    &-item__tail {
      position: absolute;
      left: 158px;
      height: 100%;
      border-left: 2px solid #eee;
    }

    &-item__node {
      left: 154px;
      width: 10px;
      height: 10px;
      position: absolute;
      background-color: #ccc;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      &.active {
        background-color: #2f9b98;
      }
    }
    &-item__wrapper {
      position: relative;
      padding-left: 178px;
      top: -20px;

      .active {
        color: #2f9b98;
      }
    }
  }
</style>
