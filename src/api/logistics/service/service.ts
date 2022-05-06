import { tmsHttp } from '@/utils/http/axios';
import {
  OpServiceParams,
  ServiceListItem,
  ServiceListParams,
  ServiceListReturnType,
} from '@/api/logistics/service/model/ServiceModel';

enum Api {
  List = '/cspServiceProvider/list',
  AddService = '/cspServiceProvider/add',
  EditService = '/cspServiceProvider/edit',
  ChangeStatus = '/cspServiceProvider/changeStatus',
}

// 获取服务商列表
export const getServiceList = (params: ServiceListParams) =>
  tmsHttp.post<ServiceListReturnType>({ url: Api.List, params });

// 添加服务商
export const addService = (params: OpServiceParams) => tmsHttp.post<null>({ url: Api.AddService, params });

// 编辑服务商
export const editService = (params: OpServiceParams) => tmsHttp.post<null>({ url: Api.EditService, params });

// 编辑服务商
export const editServiceById = (params: { id: number }) =>
  tmsHttp.get<ServiceListItem>({
    url: `${Api.EditService}?id=${params.id}`,
  });

// 编辑服务商
export const changeServiceStatus = (id: number, status: string) =>
  tmsHttp.get<null>({
    url: `${Api.ChangeStatus}?id=${id}&status=${status}`,
  });
