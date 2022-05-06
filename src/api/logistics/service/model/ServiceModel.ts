import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export type ServiceListParams = {
  status: string;
  serviceProviderCode: string;
  serviceProviderName: string;
} & BasicPageParams;

export type ServiceListItem = {
  serviceProviderId: number;
  serviceProviderName: string;
  serviceProviderCode: string;
  apiServiceCode: string;
  status: string;
  delFlag: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  isActive?: boolean;
  version?: number;
  serviceProblemBack?: string;
};

export type OpServiceParams = {
  serviceProviderCode: string; // 服务商编号
  serviceProviderName: string; // 服务商名称
  serviceProblemBack: string;
  apiServiceCode: string; // 服务编号
  version: string;
  serviceProviderId?: number;
};

export type ServiceListReturnType = BasicFetchResult<ServiceListItem>;
