/*
 * @Author: handsomeFu
 * @Date: 2021-12-02 11:32:29
 * @LastEditTime: 2021-12-23 18:39:58
 * @LastEditors: handsomeFu
 * @Description:
 */
/**
 * admin home
 */
export interface PriceItem {
  imgUrl: null | string;
  color: null | string;
  price: number;
  preMonth: number;
  isRecharge: boolean;
  title: string;
  preWeek: number;
}
export interface ClientItem {
  serviceRepresent?: string;
  enterpriseRecordId: string;
  sellRepresent?: string;
  clientCode: string;
  companyName: string;
  currentBalance: number;
}
export interface ServiceFinanceBarData {
  category: string[];
  outlayData: number[];
  incomeData: number[];
}
export type HomeListGetResultModel = {
  price: PriceItem[];
  clientList: ClientItem[];
};

export interface PieItem {
  name: string;
  value: number;
}
export type PieDataGetResultModel = {
  tab1: PieItem[];
  tab2: PieItem[];
  colors: Array<null | string>;
};

/**
 * client home
 */
export type ClientInfoGetResultModel = {
  customerPhone: string;
  sellName: string;
  fixedQuota: number;
  sellPhone: string;
  clientCode: string;
  currentQuota: number;
  companyName: string;
  currentBalance: number;
  customerName: string;
  customerQq: string;
  sellQq: string;
};
export interface ClientLineItem {
  num: number;
  day: string;
}
export type ClientPieDataGetResultModel = {
  tab1: PieItem[];
};

export interface MessageItem {
  clientCodes: string;
  compelStatus: string;
  createBy: string;
  createTime: string;
  delFlag: string;
  endTime: string;
  expires: boolean;
  fileName: string;
  fileUrl: string;
  haveRead: string;
  id: number;
  message: string;
  messageTitle: string;
  messageType: string;
  publicStatus: string;
  startTime: Date;
  updateBy: string;
  updateTime: null;

  isCompel: boolean;
  isExpire: boolean;
  isRead: boolean;
}
export type MessageDataGetResultModel = {
  count: number;
  list: MessageItem[];
};
