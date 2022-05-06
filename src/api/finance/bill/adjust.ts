/**
 * Created By fzq on 2021/12/3 10:22
 */
import { tmsHttp } from '@/utils/http/axios';
import {
  AdjustAuditParams,
  AdjustListGetResultModel,
  AdjustParams,
  AdjustSearchParams,
} from '@/api/finance/bill/model/billModel';
import { ContentTypeEnum } from '@/enums/httpEnum';

enum Api {
  List = '/sys/remittance/adjust/recorded/list',
  Adjust = '/sys/remittance/adjust/recorded',
  AuditAdjust = '/sys/remittance/affirm/adjust/recorded',
}

export const getAdjustListByPage = (params: AdjustSearchParams) =>
  tmsHttp.get<AdjustListGetResultModel>({ url: Api.List, params });

export const addAdjust = (params: AdjustParams) =>
  tmsHttp.post({
    url: Api.Adjust,
    params,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  });
export const updateAdjust = (params: AdjustParams) =>
  tmsHttp.put({
    url: Api.Adjust,
    params,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  });
export const auditAdjust = (params: AdjustAuditParams) =>
  tmsHttp.put({
    url: Api.AuditAdjust,
    params,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  });
export const delAdjust = (id: string) =>
  tmsHttp.delete({
    url: Api.Adjust,
    params: { id },
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  });
