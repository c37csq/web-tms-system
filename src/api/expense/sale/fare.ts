/**
 * Created By fzq on 2021/11/30 10:08
 */
import { tmsHttp } from '@/utils/http/axios';
import {
  CommonFarePriceDetailList,
  SaleFareItem,
  SaleFarePageGetResultModel,
  SaleFareParams,
  SaleFareSearchParams,
  SaleFareStatusParams,
} from '@/api/expense';

enum Api {
  Fare = '/sellSalesPrice',
  FarePriceDetail = '/sellPromotingProducts/selectPriceListById',
  FareDetail = '/sellSalesPrice/detailById',
  FareStatus = '/sellSalesPrice/status',
  ExportFare = '/sellSalesPrice/template',
}

export const getSaleFareListByPage = (params: SaleFareSearchParams) =>
  tmsHttp.get<SaleFarePageGetResultModel>({ url: Api.Fare, params });
export const addSaleFare = (params: SaleFareParams) => tmsHttp.post({ url: Api.Fare, params });
export const updateSaleFare = (params: SaleFareParams) => tmsHttp.put({ url: Api.Fare, params });

export const changeSaleFareStatus = (params: SaleFareStatusParams) => tmsHttp.put({ url: Api.FareStatus, params });

export const getSaleFarePriceDetail = (promotingProductsCode: string) =>
  tmsHttp.get<CommonFarePriceDetailList>({
    url: Api.FarePriceDetail,
    params: { promotingProductsCode },
  });

export const getSaleFareDetail = (salesPriceId: number) =>
  tmsHttp.get<SaleFareItem>({ url: Api.FareDetail, params: { salesPriceId } });

export const exportSaleFare = (params: CommonFarePriceDetailList) =>
  tmsHttp.post<{ file: string }>({ url: Api.ExportFare, params });
