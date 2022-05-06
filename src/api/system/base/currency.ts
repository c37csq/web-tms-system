/**
 * Created By fzq on 2021/11/26 10:13
 */
import { tmsHttp } from '@/utils/http/axios';
import { CurrencyItem, CurrencyLogItem, CurrencyParams, CurrencySearchParams } from './model/baseModel';

enum Api {
  List = '/sys/basics/currency/list',
  Currency = '/sys/basics/currency',
  CurrencyLog = '/sys/basics/currency/list/log',
}

export const getCurrencyList = (params: CurrencySearchParams) => tmsHttp.get<CurrencyItem[]>({ url: Api.List, params });

export const addCurrency = (params: CurrencyParams) => tmsHttp.post({ url: Api.Currency, params });
export const updateCurrency = (params: CurrencyParams) => tmsHttp.put({ url: Api.Currency, params });
export const delCurrency = (currencyId: number) => tmsHttp.delete({ url: `${Api.Currency}/?currencyId=${currencyId}` });

export const getCurrencyLogList = (currencyId: number) =>
  tmsHttp.get<CurrencyLogItem[]>({ url: Api.CurrencyLog, params: { currencyId } });
