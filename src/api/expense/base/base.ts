/*
 * @Author: handsomeFu
 * @Date: 2021-11-26 16:32:17
 * @LastEditTime: 2021-12-23 18:39:10
 * @LastEditors: handsomeFu
 * @Description:
 */
import { tmsHttp } from '@/utils/http/axios';

import {
  ExpenseTypePageGetResultModel,
  ExpenseTypeParams,
  ExpenseTypeSearchParams,
  ExtraServicePageGetResultModel,
  ExtraServiceParams,
  ExtraServiceSearchParams,
} from '@/api/expense';

enum Api {
  ExpenseType = '/sysCostFeeType',
  ExtraService = '/sysCostExtraServiceType',
}

export const getExpenseTypeByPage = (params: ExpenseTypeSearchParams) =>
  tmsHttp.get<ExpenseTypePageGetResultModel>({ url: Api.ExpenseType, params });
export const addExpenseType = (params: ExpenseTypeParams) => tmsHttp.post({ url: Api.ExpenseType, params });
export const updateExpenseType = (params: ExpenseTypeParams) => tmsHttp.put({ url: Api.ExpenseType, params });
export const delExpenseType = (params: number[]) => tmsHttp.delete({ url: Api.ExpenseType, params });

export const getExtraServiceListByPage = (params: ExtraServiceSearchParams) =>
  tmsHttp.get<ExtraServicePageGetResultModel>({ url: Api.ExtraService, params });

export const addExtraService = (params: ExtraServiceParams) => tmsHttp.post({ url: Api.ExtraService, params });
export const updateExtraService = (params: ExtraServiceParams) => tmsHttp.put({ url: Api.ExtraService, params });
export const delExtraService = (params: number[]) => tmsHttp.delete({ url: Api.ExtraService, params });
