/**
 * Created By fzq on 2021/11/30 15:26
 */
import { tmsHttp } from '@/utils/http/axios';
import {
  CommonFarePriceDetailList,
  CostFareItem,
  CostFarePageGetResultModel,
  CostFareParams,
  CostFareSearchParams,
  CostFareStatusParams,
} from '@/api/expense';

enum Api {
  Fare = '/costPrice',
  FareDetail = '/costPrice/detailById',
  FareStatus = '/costPrice/status',
  ExportFare = '/costPrice/template',
  FarePriceDetail = '/cspServiceChannel/selectPriceListById',
}

export const getCostFareListByPage = (params: CostFareSearchParams) =>
  tmsHttp.get<CostFarePageGetResultModel>({ url: Api.Fare, params });
export const addCostFare = (params: CostFareParams) => tmsHttp.post({ url: Api.Fare, params });
export const updateCostFare = (params: CostFareParams) => tmsHttp.put({ url: Api.Fare, params });

export const changeCostFareStatus = (params: CostFareStatusParams) => tmsHttp.put({ url: Api.FareStatus, params });

export const getCostFarePriceDetail = (serviceChannelCode: string) =>
  tmsHttp.get<CommonFarePriceDetailList>({
    url: Api.FarePriceDetail,
    params: { serviceChannelCode },
  });

export const getCostFareDetail = (costPriceId: number) =>
  tmsHttp.get<CostFareItem>({ url: Api.FareDetail, params: { costPriceId } });

export const exportCostFare = (params: CommonFarePriceDetailList) =>
  tmsHttp.post<{ file: string }>({ url: Api.ExportFare, params });
