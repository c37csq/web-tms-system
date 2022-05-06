/**
 * Created By fzq on 2021/11/29 14:42
 */
import { tmsHttp } from '@/utils/http/axios';
import { SaleTrialSearchParams, CostTrialSearchParams, TrialResultItem } from '../model/commonModel';

enum Api {
  SaleTrial = '/api/costTrial/sale',
  CostTrial = '/api/costTrial/cost',
}

export const saleTrial = (params: SaleTrialSearchParams) =>
  tmsHttp.post<TrialResultItem[]>({ url: Api.SaleTrial, params });

export const costTrial = (params: CostTrialSearchParams) =>
  tmsHttp.post<TrialResultItem[]>({ url: Api.CostTrial, params });
