import { blobFileHttp, tmsHttp } from '@/utils/http/axios';
import {
  ChannelDetail,
  OrderDetail,
  OrderListItem,
  OrderListParams,
  OrderListReturnType,
  OrderType,
} from '@/api/order/order-manage/model/OrderListModel';

enum Api {
  List = '/externalOrder/list',
  OrderEdit = '/externalOrder/edit',
  UpdateChannel = '/externalOrder/editLogistics',
  ChangeStatus = '/externalOrder/changeStatus',
  Export = '/externalOrder/orderInfoFile',
  OrderExport = '/externalOrder/export',
  OrderDetail = '/externalOrder/export/orderInfo',
  BackOrder = '/externalOrder/backOff',
}

// 获取订单列表
export const getOrderList = (params: OrderListParams) => tmsHttp.post<OrderListReturnType>({ url: Api.List, params });

// 获取订单
export const getOrder = (id: string) => tmsHttp.get<OrderDetail>({ url: Api.OrderEdit, params: { id } });

// 获取轨迹数据
export const updateLogistics = (id: string) => tmsHttp.get<ChannelDetail[]>({ url: `${Api.UpdateChannel}?id=${id}` });

/**
 * 更改状态
 * orderStatus 0草稿 1已预报 2已发货 3问题件 4已废弃 5废弃待审核
 * 废弃 status=4 已废弃0,1>4 废弃待审核2>5
 * 废弃审核 status=4 审核通过 5>4
 * 废弃审核 status=2 审核不通过 5>2
 */
export const changeStatus = (params: { id: string; orderStatus: number; remark?: string }) =>
  tmsHttp.get<null>({
    url: Api.ChangeStatus,
    params,
  });

export const getOrderById = (id: number) => tmsHttp.get<OrderListItem>({ url: `${Api.OrderEdit}?id=${id}` });

export const exportLogInfo = (params: { id: number }) => blobFileHttp.get({ url: `${Api.Export}?id=${params.id}` });

export const exportOrder = (params: OrderType) => blobFileHttp.post({ url: `${Api.OrderExport}`, params });

export const exportOrderDetail = (params: OrderType) => blobFileHttp.post({ url: `${Api.OrderDetail}`, params });

export const backErrorOrder = (params: { externalOrderIds: any[]; exceptionType: string; remark: string }) =>
  tmsHttp.post<null>({ url: `${Api.BackOrder}`, params });
