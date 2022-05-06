import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';
import { OrderListItem } from '@/api/order/order-manage/model/OrderListModel';

export type ErrorListParams = {
  externalno: string;
  externalno2: string;
  trackingNo: string;
  referenceNo: string;
  promotingProductsCode: string;
  warehouseCode: string;
  createStartTime: string;
  createEndTime: string;
  deliveryStartTime: string;
  deliveryEndTime: string;
} & BasicPageParams;

export type ErrorListReturnType = BasicFetchResult<OrderListItem>;
