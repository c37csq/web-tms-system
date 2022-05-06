import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export type QuotaParams = {
  quotaStatus: string;
  effectiveState: string;
  clientCode: string;
  createBy: string;
  createTimeEnd: string;
  createTimeStart: string;
} & BasicPageParams;

export type QuotaListItem = {
  balanceId: number;
  clientCode: string;
  createBy: string;
  createTime: string;
  currencySymbol: string;
  effectiveState: string;
  enterpriseRecordId: string;
  nickName: string;
  passQuota: number;
  quotaEndTime: string;
  quotaOriginal: string;
  quotaReason: string;
  quotaRemark: string;
  quotaStartTime: string;
  quotaStatus: number;
  temporaryQuota: number;
};

export type BalanceReturnType = {
  currentQuota: string;
  enterpriseRecordId: string;
  currencySymbol: string;
};

export type ChangeParams = {
  enterpriseRecordId: string;
  clientCode: string;
  currencySymbol: string;
  temporaryQuota: string;
  quotaStartTime: string;
  quotaEndTime: string;
  quotaReason: string;
};

export type ReviewParams = {
  balanceId: string;
  quotaStatus: number;
  passQuota: string;
  quotaRemark: string;
};

export type ClientInfoType = {
  clientCode: string;
  temporaryQuota: string;
  currencySymbol: string;
  quotaStatus: number;
  effectiveState: number;
  quotaStartTime: string;
  quotaEndTime: string;
  nickName: string;
  createTime: string;
  quotaReason: string;
  passQuota: string;
  quotaRemark: string;
  balanceId: string;
  quotaOriginal: string;
};

export type QuotaListReturnType = BasicFetchResult<QuotaListItem>;
