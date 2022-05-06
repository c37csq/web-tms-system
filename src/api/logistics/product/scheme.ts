/*
 * @Author: c37csq
 * @Date: 2021-11-26 14:27:15
 * @LastEditTime: 2021-11-26 14:27:15
 * @LastEditors: c37csq
 * @Description:
 */
import { tmsHttp, blobFileHttp } from '@/utils/http/axios';
import {
  ChargeType,
  CountryParams,
  PostParams,
  SchemeDetailListItem,
  SchemeListItem,
  SchemeListParams,
  SchemeListReturnType,
  SchemeOpParams,
  SchemeStatusParams,
  ZoningDataType,
} from '@/api/logistics/product/model/schemeModel';

enum Api {
  List = '/sys/product/partitioning/scheme/list',
  OpScheme = '/sys/product/partitioning/scheme',
  ChangeSchemeStatus = '/sys/product/partitioning/scheme/state',
  SchemeDetail = '/sys/product/partitioning/scheme',
  CodeList = '/sys/product/partitioning/zoning/code',
  ZoningData = '/sys/product/State/zoning/code',
  PostCodeByCountry = '/sys/product/charge/partition',
  ExportScheme = '/sys/product/export/charge/partitions',
  OpCountry = '/sys/product/partitioning/state',
  OpPostCode = '/sys/product/charge/partition',
}

// 获取分区方案列表
export const getSchemeList = (params: SchemeListParams) => tmsHttp.get<SchemeListReturnType>({ url: Api.List, params });

// 编辑分区方案
export const editScheme = (params: SchemeOpParams) => tmsHttp.put<null>({ url: Api.OpScheme, params });

// 编辑分区方案
export const addScheme = (params: SchemeOpParams) => tmsHttp.post<null>({ url: Api.OpScheme, params });

// 发布作废
export const changeSchemeStatus = (params: SchemeStatusParams) =>
  tmsHttp.put<null>({
    url: `${Api.ChangeSchemeStatus}?schemeId=${params.schemeId}&status=${params.status}`,
  });

export const getSchemeDetail = (schemeId: number) =>
  tmsHttp.get<SchemeListItem>({ url: `${Api.SchemeDetail}?schemeId=${schemeId}` });

export const zoningCodeList = (schemeId: number) =>
  tmsHttp.get<SchemeDetailListItem[]>({ url: `${Api.CodeList}?schemeId=${schemeId}` });

export const getZoningData = (zoningId: number) =>
  tmsHttp.get<ZoningDataType>({ url: `${Api.ZoningData}?zoningId=${zoningId}` });

export const postcodeByCountry = (stateId: number) =>
  tmsHttp.get<ChargeType[]>({ url: `${Api.PostCodeByCountry}?stateId=${stateId}` });

export const exportScheme = (params: { schemeId: number }) => blobFileHttp.get({ url: Api.ExportScheme, params });

export const addCountry = (params: CountryParams) => tmsHttp.post<null>({ url: Api.OpCountry, params });

export const delCountry = (params: number[]) => tmsHttp.delete<null>({ url: Api.OpCountry, params });

export const addPost = (params: PostParams) => tmsHttp.post<null>({ url: Api.OpPostCode, params });

export const delPost = (params: number[]) => tmsHttp.delete<null>({ url: Api.OpPostCode, params });
