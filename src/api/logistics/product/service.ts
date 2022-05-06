/*
 * @Author: c37csq
 * @Date: 2021-11-25 14:01:15
 * @LastEditTime: 2021-11-25 14:01:15
 * @LastEditors: c37csq
 * @Description:
 */
import { tmsHttp } from '@/utils/http/axios';
import { BasicPageParams } from '@/api/model/baseModel';
import {
  ChannelListParamsType,
  ChannelListReturnType,
  ProductListParamsType,
  RuleListItemType,
  RuleOpParams,
  RuleStatus,
  ServiceListReturnType,
  ServiceParams,
  WeightListParams,
  WeightListType,
  WeightOpParams,
  ZoneListType,
  ZoneOpParams,
} from '@/api/logistics/product/model/serviceModel';
import { PubListType } from '@/api/logistics/product/model/fuelModel';
import { LogisticsListReturnType } from '@/api/logistics/sale-product/model/saleProductModel';

enum Api {
  List = '/sys/product/team/list',
  OperateService = '/sys/product/team',
  ZoneList = '/sys/product/zone/code/list',
  ZoneOp = '/sys/product/zone/code',
  WeightList = '/sys/product/weight/temps/list',
  WeightOp = '/sys/product/weight/temp',
  RuleList = '/sys/product/special/rules/',
  OpRule = '/sys/product/special/rules',
  RuleStatus = '/sys/product/special/rules/',
  ChannelList = '/cspServiceChannel/list',
  SaleProductList = '/sellPromotingProducts/list',
}

// 获取服务商列表
export const getServiceList = (params: BasicPageParams) =>
  tmsHttp.get<ServiceListReturnType>({ url: Api.List, params });

// 新增服务商
export const addService = (params: ServiceParams) => tmsHttp.post<null>({ url: Api.OperateService, params });

// 编辑服务商
export const editService = (params: ServiceParams) => tmsHttp.put<null>({ url: Api.OperateService, params });

// 删除服务商
export const delService = (params: { teamId: number }) =>
  tmsHttp.delete<null>({ url: `${Api.OperateService}?teamId=${params.teamId}` });

// 分区代码列表
export const getZoneList = (teamId: string) => tmsHttp.get<ZoneListType[]>({ url: `${Api.ZoneList}?teamId=${teamId}` });

// 添加分区代码
export const addZone = (params: ZoneOpParams) => tmsHttp.post<null>({ url: Api.ZoneOp, params });

// 编辑分区代码
export const editZone = (params: ZoneOpParams) => tmsHttp.put<null>({ url: Api.ZoneOp, params });

// 删除分区代码
export const delZone = (params: string) => tmsHttp.delete<null>({ url: `${Api.ZoneOp}?zoningId=${params}` });

// 获取重量段列表
export const getWeightList = (params: WeightListParams) => tmsHttp.get<WeightListType>({ url: Api.WeightList, params });

// 添加重量段
export const addWeight = (params: WeightOpParams) => tmsHttp.post<null>({ url: Api.WeightOp, params });

// 编辑重量段
export const editWeight = (params: WeightOpParams) => tmsHttp.put<null>({ url: Api.WeightOp, params });

// 删除重量段
export const delWeight = (params: string) => tmsHttp.delete<null>({ url: `${Api.WeightOp}?weightId=${params}` });

// 获取特殊规则列表
export const getRuleList = (params: string) =>
  tmsHttp.get<RuleListItemType[]>({ url: `${Api.RuleList}?teamId=${params}` });

// 添加特殊规则
export const addRule = (params: RuleOpParams) => tmsHttp.post<null>({ url: Api.OpRule, params });

// 编辑特殊规则
export const editRule = (params: RuleOpParams) => tmsHttp.put<null>({ url: Api.OpRule, params });

// 发布特殊规则
export const pubRule = (params: RuleStatus) =>
  tmsHttp.put<null>({
    url: `${Api.RuleStatus}?specialRulesId=${params.specialRulesId}&state=${params.state}&verify=${params.verify}`,
    params,
  });

// 获取特殊规则发布列表
export const getRulePubList = (params: RuleStatus) =>
  tmsHttp.put<PubListType[]>({
    url: `${Api.RuleStatus}?specialRulesId=${params.specialRulesId}&state=${params.state}&verify=${params.verify}`,
  });

// 作废特殊规则
export const delRule = (params: RuleStatus) =>
  tmsHttp.put<null>({
    url: `${Api.RuleStatus}?specialRulesId=${params.specialRulesId}&state=${params.state}`,
    params,
  });

// 获取特殊规则发布列表
export const getChannelList = (params: ChannelListParamsType) =>
  tmsHttp.post<ChannelListReturnType>({
    url: `${Api.ChannelList}`,
    params,
  });

// 获取销售产品列表
export const getSaleProductList = (params: ProductListParamsType) =>
  tmsHttp.post<LogisticsListReturnType>({
    url: `${Api.SaleProductList}`,
    params,
  });
