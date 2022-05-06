/**
 * Created By fzq on 2021/11/30 09:39
 */
import { tmsHttp } from '@/utils/http/axios';

import {
  CostIncidentalsItem,
  CostIncidentalsPageGetResultModel,
  CostIncidentalsParams,
  CostIncidentalsSearchParams,
  CostIncidentalsStatusParams,
} from './model/costModel';

enum Api {
  Incidentals = '/costSundryCharges',
  IncidentalsStatus = '/costSundryCharges/status',
  IncidentalsDetail = '/costSundryCharges/detailById',
}

export const getCostIncidentalsByPage = (params: CostIncidentalsSearchParams) =>
  tmsHttp.get<CostIncidentalsPageGetResultModel>({ url: Api.Incidentals, params });
export const addCostIncidentals = (params: CostIncidentalsParams) => tmsHttp.post({ url: Api.Incidentals, params });
export const updateCostIncidentals = (params: CostIncidentalsParams) => tmsHttp.put({ url: Api.Incidentals, params });

export const changeCostIncidentalsStatus = (params: CostIncidentalsStatusParams) =>
  tmsHttp.put({ url: Api.IncidentalsStatus, params });

export const getCostIncidentalsDetail = (sundryChargesId: number) =>
  tmsHttp.get<CostIncidentalsItem>({ url: Api.IncidentalsDetail, params: { sundryChargesId } });
