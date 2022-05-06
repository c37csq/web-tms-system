/**
 * Created By fzq on 2021/11/29 14:41
 */
import {
  CommonFarePriceDetailList,
  CommonIncidentalsItem,
  CommonProductsSundryChargesDetailsItem,
  CommonStatusParams,
} from '@/api/expense';
import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

/**
 * @description 成本杂费以及成本杂费操作
 */
export interface CostIncidentalsItem extends CommonIncidentalsItem {
  costSundryChargesDetailsList: any[];
  serviceChannelCode: string;
}
export type CostIncidentalsPageGetResultModel = BasicFetchResult<CostIncidentalsItem>;
export type CostIncidentalsSearchParams = BasicPageParams & {
  serviceChannelCode?: string; // 服务商渠道
  currency?: string;
  status?: string; // 状态（0草稿1发布2作废）
  effectiveState?: string; // 生效状态（0未生效1生效2过期）
  startTime?: string;
  endTime?: string;
};
export type CostIncidentalsParams = {
  sundryChargesId?: number;
  serviceChannelCode: string; // 服务商
  currency: string;
  startTime: string;
  endTime: string;
  costSundryChargesDetailsList?: CommonProductsSundryChargesDetailsItem[];
};
export type CostIncidentalsStatusParams = CommonStatusParams & {
  sundryChargesId: number[]; // ids
};

/**
 * @description 成本运费/成本运费操作
 */
// CostFareItem,
//   CostFarePageGetResultModel,
//   CostFareParams,
//   CostFareSearchParams,
//   CostFareStatusParams,
export interface CostFareItem {
  costPriceDetailsList: any[];
  costPriceDetailsListTemp: CommonFarePriceDetailList;
  costPriceId: number;
  costPriceName: string;
  createBy: string;
  createTime: string;
  currency: string;
  delFlag: string;
  effectiveState: string;
  endTime: string;
  serviceChannelCode: string;
  startTime: string;
  status: string;
  updateBy: string;
  updateTime: string;
}
export type CostFarePageGetResultModel = BasicFetchResult<CostFareItem>;
export type CostFareSearchParams = BasicPageParams & {
  currency?: string;
  serviceChannelCode?: string; // 服务商渠道
  status?: string;
  effectiveState?: string;
  startTime?: string;
  endTime?: string;
};
export type CostFareParams = {
  costPriceId?: number;
  costPriceDetailsListTemp: CommonFarePriceDetailList;
  costPriceName: string;
  currency: string;
  endTime: string;
  serviceChannelCode: string;
  startTime: string;
};
export type CostFareStatusParams = CommonStatusParams & {
  costPriceIds: number[];
};
