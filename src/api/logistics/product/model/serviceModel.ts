import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export type serviceListItem = {
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
};

export type ServiceParams = {
  teamCode: string;
  teamName: string;
  operatorName: string;
};

export type ZoneListType = {
  zoningId: number;
  zoningName: string;
  zoningCode: string;
};

export type ZoneOpParams = {
  zoningCode?: string;
  teamId?: string;
  zoningName?: string;
  zoningId?: string;
};

export type WeightOpParams = {
  startWeight: string;
  endWeight: string;
  chargingWeight: string;
  teamId: string;
  weightId: string;
};

export type WeightListParams = {
  teamId: string;
} & BasicPageParams;

export type WeightListItem = {
  weightId: number;
  endWeight: number;
  chargingWeight: number;
};

export type RuleListItemType = {
  specialRulesId: number;
  teamId: number;
  extraService: number;
  orderType: number;
  constraintFormulas: string;
  addOperating: number;
  responseMsg: string;
  orderNo: number;
  status: number;
  effectiveState: number;
  startTime: string;
  endTime: string;
  delFlag: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  extraServiceLabel?: string;
  orderTypeLabel?: string;
  extraOperateLabel?: string;
};

export type RuleOpParams = {
  extraService: string; // 额外服务类型
  orderType: string; // 订单类型（0按件，1按票）
  constraintFormulas: string; // 约束公式
  addOperating: string; // 额外操作（0扣件收费，1禁止发货）
  orderNo: string; // 权重
  dateRange: string; // 日期
  defaultTime: any;
  startTime: string; // 生效时间
  endTime: string; // 结束时间
  responseMsg: string; // 备注
  teamId?: string;
  specialRulesId?: string;
};

export type RuleStatus = {
  specialRulesId: number;
  state: number;
  verify?: number;
};

export type ChannelListParamsType = {
  teamCode: any;
} & BasicPageParams;

export type ChannelListItem = {
  serviceChannelId: number;
  serviceProviderCode: string;
  serviceChannelCode: string;
  apiCode: string;
  warehouseCode: string;
  teamCode: string;
  signature: string;
  insurance: string;
  trackable: string;
  chargedWeight: string;
  verifyRemote: string;
  status: string;
  delFlag: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
};

export type ProductListParamsType = {
  teamCode: any;
} & BasicPageParams;

export type WeightListType = BasicFetchResult<WeightListItem>;

export type ServiceListReturnType = BasicFetchResult<serviceListItem>;

export type ChannelListReturnType = BasicFetchResult<ChannelListItem>;
