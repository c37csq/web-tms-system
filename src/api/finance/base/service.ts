import { tmsHttp } from '@/utils/http/axios';
import {
  BankListItem,
  OpParams,
  ServiceBaseListParams,
  ServiceBaseListReturnType,
  ServiceEntry,
} from '@/api/finance/base/model/serviceModel';
import { json2form } from '@/utils/tools';

enum Api {
  List = '/sys/remittance/recorded/list',
  BankList = '/sys/remittance/bank/info',
  EntryInfo = '/sys/list/payment/info',
  OpEntry = '/sys/remittance/recorded',
}

// 获取列表
export const getServiceBaseList = (params: ServiceBaseListParams) =>
  tmsHttp.get<ServiceBaseListReturnType>({
    url: `${Api.List}?pageNum=${params.pageNum}&pageSize=${params.pageSize}&settlementObject=${
      params.settlementObject
    }&objectCode=${params.objectCode}&createTimeStart=${params.createTimeStart}&createTimeEnd=${
      params.createTimeEnd
    }&moneyStart=${params.moneyStart}&moneyEnd=${params.moneyEnd}&transactionStatus=${params.transactionStatus || ''}`,
  });

// 收款银行查询
export const getBankList = () => tmsHttp.get<BankListItem[]>({ url: Api.BankList });

/**
 * 入账基础信息查询(客户,服务商)
 * @param objectCode 客户或服务商代码
 * @param settlementObject 1客户 2服务商
 */
export const clientBaseInfo = (objectCode: string, settlementObject: 1 | 2) =>
  tmsHttp.get<ServiceEntry>({ url: Api.EntryInfo, params: { objectCode, settlementObject } });

// 收款银行查询
export const entryOperate = (params: OpParams) => tmsHttp.post<null>({ url: Api.OpEntry, params: json2form(params) });
