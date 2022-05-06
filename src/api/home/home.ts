/*
 * @Author: handsomeFu
 * @Date: 2021-12-02 11:32:38
 * @LastEditTime: 2021-12-23 18:39:43
 * @LastEditors: handsomeFu
 * @Description:
 */
import { tmsHttp } from '@/utils/http/axios';
import {
  ClientLineItem,
  ClientInfoGetResultModel,
  ClientPieDataGetResultModel,
  HomeListGetResultModel,
  PieDataGetResultModel,
  MessageDataGetResultModel,
  ServiceFinanceBarData,
} from '@/api/home/model/homeModel';

enum Api {
  List = '/homeStatistics/homeOneList', // top 首页上下列表数据
  PieData = '/homeStatistics/orderStatistics', // top 首页上下饼图数据
  ClientInfo = '/homeStatistics/client/info',
  ClientPieData = '/homeStatistics/client/orderStatistics',
  ClientLineData = '/homeStatistics/clientOrderCount',
  ClientMessage = '/homeStatistics/messageStatisticsByClient',
  ClientMessageRead = '/sys/client/clientMessageRead',
  AdminBarData = '/homeStatistics/barData',
}

export const getAdminHomeList = () => tmsHttp.get<HomeListGetResultModel>({ url: Api.List });

/**
 * @description 服务商收入支出柱状图
 */
export const getAdminBarData = (params: { startDate: string; endDate: string }) =>
  tmsHttp.get<ServiceFinanceBarData>({ url: Api.AdminBarData, params });
/**
 * @param params
 * tab1 服务商  0为日 1为周 2为月
 * tab2 渠道订单
 */
export const getAdminPieData = (params: { tab1: string | number; tab2: string | number }) =>
  tmsHttp.get<PieDataGetResultModel>({ url: Api.PieData, params });

export const getClientInfo = () => tmsHttp.get<ClientInfoGetResultModel>({ url: Api.ClientInfo });
export const getClientPieData = (tab1: string | number) =>
  tmsHttp.get<ClientPieDataGetResultModel>({ url: Api.ClientPieData, params: { tab1 } });
export const getClientLineData = () => tmsHttp.get<ClientLineItem[]>({ url: Api.ClientLineData });
export const getClientMessage = (messageType: string | number) =>
  tmsHttp.get<MessageDataGetResultModel>({ url: Api.ClientMessage, params: { messageType } });
export const clientMessageRead = (ids: number[] | string[]) =>
  tmsHttp.post({ url: Api.ClientMessageRead, params: { ids } });
