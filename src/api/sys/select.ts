/**
 * Created By fzq on 2021/11/23 10:30
 */
/*
 * @Author: handsomeFu
 * @Date: 2021-08-31 10:55:11
 * @LastEditTime: 2021-09-16 11:15:06
 * @LastEditors: Please set LastEditors
 * @Description: 下拉数据相关接口
 */
import { tmsHttp } from '@/utils/http/axios';

import {
  CountryItem,
  WarehouseItem,
  ExtraServiceItem,
  ServiceChannelItem,
  SaleProductItem,
  ProductTeamItem,
  FeeTypeItem,
  OdaItem,
  PartitionSchemeItem,
  PartitionItem,
  SelectUserByRoleIdItem,
  ClientItem,
  ExpressItem,
  UserItem,
  EntryClientItem,
  CurrencyItem,
  DictOptionItem,
  ServiceItem,
} from './model/selectModel';
import { EnterpriseListItem } from '@/api/system';

enum Api {
  EnterpriseList = '/admin/system/enterprise/enterprisesForUser', // 客户/企业列表
  CountryList = '/sys/list/state/list', // 国家下拉列表
  WarehouseList = '/sys/list/warehouse/list', // 仓库下拉列表
  ExtraServiceList = '/sys/list/extraService/list', // 额外服务下拉列表
  ServiceChannelList = '/sys/list/serviceChannelServiceByData/list', // 服务商渠道下拉列表
  SaleProductList = '/sys/list/sellPromotingProductsByData/list', // 销售产品数据下拉列表
  ProductTeamList = '/sys/list/product/team/list', // 产品组下拉查询
  FeeTypeList = '/sys/list/sysCostFeeType/list', // 费用类型下拉查询
  OdaList = '/sys/list/oda/rules/list', // ODA下拉查询
  PartitionSchemeList = '/sys/list/partitioning/scheme/list', // 分区方案列表
  PartitionList = '/sys/list/zongCode/list', // 分区下拉
  SelectUserByRoleIdList = '/sys/list/sell/id', // 根据角色ID查询列表
  ClientList = '/sys/list/client/codes', // 客户下拉列表
  ExpressList = '/sys/list/operatorInfo', // 快递公司查询下拉
  UserList = '/sys/list/user/list', // 总公司用户查询
  EntryClientList = '/sys/list/client/infos', // 企业代码下拉选
  CurrencyList = '/sys/basics/currency/list', // 币种列表
  DictDataByType = '/admin/system/dict/getDictByType', // 字典维护的下拉接口
  ServiceList = '/cspServiceProvider/selectList',
}

/**
 * @description 客户/企业下拉
 */
export const getEnterpriseList = () => tmsHttp.get<EnterpriseListItem[]>({ url: Api.EnterpriseList });

/**
 * @description 国家下拉
 */
export const getCountryList = () => tmsHttp.get<CountryItem[]>({ url: Api.CountryList });

/**
 * @description 仓库下拉
 */
export const getWarehouseList = () => tmsHttp.get<WarehouseItem[]>({ url: Api.WarehouseList });

/**
 * @description 额外服务下拉
 */
export const getExtraServiceList = () => tmsHttp.get<ExtraServiceItem[]>({ url: Api.ExtraServiceList });

/**
 * @description 服务渠道下拉
 */
export const getServiceChannelList = (serviceProviderCode?: string) =>
  tmsHttp.get<ServiceChannelItem[]>({
    url: Api.ServiceChannelList,
    params: { serviceProviderCode },
  });

/**
 * @description 销售产品数据下拉列表
 */
export const getSaleProductList = () => tmsHttp.get<SaleProductItem[]>({ url: Api.SaleProductList });

/**
 * @description 产品组下拉列表
 * @param teamName 产品name
 */
export const getProductTeamList = (teamName: string) =>
  tmsHttp.get<ProductTeamItem[]>({ url: Api.ProductTeamList, params: { teamName } });

/**
 * @description 费用类型下拉列表
 */
export const getFeeTypeList = () => tmsHttp.get<FeeTypeItem[]>({ url: Api.FeeTypeList });

/**
 * @description oda下拉列表
 */
export const getOdaList = () => tmsHttp.get<OdaItem[]>({ url: Api.OdaList });

/**
 * @description 分区方案下拉列表
 * @param teamCode 产品组代码
 * @param warehouseCode 仓库代码
 */
export const getPartitionSchemeList = (teamCode: string, warehouseCode?: string) =>
  tmsHttp.get<PartitionSchemeItem[]>({
    url: Api.PartitionSchemeList,
    params: { teamCode, warehouseCode },
  });

/**
 * @description 分区下拉列表
 * @param teamCode
 */
export const getPartitionList = (teamCode: string) =>
  tmsHttp.get<PartitionItem[]>({ url: Api.PartitionList, params: { teamCode } });

/**
 * @description 根据角色ID查询用户列表
 * @param roleId
 */
export const getSelectUserByRoleId = (roleId: string) =>
  tmsHttp.get<SelectUserByRoleIdItem[]>({ url: Api.SelectUserByRoleIdList, params: { roleId } });

/**
 * @description 客户代码列表
 */
export const getClientList = () => tmsHttp.get<ClientItem[]>({ url: Api.ClientList }, { errorMessageMode: 'none' });

/**
 * @description 快递公司查询下拉
 */
export const getExpressList = () => tmsHttp.get<ExpressItem[]>({ url: Api.ExpressList });

/**
 * @description 总公司用户查询
 */
export const getUserList = () => tmsHttp.get<UserItem[]>({ url: Api.UserList });

/**
 * 企业代码下拉选(客户/服务商)
 * @param settlementObject 客户1 服务商2
 */
export const getEntryClientList = (settlementObject: 1 | 2) =>
  tmsHttp.get<EntryClientItem[]>({ url: Api.EntryClientList, params: { settlementObject } });

/**
 * 币种列表
 * @param currencyStatus 0启用1未启用
 */
export const getCurrencyList = (currencyStatus = 0) =>
  tmsHttp.get<CurrencyItem[]>({ url: Api.CurrencyList, params: { currencyStatus } });

/**
 * 获取字典下拉列表
 * @param type
 */
export const getSelectDataByType = (type: string) =>
  tmsHttp.get<DictOptionItem[]>({ url: Api.DictDataByType, params: { type } });

/**
 * @description 服务商列表
 */
export const getServiceList = () => tmsHttp.get<ServiceItem[]>({ url: Api.ServiceList });
