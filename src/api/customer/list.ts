/*
 * @Author: handsomeFu
 * @Date: 2021-12-01 18:08:24
 * @LastEditTime: 2021-12-23 18:38:22
 * @LastEditors: handsomeFu
 * @Description:
 */
import { tmsHttp } from '@/utils/http/axios';
import {
  AllotRepresentParams,
  AllotWarehouseParams,
  ApplyQuotaParams,
  CustomerParams,
  CustomerPriceParams,
  CustomerPriceResultModel,
  CustomerSearchParams,
} from '@/api/customer/model/listModel';

enum Api {
  List = '/sys/client/select/client/list',
  Customer = '/sys/client/client/info',
  AllotWarehouse = '/sys/client/allot/warehouse',
  AllotRepresent = '/sys/client/allot/represent',
  CustomerStatus = '/admin/system/enterprise/changeStatus', // 修改企业状态 0待审核 1启用 2停用 3审核不通过
  ApplyQuota = '/sys/client/quota/application', // 申请额度
  FixedQuota = '/sys/client/fixed/quota/application', // 固定额度
  FreezeAmount = '/sys/client/blocked/balance',
  CustomerPrice = '/sys/client/enterprise/price', // get 获取价格套餐 post进行修改
}

export const getCustomerListByPage = (params: CustomerSearchParams) => tmsHttp.get({ url: Api.List, params });
export const addCustomer = (params: CustomerParams) => tmsHttp.post({ url: Api.Customer, params });
export const updateCustomer = (params: CustomerParams) => tmsHttp.put({ url: Api.Customer, params });

export const allotWarehouse = (params: AllotWarehouseParams) => tmsHttp.put({ url: Api.AllotWarehouse, params });
export const allotRepresent = (params: AllotRepresentParams) => tmsHttp.put({ url: Api.AllotRepresent, params });

export const applyQuota = (params: ApplyQuotaParams) => tmsHttp.post({ url: Api.ApplyQuota, params });

export const fixedQuotaApi = (params: { enterpriseRecordId: string; fixedQuota: string | number }) =>
  tmsHttp.put({ url: Api.FixedQuota, params });

export const freezeAmount = (params: { enterpriseRecordId: string; accountFrozen: string | number }) =>
  tmsHttp.put({ url: Api.FreezeAmount, params });

export const getCustomerPrice = (enterpriseRecordId: string) =>
  tmsHttp.get<CustomerPriceResultModel>({ url: Api.CustomerPrice, params: { enterpriseRecordId } });

export const customerPriceMaintain = (params: CustomerPriceParams) => tmsHttp.post({ url: Api.CustomerPrice, params });

/**
 * @description 更改状态
 * @param params
 * status 新用户开户后为0 表示待审核 只能审核和编辑 审核- 审核通过 1  审核不通过3
 * status 1 表示审核通过  可以一系列操作+停用 停用传2
 * status 2 表示被停用     只能编辑和转到待审核  转到待审核 0
 * status 3 表示审核不通过  只能编辑和转到待审核  转到待审核 0
 */
export const changeCustomerStatus = (params: { id: string; status: string | number }) =>
  tmsHttp.get({ url: Api.CustomerStatus, params });
