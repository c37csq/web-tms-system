/**
 * Created By fzq on 2021/11/23 10:29
 */

import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

/**
 * @description bank page about
 */
export interface BankItem {
  bankAccount: string;
  bankId: number;
  bankName: string;
  createBy: string;
  createTime: string;
  currency: string;
  updateBy: string;
  updateTime: string;
}
export type BankSearchParams = BasicPageParams & {
  currency?: string;
  bankName?: string;
  bankAccount?: string;
};
export type BankParams = {
  bankId?: number | '';
  currency: string;
  bankName: string;
  bankAccount: string;
};
export type BankPageListGetResultModel = BasicFetchResult<BankItem>;

/**
 * @description announcement page about
 */
export interface AnnouncementItem {
  clientCodes: string;
  compelStatus: '0' | '1'; // 是否强制（0不强制1强制）
  createBy: string;
  createTime: string;
  delFlag: '0'; // 是否删除
  endTime: string;
  expires: false; // 是否过期
  fileName: string; // 附件名称
  fileUrl: string; // 附件地址
  haveRead: '0' | '1'; // 是否已读(0未读1已读)
  id: number;
  message: string;
  messageTitle: string;
  messageType: '1' | '0'; // 消息类型(0消息中心1公告栏)
  publicStatus: '1' | '0'; // 是否公开（0不公开1公开）
  startTime: string;
}
export type AnnouncementSearchParams = BasicPageParams & {
  compelStatus?: '' | '0' | '1';
  validDateRange?: string[]; // 时间选择
  startTime?: string;
  endTime?: string;
};
export type AnnouncementParams = {
  id?: number;
  publicStatus: '' | '1' | '0'; // 是否公开（0不公开1公开）;
  clientCodes: string;
  fileUrl: string;
  fileName: string;
  messageTitle: string;
  compelStatus: string;
  startTime: string;
  endTime: string;
  message: string;
};
export type AnnouncementPageListGetResultModel = BasicFetchResult<AnnouncementItem>;

/**
 * @description oda page about
 */
export interface OdaItem {
  createBy: string;
  createTime: string;
  delFlag: string;
  odaCode: string;
  odaId: number;
  odaName: string;
  updateBy: string;
  updateTime: string;
}
export type OdaParams = {
  odaCode?: string; // add
  odaId?: number; // edit
  odaName: string;
};

export interface OdaRuleItem {
  createBy: string;
  createTime: string;
  extraServiceCode: string;
  extraServiceName: string; // 自定义字段
  odaDetailId: number;
  odaId: number;
  postcode: string;
  state: string;
}
export type OdaRuleSearchParams = BasicPageParams & {
  odaId: number;
  extraServiceCode?: string;
  state?: string;
  postcode?: string; // 邮编
};
export type OdaRuleParams = {
  odaDetailId?: number;
  odaId: string | number;
  extraServiceCode: string;
  postcode: string;
  state: string;
};
export type OdaRulePageListGetResultModel = BasicFetchResult<OdaRuleItem>;

/**
 * @description dict page about
 */
export interface DictItem {
  createDate: string;
  description: string;
  id: string;
  label: string;
  remarks: string;
  sort: number;
  type: string;
  updateDate: string;
  value: string;
}
export type DictSearchParams = BasicPageParams & {
  label?: string;
  type?: string;
};
export type DictParams = {
  id?: string;
  description: string;
  label: string;
  type: string;
  value: string;
};
export type DictPageListGetResultModel = BasicFetchResult<DictItem>;

/**
 * @description warehouse address page
 */
export interface SchemeItem {
  schemeCode: string;
  teamCode: string;
  operatorName: string;
}
export interface WarehouseItem {
  city: string;
  companyName: string; // 公司名称
  countryCode: string;
  county: string;
  createBy: string;
  createTime: Date;
  delFlag: string | number;
  linkman: string; // 联系人
  mail: string;
  phoneNo: string;
  postcode: string;
  schemeList?: SchemeItem[];
  state: string;
  streetAddress1: string; // 联系地址1
  streetAddress2: string;
  warehouseCode: string;
  warehouseId: number;
  warehouseName: string;
  warehouseType: number;
}
export type WarehouseSearchParams = BasicPageParams & {
  warehouseCode?: string;
  warehouseName?: string;
  warehouseType?: string; // 类型：0:自有仓; 1:fba仓; 2:客户仓;
  companyName?: string;
};
export type WarehouseParams = {
  warehouseId?: number; // edit
  warehouseCode: string;
  warehouseName: string;
  warehouseType: number | string;
  companyName: string;
  linkman: string;
  phoneNo: string;
  countryCode: string;
  state: string;
  city: string;
  county: string;
  streetAddress1: string;
  streetAddress2: string;
  postcode: string;
  mail: string;
  delFlag?: number; // 0恢复
  schemeList?: SchemeItem[]; // 分区方案
};
export type WarehouseListGetResultModel = BasicFetchResult<WarehouseItem>;

/**
 * @description currency page about
 */
export interface CurrencyItem {
  createBy: string;
  createTime: Date;
  currencyId: number;
  currencyName: string;
  currencyStatus: number;
  currencySymbol: string;
  delFlag: string;
  exchangeRate: number;
  startupDate: string;
  updateBy: string;
  updateTime: Date;
}
export type CurrencySearchParams = {
  currencyStatus?: number; // 启用状态（0启用 1未启用）
  currencySymbol?: string; // 币种符号
};
export type CurrencyParams = {
  currencyId?: number;
  currencyName: string; // 币种名称
  currencySymbol: string; // 币种符号
  exchangeRate: string; // 汇率
  startupDate: string; // 启用月份
};
export interface CurrencyLogItem {
  createBy: string;
  createTime: Date;
  currencyId: number;
  currencySymbol: string;
  exchangeRateNew: number;
  exchangeRateOld: number;
  logRemark: string;
  sysCurrencyLogId: number;
}
