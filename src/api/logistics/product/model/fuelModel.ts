import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export type FuelListParams = BasicPageParams & {
  ratioType?: number;
  teamId?: string;
  status?: string;
  effectiveState?: string;
};

export type FuelOperateParams = {
  teamId: string; // 产品组id
  ratio: string; // 燃油比率
  ratioType: number; // 燃油比率类型（0成本，1销售）
  startTime: string; // 生效时间
  endTime: string; // 结束时间
  ratioId?: number;
};

export interface FuelListItem {
  ratioId: number;
  ratio: number;
  ratioType: number;
  teamId: number;
  status: number;
  effectiveState: number;
  startTime: string;
  endTime: string;
  delFlag: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  productLabel: string;
}

// list return type
export type FuelListReturnType = BasicFetchResult<FuelListItem>;

export type LogListReturnType = {
  sysCurrencyLogId: number;
  currencyId: number;
  currencySymbol: string;
  exchangeRateOld: number;
  exchangeRateNew: number;
  createBy: string;
  logRemark: string;
  createTime: string;
};

export type PubListType = {
  id: number;
  oldStartTime: string;
  oldEndTime: string;
  newEndTime: string;
  action: string;
};

export type PubParams = { ratioId: number; status: number; verify?: number };
