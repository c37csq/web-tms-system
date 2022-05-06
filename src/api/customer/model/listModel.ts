/*
 * @Author: handsomeFu
 * @Date: 2021-12-01 18:08:24
 * @LastEditTime: 2021-12-23 18:38:56
 * @LastEditors: handsomeFu
 * @Description:
 */
import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export interface CustomerItem {
  accountFrozen: number | string; // 冻结额度
  address: string;
  balanceStatus: string; // 是否冻结 0  1已冻结
  clientCode: string;
  clientName: string;
  companyName: string;
  contractEndTime: string;
  contractExpire: number | string; // 合同到期提醒
  contractStartTime: string;
  createBy: string;
  createDate: string;
  currencySymbol: string;
  currentBalance: number | string;
  currentQuota: number | string;
  customerBalance: number | string;
  economics: string;
  effectiveState: number | string;
  email: string;
  enterpriseStatus: number | string;
  extrasLevel: string; // // 杂费等级
  fixedQuota: number | string;
  freightLevel: string; // 运费等级
  id: string;
  remindSum: number | string; // 提醒金额
  sellRepresent: string;
  serviceRepresent: string;
  telephone: string;
  updateBy: string;
  updateDate: string;
  warehouseList: string; // 已经分配仓库
}
export type CustomerPageListGetResultModel = BasicFetchResult<CustomerItem>;

/*
 * @param clientCode 客户代码
 * @param companyName 公司名称
 * @param effectiveState 合同生效状态（0未生效1生效2过期）
 * @param serviceRepresent 客服代表
 * @param sellRepresent 销售代表
 * @param enterpriseStatus 企业状态（0待审核、1启用、2停用）
 * @param currentBalanceStart 开始余额
 * @param currentBalanceEnd 截至余额
 * @param currentQuotaStart 开始额度
 * @param currentQuotaEnd 截至额度
 */
export type CustomerSearchParams = BasicPageParams & {
  clientCode?: string;
  companyName?: string;
  effectiveState?: string; // 合同状态
  serviceRepresent?: string; // 客户代表
  sellRepresent?: string; // 销售代表
  enterpriseStatus?: string; // 客户状态
  currentBalanceStart?: string; // 可用余额
  currentBalanceEnd?: string;
  currentQuotaStart?: string; // 信用额度
  currentQuotaEnd?: string;
};
export type CustomerParams = {
  id?: string;
  loginName?: string;
  password?: string;
  clientCode: string;
  clientName: string;
  telephone: number | string;
  email: string;
  address: string;
  companyName: string;
  remindSum: string;
  currencySymbol: string;
  contractExpire: number | string;
  freightLevel: string;
  extrasLevel: string;
  economics: string;
  contractStartTime: string;
  contractEndTime: string;
  dateRange: string[];
};

/**
 * @description 分配
 */
export type AllotWarehouseParams = {
  clientCode: string[];
  warehouseList: string;
};
export type AllotRepresentParams = {
  clientCode: string[];
  sellRepresent: string; // 销售代表
  serviceRepresent: string; // 客户代表
};

export type ApplyQuotaParams = {
  enterpriseRecordId: string; // 客户ID
  clientCode: string;
  currentBalance: number | string; // 当前余额
  temporaryQuota: string; // 临时额度
  currencySymbol: string; // 币种
  quotaStartTime: string | Date;
  quotaEndTime: string | Date;
  quotaReason?: string; // 申请原因
};

export interface SysEnterprisePriceItem {
  id?: string | number;
  productsId?: number | string;
  freightLevel: string;
  extrasLevel: string;
  volumeFactor: string;
}
export type CustomerPriceParams = {
  enterpriseRecordId: string;
  sysEnterprisePrices: SysEnterprisePriceItem[] | []; // 传空则为清空
};

export type CustomerPriceResultModel = {
  clientCode: string;
  enterpriseRecordId: string;
  sysEnterprisePrices: SysEnterprisePriceItem[];
};
