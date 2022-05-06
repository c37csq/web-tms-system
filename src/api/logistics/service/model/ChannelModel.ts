import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export type ChannelListParams = {
  status: string;
  serviceProviderCode: any;
  serviceChannelCode: string;
  teamCode: string;
} & BasicPageParams;

export type ChannelListItem = {
  serviceChannelId: number;
  serviceChannelCode: string;
  serviceProviderCode: string;
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
  isActive?: boolean;
  apiServiceCode?: string;
  startWeightRange?: string;
  endWeightRange?: string;
};

export type ServiceSelectListItem = {
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

export type OpChannelParams = {
  serviceProviderCode: string; // 服务商编号
  serviceChannelCode: string; // 服务渠道编号
  apiCode: string; // api服务渠道代码
  apiServiceCode: string; // api 服务代码
  warehouseCodeList: string[]; // 变量存储
  warehouseCode: string; // 仓库编号 // 可多选
  teamCode: string; // 产品组编号
  verifyRemote: string; // oda编号
  signature: string; // 签名服务(0否，1成年2未成年)
  insurance: string; // 保险服务(0否，1是)
  startWeightRange: string; // 起始重量
  endWeightRange: string; // 结束重量
  serviceChannelId?: number;
};

export type RuleListItem = {
  weightRulesId: number;
  serviceChannelId: number;
  volumeFactor: string;
  conditionExpression: string;
  weightExpression: string;
  status: string;
  effectiveState: string;
  startTime: string;
  endTime: string;
  delFlag: string;
  sort: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  weightRulesName: string;
};

export type OpChannelRuleParams = {
  serviceChannelId: any;
  weightRulesId?: number;
  weightRulesName: string; // 计费重名字
  volumeFactor: string; // 体积系数
  conditionExpression: string; // 条件表达式
  weightExpression: string; // 重量表达式
  sort: string; // 排序  优先级排序 越大越优先
  startTime: string;
  endTime: string;
  dateRange: any;
};

export type ChannelListReturnType = BasicFetchResult<ChannelListItem>;
