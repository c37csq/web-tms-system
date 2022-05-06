/*
 * @Author: c37csq
 * @Date: 2021-11-23 10:37:15
 * @LastEditTime: 2021-11-23 10:37:15
 * @LastEditors: c37csq
 * @Description:
 */
import { tmsHttp } from '@/utils/http/axios';
import { SaleProductDetail, SaleProductRuleListItem, AddRuleParamsType } from './model/saleProductModel';

enum Api {
  Detail = '/sellPromotingProducts/edit',
  RuleList = '/sellPromotingProductsWeightRules/list',
  AddRule = '/sellPromotingProductsWeightRules/add',
  RuleDetail = '/sellPromotingProductsWeightRules/edit',
  ChangeRuleStatus = '/sellPromotingProductsWeightRules/changeStatus',
}

// 获取销售产品详情
export const getSaleProductDetail = (params: { id: string }) =>
  tmsHttp.get<SaleProductDetail>({ url: Api.Detail, params });

// 获取销售产品规则列表
export const getSaleProductDetailList = (params: { productsId: string }) =>
  tmsHttp.post<SaleProductRuleListItem[]>({ url: Api.RuleList, params });

// 添加规则
export const addRule = (params: AddRuleParamsType) => tmsHttp.post<null>({ url: Api.AddRule, params });

// 根据id查询规则详情
export const ruleDetail = (params: { id: number }) => tmsHttp.get<AddRuleParamsType>({ url: Api.RuleDetail, params });

// 编辑产品规则
export const editRule = (params: AddRuleParamsType) => tmsHttp.post<null>({ url: Api.RuleDetail, params });

// 发布/作废规则
export const changeRuleStatus = (params: { id: number; status: number }) =>
  tmsHttp.get<null>({ url: Api.ChangeRuleStatus, params });
