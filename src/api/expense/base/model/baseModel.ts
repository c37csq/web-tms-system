/*
 * @Author: handsomeFu
 * @Date: 2021-11-26 15:37:36
 * @LastEditTime: 2021-12-23 18:39:24
 * @LastEditors: handsomeFu
 * @Description:
 */
import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

/**
 * @description 费用类型管理
 */
export interface ExpenseTypeItem {
  createBy: string;
  createTime: Date | null;
  delFlag: string;
  feeCode: string;
  feeId: number;
  feeNameCn: string;
  feeNameEn: string;
  feeNote: string;
  updateBy: string;
  updateTime: null;
}
export type ExpenseTypeSearchParams = BasicPageParams & {
  feeCode?: string; // 费用类型代码
  feeNameCn?: string; // 费用类型名称中文名称
  feeNameEn?: string; // 费用类型名称英文名称
};
export type ExpenseTypeParams = {
  feeId?: number;
  feeCode: string;
  feeNameCn: string;
};
export type ExpenseTypePageGetResultModel = BasicFetchResult<ExpenseTypeItem>;

/**
 * @description 额外服务管理
 */
export interface ExtraServiceItem {
  createBy: string;
  createTime: Date | null;
  delFlag: string;
  extraServiceCode: string;
  extraServiceId: number;
  extraServiceNameCn: string;
  extraServiceNameEn: string;
  extraServiceNote: string;
  updateBy: string;
  updateTime: null;
}
export type ExtraServiceSearchParams = BasicPageParams & {
  extraServiceCode?: string; // 额外服务编号
  extraServiceNameCn?: string; // 额外服务名字
};
export type ExtraServiceParams = {
  extraServiceId?: number;
  extraServiceCode: string;
  extraServiceNameCn: string;
};
export type ExtraServicePageGetResultModel = BasicFetchResult<ExtraServiceItem>;
