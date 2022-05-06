import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export type CostListParams = {
  serviceProviderId: string;
  externalno: string;
  amountType: string;
  expenseType: string;
  createStartTime: string;
  createEndTime: string;
} & BasicPageParams;

export type CostListItem = {
  accountBalance: number;
  actualAmount: number;
  amountType: string;
  createBy: string;
  createTime: string;
  delFlag: string;
  expenseType: string;
  externalno: string;
  id: number;
  remark: string;
  serviceProviderId: number;
  serviceProviderName: string;
  trackingNo: string;
  updateBy: string;
  updateTime: string;
};

export type CostListReturnType = BasicFetchResult<CostListItem>;
