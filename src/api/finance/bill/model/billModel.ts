/**
 * Created By fzq on 2021/12/3 10:22
 */
import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

/**
 * @description 账单调整
 */
export type AdjustStatus = 0 | 1 | 2 | 3; // 全部  待审核 已扣款 不通过
export interface AdjustItem {
  accessoryName: string;
  accessoryUrl: string;
  affirmCurrency: string;
  affirmMoney: number;
  businessNumber: string;
  cilentCode: string;
  createBy: string;
  createTime: string;
  currency: string;
  enterpriseRecordId: string;
  id: string;
  leaveWord: string;
  money: number | string;
  submitRemark: string;
  transactionStatus: AdjustStatus;
  updateBy: string;
  updateTime: string;
}
export type AdjustListGetResultModel = BasicFetchResult<AdjustItem>;
export type AdjustSearchParams = BasicPageParams & {
  clientCode?: string;
  businessNumber?: string;
  createTimeStart?: string;
  createTimeEnd?: string;
  transactionStatus: AdjustStatus;
};
export type AdjustParams = {
  id?: string;
  enterpriseRecordId: string;
  cilentCode: string;
  businessNumber: string;
  currency: string;
  money: string | number;
  submitRemark: string;
  accessoryUrl: string;
  accessoryName: string;
};
export type AdjustAuditParams = {
  transactionStatus: AdjustStatus; // 审核不通过传 3 通过传 2
  leaveWord: string;
  ids: string;
};

/**
 * @description 补收账单
 */
export interface SupplementItem {
  createBy: string;
  createTime: Date;
  delFlag: string;
  endBillsDate: string;
  exeMsg: string;
  exeStatus: string; // 计费状态 0 未计费  1 计费中  2 计费成功 3 计费失败
  id: number;
  importStatus: string;
  startBillsDate: string;
  subBillStatus: string;
  subBillsCostMoney: number;
  subBillsDate: Date;
  subBillsNumber: string;
  subBillsSellMoney: number;
  subBillsSellSpecialMoney: number;
  sysBillsCostMoney: number;
  updateBy: string;
  updateTime: Date;
  version: number;
}
export type SupplementListGetResultModel = BasicFetchResult<SupplementItem>;
export type SupplementSearchParams = BasicPageParams & {
  subBillsNumber?: string;
  startBillsDate?: string;
  endBillsDate?: string;
};

export type SupplementStatusParams = {
  subBillsNumber: string;
  billStatus: string;
};
export type SupplementImportParams = {
  subBillNumber: string;
  file: File | Blob;
};

/**
 * @description 客户/成本账单
 */
export interface BillItem {
  billStatus: string;
  billType: string;
  billsDate: Date;
  billsMoney: number;
  billsNumber: string;
  clientCode: string;
  createBy: string;
  createTime: Date;
  delFlag: string;
  endBillsDate: string;
  id: number;
  startBillsDate: string;
  updateBy: string;
  updateTime: Date;
  version: number;
}
export type BillListGetResultModel = BasicFetchResult<BillItem>;
export type BillSearchParams = BasicPageParams & {
  billType: 1 | 2; // 账单类型 1 客户 2 成本
  clientCode?: string;
  serviceProviderCode?: string; // 服务商代码
  billsNumber?: string; // 账单号
  billStatus?: string; // 账单状态
  startBillsDate?: string; // 开始账单日期
  endBillsDate?: string;
};

export type BillSearchByCodeParams = {
  billType: 1 | 2; // 账单类型 1 客户 2 成本
  enterpriseRecordIds?: string;
  serviceProviderCodes?: string;
  startDate: string;
  endDate: string;
};
export interface BillSearchItem {
  actualAmount: number;
  clientCode: string;
  clientName: string;
  endDate: Date;
  enterpriseRecordId: string;
  orderBillsDetailVoList: any[];
  serviceProviderCode: string;
  startDate: string;
}

export type BillGenBillParams = {
  billType: 1 | 2; // 账单类型 1 客户 2 成本
  enterpriseRecordIds: string;
  serviceProviderCodes: string;
  startDate: string;
  endDate: string;
  billsDate: string;
};

export type BillChangeStatusParams = {
  billNumber: string; //账单号
  billStatus: string; // 1 确认 2 作废
};
