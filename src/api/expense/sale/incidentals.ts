/**
 * Created By fzq on 2021/11/29 15:52
 */
import { tmsHttp } from '@/utils/http/axios';
import {
  SaleIncidentalsItem,
  SaleIncidentalsPageGetResultModel,
  SaleIncidentalsParams,
  SaleIncidentalsSearchParams,
  SaleIncidentalsStatusParams,
} from '@/api/expense';

enum Api {
  Incidentals = '/sellProductsSundryCharges',
  IncidentalsStatus = '/sellProductsSundryCharges/status',
  IncidentalsDetail = '/sellProductsSundryCharges/detailById',
}

export const getSaleIncidentalsByPage = (params: SaleIncidentalsSearchParams) =>
  tmsHttp.get<SaleIncidentalsPageGetResultModel>({ url: Api.Incidentals, params });
export const addSaleIncidentals = (params: SaleIncidentalsParams) => tmsHttp.post({ url: Api.Incidentals, params });
export const updateSaleIncidentals = (params: SaleIncidentalsParams) => tmsHttp.put({ url: Api.Incidentals, params });

export const changeSaleIncidentalsStatus = (params: SaleIncidentalsStatusParams) =>
  tmsHttp.put({ url: Api.IncidentalsStatus, params });

export const getSaleIncidentalsDetail = (sundryChargesId: number) =>
  tmsHttp.get<SaleIncidentalsItem>({ url: Api.IncidentalsDetail, params: { sundryChargesId } });
