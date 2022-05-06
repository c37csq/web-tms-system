import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export type SaleListParams = {
  enterpriseRecordId: string;
  amountType?: string;
  externalno?: string;
  expenseType?: string;
  createStartTime?: string;
  createEndTime?: string;
} & BasicPageParams;

export type SaleListItem = {
  accountBalance: number;
  actualAmount: number;
  amountType: string;
  clientCode: string;
  clientName: string;
  createBy: string;
  createTime: string;
  delFlag: string;
  enterpriseRecordId: string;
  expenseType: string;
  externalno: string;
  frozenAmount: string;
  id: number;
  trackingNo: string;
  updateBy: string;
  updateTime: string;
};

export type SaleListReturnType = BasicFetchResult<SaleListItem>;
