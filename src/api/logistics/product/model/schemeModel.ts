import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export type SchemeListParams = {
  schemeCode: string; // 分区方案编号
  schemeName: string; // 分区方案名称
  teamId: string;
  status: string;
} & BasicPageParams;

export type SchemeListItem = {
  schemeId: number;
  schemeName: string;
  schemeCode: string;
  teamId: number;
  startZipCode: string;
  endZipCode: string;
  status: string;
  delFlag: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  productLabel: string;
};

export type SchemeOpParams = {
  teamId: string; // 产品组id
  schemeCode: string; // 分区方案编号
  schemeName: string; // 分区方案名称
  startZipCode: string; // 起始邮编
  endZipCode: string; // 结束邮编
  schemeId?: number;
};

export type SchemeStatusParams = {
  schemeId: number;
  status: number;
};

export type SchemeDetailListItem = {
  createBy: string;
  zoningId: number;
  zoningName: string;
  zoningCode: string;
  schemeId: number;
  delFlag: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
};

export type StateType = {
  stateId: number;
  stateShortName: string;
  stateName: string;
  stateNameEn: string;
  zoningId: number;
  delFlag: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  schemeId: number;
};

export type ChargeType = {
  chargePartitionId: number;
  startZipCode: string;
  endZipCode: string;
  stateId: number;
  delFlag: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  schemeId: number;
  zoningId: number;
};

export type ZoningDataType = {
  pgPartitioningStates: StateType[];
  pgChargePartitions: ChargeType[];
};

export type CountryParams = {
  stateShortName: string; // 分区国家简称
  stateName: string; // 中文名称
  stateNameEn: string; // 英文名称
  zoningId: number;
  schemeId: number;
};

export type PostParams = {
  startZipCode: string;
  endZipCode: string;
  stateId: string;
  zoningId: number;
  schemeId: number;
};

export type SchemeListReturnType = BasicFetchResult<SchemeListItem>;
