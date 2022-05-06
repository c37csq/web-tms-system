import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export type ApiListParams = {
  apiServiceCode: string;
  apiServiceName: string;
  serviceProviderCode: any;
} & BasicPageParams;

export type OpApiParams = {
  serviceProviderCode: string; // 服务商编号
  apiServiceName: string; // 服务名称
  apiServiceCode: string; // 服务编号
  apiServiceId?: number;
};

export type ApiListItem = {
  apiServiceCode: string;
  apiServiceId: number;
  apiServiceName: string;
  createBy: string;
  createTime: string;
  delFlag: string;
  serviceProviderCode: string;
  updateBy: string;
  updateTime: string;
};

export type OpInfoType = {
  warehouseCode: string; // 仓库编号
  apiServiceAddress: string; // 服务地址
  trackingNumber: string; // 跟踪号(0不返回，1返回)
  tag: string; // 标签（0不包含，1包含）
  account: string; // 账号
  password: string; // 密码
  apiAddress: string; // api地址
  apiServiceId?: number;
  apiServiceDetailId?: number;
};

export type InfoListItem = {
  apiServiceDetailId: number;
  apiServiceId: number;
  warehouseCode: string;
  apiServiceAddress: string;
  trackingNumber: string;
  tag: string;
  account: string;
  password: string;
  apiAddress: string;
  delFlag: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
};

export type ApiListReturnType = BasicFetchResult<ApiListItem>;
