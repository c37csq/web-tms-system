/**
 * Created By fzq on 2021/11/26 17:25
 */
import { tmsHttp } from '@/utils/http/axios';

import {
  SaleIncidentalsDiscountItem,
  SaleIncidentalsDiscountPageGetResultModel,
  SaleIncidentalsDiscountSearchParams,
  SaleIncidentalsDiscountParams,
  SaleIncidentalsDiscountStatusParams,
} from './model/saleModel';

enum Api {
  IncidentalsDiscount = '/salePriceDiscount',
  IncidentalsDiscountStatus = '/salePriceDiscount/status',
  IncidentalsDiscountDetail = '/salePriceDiscount/detailById',
}

export const getSaleIncidentalsDiscountListByPage = (params: SaleIncidentalsDiscountSearchParams) =>
  tmsHttp.get<SaleIncidentalsDiscountPageGetResultModel>({ url: Api.IncidentalsDiscount, params });
export const addSaleIncidentalsDiscount = (params: SaleIncidentalsDiscountParams) =>
  tmsHttp.post({ url: Api.IncidentalsDiscount, params });
export const updateSaleIncidentalsDiscount = (params: SaleIncidentalsDiscountParams) =>
  tmsHttp.put({ url: Api.IncidentalsDiscount, params });

// 更该状态  status 作废传2
export const changeSaleIncidentalsDiscountStatus = (params: SaleIncidentalsDiscountStatusParams) =>
  tmsHttp.put({ url: Api.IncidentalsDiscountStatus, params });

export const getSaleIncidentalsDiscountDetail = (salePriceDiscountId: number) =>
  tmsHttp.get<SaleIncidentalsDiscountItem>({
    url: Api.IncidentalsDiscountDetail,
    params: { salePriceDiscountId },
  });
