/*
 * @Author: c37csq
 * @Date: 2021-11-24 14:19:15
 * @LastEditTime: 2021-11-24 14:19:15
 * @LastEditors: c37csq
 * @Description:
 */
import { tmsHttp } from '@/utils/http/axios';
import {
  FuelListParams,
  FuelListReturnType,
  FuelOperateParams,
  LogListReturnType,
  PubListType,
  PubParams,
} from './model/fuelModel';

enum Api {
  List = '/sys/product/pgFuel/ratio',
  LogList = '/sys/product/pgFuel/ratio/log',
  ChangeFuelStatus = '/sys/product/pgFuel/ratio/state',
  Fuel = '/sys/product/pgFuel/ratio',
}

// 获取燃油费列表
export const getSearchList = (params: FuelListParams) => tmsHttp.get<FuelListReturnType>({ url: Api.List, params });

// 获取日志列表
export const getLogList = (params: { ratioId: number }) =>
  tmsHttp.get<LogListReturnType[]>({ url: Api.LogList, params });

// 作废
export const changeFuelStatus = (params: PubParams) =>
  tmsHttp.put<null>({
    url: `${Api.ChangeFuelStatus}?ratioId=${params.ratioId}&status=${params.status}`,
  });

// 发布
export const pubFuelStatus = (params: PubParams) =>
  tmsHttp.put<null>({
    url: `${Api.ChangeFuelStatus}?ratioId=${params.ratioId}&status=${params.status}&verify=${params.verify}`,
  });

// 发布列表
export const getPubList = (params: PubParams) =>
  tmsHttp.put<PubListType[]>({
    url: `${Api.ChangeFuelStatus}?ratioId=${params.ratioId}&status=${params.status}&verify=${params.verify}`,
  });

// 燃油费新增
export const AddFuel = (params: FuelOperateParams) => tmsHttp.post<FuelListReturnType>({ url: Api.Fuel, params });

// 燃油费编辑
export const EditFuel = (params: FuelOperateParams) => tmsHttp.put<FuelListReturnType>({ url: Api.Fuel, params });
