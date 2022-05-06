import { tmsHttp } from '@/utils/http/axios';
import {
  ChannelListItem,
  ChannelListParams,
  ChannelListReturnType,
  OpChannelParams,
  OpChannelRuleParams,
  RuleListItem,
  ServiceSelectListItem,
} from '@/api/logistics/service/model/ChannelModel';
import { ServiceListItem } from '@/api/logistics/service/model/ServiceModel';

enum Api {
  List = '/cspServiceChannel/list',
  ServiceList = '/cspServiceProvider/selectList',
  ApiList = '/cspApiService/selectList',
  AddChannel = '/cspServiceChannel/add',
  EditChannel = '/cspServiceChannel/edit',
  ChangeStatus = '/cspServiceChannel/changeStatus',
  RuleList = '/costChannelsWeightRules/list',
  AddRule = '/costChannelsWeightRules/add',
  EditRule = '/costChannelsWeightRules/edit',
  ChangeRuleStatus = '/costChannelsWeightRules/changeStatus',
}

// 获取渠道列表
export const getChannelList = (params: ChannelListParams) =>
  tmsHttp.post<ChannelListReturnType>({ url: Api.List, params });

// 服务商列表
export const getServiceSelectList = () => tmsHttp.get<ServiceListItem[]>({ url: Api.ServiceList });

// API列表
export const loadApiList = (code: string | string[]) =>
  tmsHttp.get<ServiceSelectListItem[]>({ url: `${Api.ApiList}?serviceProviderCode=${code}` });

// 添加
export const addChannel = (params: OpChannelParams) => tmsHttp.post<null>({ url: Api.AddChannel, params });

// 编辑
export const editChannel = (params: OpChannelParams) => tmsHttp.post<null>({ url: Api.EditChannel, params });

// 编辑
export const editChannelById = (params: { id: string | string[] }) =>
  tmsHttp.get<ChannelListItem>({ url: `${Api.EditChannel}?id=${params.id}` });

// 改变状态
export const changeChannelStatus = (params: { id: number; status: string }) =>
  tmsHttp.get<ChannelListItem>({
    url: `${Api.ChangeStatus}?id=${params.id}&status=${params.status}`,
  });

// rulelist
export const getChannelRuleList = (params: { serviceChannelId: string | string[] }) =>
  tmsHttp.post<RuleListItem[]>({ url: Api.RuleList, params });

// 编辑
export const editChannelRule = (params: OpChannelRuleParams) => tmsHttp.post<null>({ url: `${Api.EditRule}`, params });

// 编辑
export const editChannelRuleById = (params: { id: number }) =>
  tmsHttp.get<RuleListItem>({ url: `${Api.EditRule}?id=${params.id}` });

// 添加
export const addChannelRule = (params: OpChannelRuleParams) => tmsHttp.post<null>({ url: `${Api.AddRule}`, params });

// 发布作废
export const changeChannelRuleStatus = (params: { id: number; status: number }) =>
  tmsHttp.get<null>({ url: `${Api.ChangeRuleStatus}?id=${params.id}&status=${params.status}` });
