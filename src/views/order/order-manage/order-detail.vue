<template>
  <div class="order-detail">
    <div class="*flex-btc mb-20px pr-20px">
      <div class="*flex-ac">
        <el-icon :size="24" @click="goBack"><back /></el-icon>&nbsp;
        <span class="text-xl">{{ orderInfo.externalno }}</span>
      </div>
      <el-button v-if="!orderInfo.backOff && orderInfo.orderStatus === '3'" round type="primary" @click="addShow">
        回退订单
      </el-button>
    </div>

    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="基本信息" name="info">
        <div class="order-info-row">
          <div class="order-info-row__header">
            <span class="order-info-row__title">订单信息</span>
          </div>

          <div class="order-info-row__body">
            <div class="order-info-column">
              <span class="order-info-column__label">订单号：</span>
              <span class="order-info-column__content">
                {{ orderInfo.externalno || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">参考号：</span>
              <span class="order-info-column__content">
                {{ orderInfo.externalno2 || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">下单时间：</span>
              <span class="order-info-column__content">
                {{ orderInfo.createDate || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">发货时间：</span>
              <span class="order-info-column__content">
                {{ orderInfo.deliveryTime || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">毛重：</span>
              <span class="order-info-column__content">
                {{ orderInfo.weight || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">体积重：</span>
              <span class="order-info-column__content">
                {{ orderInfo.volumeWeight || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">计费重：</span>
              <span class="order-info-column__content">
                {{ orderInfo.chargedWeight || '/' }}
              </span>
            </div>
          </div>
        </div>

        <div class="order-info-row">
          <div class="order-info-row__header">
            <span class="order-info-row__title">收件人信息</span>
          </div>

          <div class="order-info-row__body">
            <div class="order-info-column">
              <span class="order-info-column__label">收件人：</span>
              <span class="order-info-column__content">
                {{ orderInfo.receiverFirstname || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">收件人二：</span>
              <span class="order-info-column__content">
                {{ orderInfo.receiverLastname || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">公司名：</span>
              <span class="order-info-column__content">
                {{ orderInfo.receiverCompany || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">国家：</span>
              <span class="order-info-column__content">
                {{ orderInfo.receiverCountry || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">省/州：</span>
              <span class="order-info-column__content">
                {{ orderInfo.receiverProvince || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">城市：</span>
              <span class="order-info-column__content">
                {{ orderInfo.receiverCity || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">邮编：</span>
              <span class="order-info-column__content">
                {{ orderInfo.receiverPostcode || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">收件人地址一：</span>
              <span class="order-info-column__content">
                {{ orderInfo.receiverAddr1 || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">收件人地址二：</span>
              <span class="order-info-column__content">
                {{ orderInfo.receiverAddr2 || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">邮箱：</span>
              <span class="order-info-column__content">
                {{ orderInfo.receiverMail || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">电话：</span>
              <span class="order-info-column__content">
                {{ orderInfo.receiverMobile || '/' }}
              </span>
            </div>
          </div>
        </div>

        <div class="order-info-row">
          <div class="order-info-row__header">
            <span class="order-info-row__title">发件人信息</span>
          </div>

          <div class="order-info-row__body">
            <div class="order-info-column">
              <span class="order-info-column__label">发件人一：</span>
              <span class="order-info-column__content">
                {{ orderInfo.senderFirstname || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">发件人二：</span>
              <span class="order-info-column__content">
                {{ orderInfo.senderLastname || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">公司名：</span>
              <span class="order-info-column__content">
                {{ orderInfo.senderCompany || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">国家：</span>
              <span class="order-info-column__content">
                {{ orderInfo.senderCountry || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">省/州：</span>
              <span class="order-info-column__content">
                {{ orderInfo.senderProvince || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">城市：</span>
              <span class="order-info-column__content">
                {{ orderInfo.senderCity || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">区：</span>
              <span class="order-info-column__content">
                {{ orderInfo.senderDistrict || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">邮编：</span>
              <span class="order-info-column__content">
                {{ orderInfo.senderPostcode || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">发件人地址一：</span>
              <span class="order-info-column__content">
                {{ orderInfo.senderAddr1 || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">发件人地址二：</span>
              <span class="order-info-column__content">
                {{ orderInfo.senderAddr2 || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">邮箱：</span>
              <span class="order-info-column__content">
                {{ orderInfo.senderMail || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">电话：</span>
              <span class="order-info-column__content">
                {{ orderInfo.senderMobile || '/' }}
              </span>
            </div>
          </div>
        </div>

        <div class="order-info-row">
          <div class="order-info-row__header">
            <span class="order-info-row__title">跟踪号信息</span>
          </div>

          <div class="order-info-row__body">
            <div class="order-info-column">
              <span class="order-info-column__label">快递单号：</span>
              <span class="order-info-column__content">
                {{ orderInfo.trackingNo || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">面单：</span>
              <span class="order-info-column__content">
                <template v-if="orderInfo.labelUrl">
                  <el-button
                    style="padding-bottom: 11px"
                    @click="downloadByUrl({ url: orderInfo.labelUrl })"
                    type="text"
                  >
                    下载
                  </el-button>
                </template>
                <template v-else>/</template>
              </span>
            </div>
          </div>
        </div>

        <div class="order-info-row">
          <div class="order-info-row__header">
            <span class="order-info-row__title">保单信息</span>
          </div>
          <div class="order-info-row__body">
            <div class="order-info-column">
              <span class="order-info-column__label">保单单号：</span>
              <span class="order-info-column__content">
                {{ orderInfo.policyNo || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">电子保单：</span>
              <span class="order-info-column__content">
                <template v-if="orderInfo.policyUrl">
                  <el-button @click="downloadByUrl({ url: orderInfo.policyUrl })" type="text"> 下载 </el-button>
                </template>
                <template v-else>/</template>
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">投保金额：</span>
              <span class="order-info-column__content">
                {{ orderInfo.insuranceValue + ' USD' || '/' }}
              </span>
            </div>
          </div>
        </div>

        <div class="order-info-row">
          <div class="order-info-row__header">
            <span class="order-info-row__title">销售产品信息</span>
          </div>

          <div class="order-info-row__body">
            <div class="order-info-column">
              <span class="order-info-column__label">销售产品代码：</span>
              <span class="order-info-column__content">
                {{ orderInfo.promotingProductsCode || '/' }}
              </span>
            </div>
            <div class="order-info-column">
              <span class="order-info-column__label">仓库代码：</span>
              <span class="order-info-column__content">
                {{ orderInfo.warehouseCode || '/' }}
              </span>
            </div>
          </div>
        </div>

        <div class="order-info-row">
          <div class="order-info-row__header">
            <span class="order-info-row__title">额外服务类型</span>
          </div>

          <div class="order-info-row__body">
            <div class="order-info-column">
              <span class="order-info-column__label">签名服务：</span>
              <span class="order-info-column__content">
                {{ orderInfo.signatureServiceLabel || '/' }}
              </span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="包裹信息" name="package">
        <el-table :data="orderInfo.measurementList" size="small" border stripe>
          <el-table-column prop="weight" label="包裹重量" />
          <el-table-column prop="weightUnit" label="重量单位" />
          <el-table-column prop="size" label="长*宽*高">
            <template #default="scope">
              {{ scope.row.length + '*' + scope.row.width + '*' + scope.row.height }}
            </template>
          </el-table-column>
          <el-table-column prop="dimensionUnit" label="尺寸单位" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="订单费用" name="cost">
        <el-table
          :data="orderInfo.salePriceList"
          :span-method="(obj) => spanMethod(obj, 'salePriceList')"
          size="small"
          border
          stripe
        >
          <el-table-column prop="price" label="销售总金额" />
          <el-table-column prop="costName" label="收费类型" />
          <el-table-column prop="cost" label="金额" />
          <el-table-column prop="currency" label="币种" />
          <el-table-column prop="zoneCode" label="订单分区" />
          <el-table-column prop="text" label="扣款类型" />
        </el-table>
        <el-table
          class="mt-20px"
          :data="orderInfo.costPriceList"
          :span-method="(obj) => spanMethod(obj, 'costPriceList')"
          size="small"
          border
          stripe
          v-auth="['system:cost:data']"
        >
          <el-table-column prop="costPrice" label="成本总金额" />
          <el-table-column prop="costName" label="收费类型" />
          <el-table-column prop="cost" label="金额" />
          <el-table-column prop="currency" label="币种" />
          <el-table-column prop="zoneCode" label="订单分区" />
          <el-table-column prop="text" label="扣款类型" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="SKU信息" name="sku">
        <el-table :data="orderInfo.orderDetailList" size="small" border stripe>
          <el-table-column prop="sku" label="SKU代码" />
          <el-table-column prop="cnName" label="SKU名称" />
          <el-table-column prop="enName" label="SKU英文" />
          <el-table-column prop="price" label="申报价格" />
          <el-table-column prop="quantity" label="数量" />
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <basic-dialog width="380px" @submit="onSubmit" v-model="backDialogVisible" title="回退订单">
      <el-form size="small" label-width="100px" id="backOrderDialog" :model="form" :rules="rules" ref="backRef">
        <el-form-item label="异常类型" prop="exceptionType">
          <el-select size="small" placeholder="请选择异常类型" v-model="form.exceptionType" filterable>
            <el-option v-for="item in exceptionTypeList" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="form.remark"
            placeholder="请输入不通过理由"
          />
        </el-form-item>
      </el-form>
    </basic-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, Ref, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { backErrorOrder, getOrder } from '@/api/order/order-manage';
  import { Back } from '@element-plus/icons-vue';
  import { formResetFields, formValidate } from '@/utils/tools';
  import { useDictData } from '@/hooks/select/useSelect';
  import { DictOptionItem } from '@/api/sys';
  import { useMessage } from '@/hooks/web/useMessage';
  import { OrderDetail } from '@/api/order/order-manage/model/OrderListModel';
  import { useTabs } from '@/hooks/web/useTabs';
  import { downloadByUrl } from '@/utils/file/download';

  defineOptions({
    name: 'OrderDetail',
  });

  interface SpanMethodProps {
    rowIndex: number;
    columnIndex: number;
  }
  const route = useRoute();
  const router = useRouter();
  const id = route.params.id as string;
  const backDialogVisible = ref(false);
  const orderInfo = ref({}) as Ref<OrderDetail>;
  const activeName = ref('info');
  const signatureMap = {
    0: '不签名',
    1: '成年',
    2: '未成年',
  };
  const form = reactive({
    exceptionType: '渠道不支持',
    remark: '',
  });

  const { setTitle } = useTabs();

  const backRef = ref();
  const { createBriefSuccessMsg } = useMessage();

  const rules = {
    exceptionType: [{ required: true, message: '请选择异常类型', trigger: 'change' }],
    remark: [],
  };
  const exceptionTypeList = ref<DictOptionItem[]>([]);

  const loadOrderInfo = async () => {
    try {
      const data = await getOrder(id);
      data.signatureServiceLabel = signatureMap[data.signatureService];
      data.measurementList = data.measurementList.map((e) => {
        return e;
      });
      data.orderCostDetailList = data.orderCostDetailList.map((e) => {
        e.price = data.price;
        e.costPrice = data.costPrice;
        return e;
      });

      data.salePriceList = data.orderCostDetailList
        .filter((e) => +e.type === 1)
        .map((e) => {
          e.price = data.price;
          e.text = '销售';
          return e;
        });
      data.costPriceList = data.orderCostDetailList
        .filter((e) => +e.type === 2)
        .map((e) => {
          e.price = data.costPrice;
          e.text = '成本';
          return e;
        });

      orderInfo.value = data;
    } catch (e) {
      console.error(e);
    }
  };

  const spanMethod = ({ rowIndex, columnIndex }: SpanMethodProps, type: 'salePriceList' | 'costPriceList') => {
    if (columnIndex === 0) {
      if (rowIndex === 0) {
        return {
          rowspan: orderInfo.value[type].length,
          colspan: 1,
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
    }
  };

  const goBack = () => {
    router.push({ name: 'OrderList' });
  };

  const addShow = () => {
    backDialogVisible.value = true;
    formResetFields(backRef);
  };

  const onSubmit = async () => {
    await formValidate(backRef);
    try {
      await backErrorOrder({
        externalOrderIds: [id],
        exceptionType: form.exceptionType,
        remark: form.remark,
      });
      createBriefSuccessMsg('回退成功！');
      await loadOrderInfo();
      backDialogVisible.value = false;
    } catch (e) {
      console.error(e);
    }
  };

  onMounted(async () => {
    await loadOrderInfo();
    await setTitle(`${orderInfo.value.externalno}的订单详情`);
    try {
      exceptionTypeList.value = await useDictData('exceptionType');
    } catch (e) {
      exceptionTypeList.value = [
        { id: 1, label: '渠道不支持', value: '渠道不支持' },
        { id: 2, label: '地址没有街道号码', value: '地址没有街道号码' },
        { id: 3, label: '地址没有门牌号', value: '地址没有门牌号' },
        { id: 4, label: '地址和邮编对不上', value: '地址和邮编对不上' },
      ];
    }
  });
</script>

<style scoped lang="scss">
  .order-info-column {
    margin-top: 10px;
    padding-right: 10px;

    &__label {
      margin-right: 10px;
    }
  }

  .order-info-row {
    &__header {
    }

    &__title {
      font-size: 16px;
      font-weight: 700;
    }

    &__body {
      margin-top: 15px;
      color: #666;
      display: grid;
      grid-template-columns: repeat(4, 25%);
    }

    & + & {
      margin-top: 20px;
    }
  }
</style>
