/*
 * @Author: c37csq
 * @Date: 2021-11-23 10:37:15
 * @LastEditTime: 2021-11-23 10:37:15
 * @LastEditors: c37csq
 * @Description:
 */
import { SaleListParams, LogisticsListReturnType, AddProductType } from './model/saleProductModel';
import { tmsHttp } from '@/utils/http/axios';

enum Api {
  List = '/sellPromotingProducts/list',
  AddProduct = '/sellPromotingProducts/add',
  EditProduct = '/sellPromotingProducts/edit',
  ChangeStatus = '/sellPromotingProducts/changeStatus',
}

// 获取销售产品列表
export const getSearchList = (params: SaleListParams) =>
  tmsHttp.post<LogisticsListReturnType>({ url: Api.List, params });

// 新增产品
export const addProduct = (params: AddProductType) => tmsHttp.post<null>({ url: Api.AddProduct, params });

// 编辑产品
export const editProduct = (params: AddProductType) => tmsHttp.post<null>({ url: Api.EditProduct, params });

// 改变销售产品状态 停用/启用
export const changeStatus = (params: { id: number; status: '0' | '1' }) =>
  tmsHttp.get<null>({ url: Api.ChangeStatus, params });
