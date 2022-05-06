import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export type ClientBaseListParams = {
  objectCode: string;
  settlementObject: number;
  moneyStart: string;
  moneyEnd: string;
  createTimeStart: string;
  createTimeEnd: string;
  transactionStatus?: string;
} & BasicPageParams;

export type ClientBaseListItem = {
  accessoryUrl: string;
  accountBalance: number;
  affirmCurrency: string;
  affirmPracticalMoney: number;
  affirmRemark: string;
  bankAccount: string;
  bankName: string;
  companyName: string;
  createBy: string;
  createTime: string;
  currency: string;
  dealType: number;
  id: number;
  invoiceNumber: string;
  leaveWord: string;
  money: number;
  objectCode: string;
  objectName: string;
  paymentDate: string;
  pictureUrl: string;
  practicalMoney: string;
  serialNumber: string;
  settlementObject: string;
  submitRemark: string;
  transactionNumber: string;
  transactionStatus: string;
  updateBy: string;
  updateTime: string;
  version: number;
};

export type ClientBaseListReturnType = BasicFetchResult<ClientBaseListItem>;
