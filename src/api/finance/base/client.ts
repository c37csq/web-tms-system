import { tmsHttp } from '@/utils/http/axios';
import { ClientBaseListParams, ClientBaseListReturnType } from '@/api/finance/base/model/clientModel';

enum Api {
  List = '/sys/remittance/recorded/list',
  Del = '/sys/remittance/recorded/cancellation',
  Entry = '/sys/remittance/affirm/recorded',
}

// 获取列表
export const getClientBaseList = (params: ClientBaseListParams) =>
  tmsHttp.get<ClientBaseListReturnType>({
    url: `${Api.List}?pageNum=${params.pageNum}&pageSize=${params.pageSize}&settlementObject=${
      params.settlementObject
    }&objectCode=${params.objectCode}&createTimeStart=${params.createTimeStart}&createTimeEnd=${
      params.createTimeEnd
    }&moneyStart=${params.moneyStart}&moneyEnd=${params.moneyEnd}&transactionStatus=${params.transactionStatus || ''}`,
  });

export const entryInvalidate = (id: number) =>
  tmsHttp.delete({
    url: `${Api.Del}?id=${id}`,
  });

export const entryReview = (params: { id: number; practicalMoney: string; leaveWord: string; affirmRemark: string }) =>
  tmsHttp.put({
    url: `${Api.Entry}`,
    params,
  });
