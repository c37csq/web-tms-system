/**
 * Created By fzq on 2021/11/23 10:26
 */
import { tmsHttp } from '@/utils/http/axios';
import { BankSearchParams, BankPageListGetResultModel, BankParams } from './model/baseModel';

enum Api {
  List = '/sys/basics/bank/list',
  Bank = '/sys/basics/bank', // 银行操作 post 新增 put 修改 delete 废弃
}

export const getBankListByPage = (params: BankSearchParams) =>
  tmsHttp.get<BankPageListGetResultModel>({ url: Api.List, params });

export const addBank = (params: BankParams) => tmsHttp.post({ url: Api.Bank, params });
export const updateBank = (params: BankParams) => tmsHttp.put({ url: Api.Bank, params });
export const delBank = (bankId: number) => tmsHttp.delete({ url: `${Api.Bank}?bankId=${bankId}` });
