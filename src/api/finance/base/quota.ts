// 收款银行查询
import { tmsHttp } from '@/utils/http/axios';
import {
  BalanceReturnType,
  ChangeParams,
  QuotaListReturnType,
  QuotaParams,
  ReviewParams,
} from '@/api/finance/base/model/quotaModel';

enum Api {
  List = '/sys/client/quota/list',
  Banance = '/sys/client/client/balance',
  Change = '/sys/client/quota/adjustment',
  Review = '/sys/client/quota/check',
}

export const getQuotaList = (params: QuotaParams) =>
  tmsHttp.get<QuotaListReturnType>({
    url: `${Api.List}?pageNum=${params.pageNum}&pageSize=${params.pageSize}&quotaStatus=${params.quotaStatus}&effectiveState=${params.effectiveState}&clientCode=${params.clientCode}&createBy=${params.createBy}&createTimeEnd=${params.createTimeEnd}&createTimeStart=${params.createTimeStart}`,
  });

export const getBalance = (clientCode: string) =>
  tmsHttp.get<BalanceReturnType>({
    url: `${Api.Banance}?clientCode=${clientCode}`,
  });

export const changeBalance = (params: ChangeParams) =>
  tmsHttp.put<null>({
    url: `${Api.Change}`,
    params,
  });

export const reviewBalance = (params: ReviewParams) =>
  tmsHttp.put<null>({
    url: `${Api.Review}`,
    params,
  });
