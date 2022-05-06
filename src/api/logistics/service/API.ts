import { tmsHttp } from '@/utils/http/axios';
import {
  ApiListItem,
  ApiListParams,
  ApiListReturnType,
  InfoListItem,
  OpApiParams,
  OpInfoType,
} from '@/api/logistics/service/model/ApiModel';

enum Api {
  List = '/cspApiService/list',
  EditApi = '/cspApiService/edit',
  AddApi = '/cspApiService/add',
  AddInfo = '/cspApiServiceDetail/add',
  EditInfo = '/cspApiServiceDetail/edit',
  InfoList = '/cspApiServiceDetail/list',
  DelInfo = '/cspApiServiceDetail/delete',
}

// 获取API列表
export const getAPIList = (params: ApiListParams) => tmsHttp.post<ApiListReturnType>({ url: Api.List, params });

// 添加API
export const addAPI = (params: OpApiParams) => tmsHttp.post<null>({ url: Api.AddApi, params });

// 编辑API
export const editAPI = (params: OpApiParams) => tmsHttp.post<null>({ url: Api.EditApi, params });

// 编辑API
export const editById = (params: { id: number }) => tmsHttp.get<ApiListItem>({ url: `${Api.EditApi}?id=${params.id}` });

// 添加
export const addInfo = (params: OpInfoType) => tmsHttp.post<null>({ url: Api.AddInfo, params });

// 编辑
export const editInfo = (params: OpInfoType) => tmsHttp.post<null>({ url: Api.EditInfo, params });

// infoList
export const getInfoList = (params: { apiServiceId: number }) =>
  tmsHttp.post<InfoListItem[]>({ url: Api.InfoList, params });

// 编辑
export const editInfoById = (params: { id: number }) =>
  tmsHttp.get<InfoListItem>({ url: `${Api.EditInfo}?id=${params.id}` });

// 删除
export const delInfo = (params: { id: number }) => tmsHttp.get<null>({ url: `${Api.DelInfo}?id=${params.id}` });
