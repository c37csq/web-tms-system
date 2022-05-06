import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export type ServiceBaseListParams = {
  objectCode: string;
  settlementObject: number;
  moneyStart: string;
  moneyEnd: string;
  createTimeStart: string;
  createTimeEnd: string;
  transactionStatus?: string;
} & BasicPageParams;

export type ServiceBaseListItem = {
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

export type BankListItem = {
  bankAccount: string;
  bankId: number;
  bankName: string;
  createBy: string;
  createTime: string;
  currency: string;
  updateBy: string;
  updateTime: string;
};

export type ServiceEntry = {
  settlementObject: number;
  objectCode: string;
  objectName: string;
  companyName: string;
  accountBalance: number;
  currency: string;
  accountFrozen: string;
};

export type OpParams = {
  accountBalance: string; // 账户余额
  companyName: string; // 公司名称
  currency: string; // 币种
  objectCode: string; // 对象代码
  objectName: string; // 对象名称
  settlementObject: string;
  dealType: string; // 交易类型
  bankName: string; // 银行名称
  bankAccount: string; // 银行账号
  money: string; // 金额
  paymentDate: string; // 付款日期
  invoiceNumber: string; // 发票号
  transactionNumber: string; // 交易号 //客户才有
  submitRemark: string; // 备注
  accessoryUrl?: string; // 附件地址
  pictureUrl?: string; // 图片地址
};

export type ServiceBaseListReturnType = BasicFetchResult<ServiceBaseListItem>;
