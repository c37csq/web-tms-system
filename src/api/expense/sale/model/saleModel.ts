/**
 * Created By fzq on 2021/11/26 17:27
 */
import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';
import {
  CommonFarePriceDetailList,
  CommonIncidentalsItem,
  CommonProductsSundryChargesDetailsItem,
  CommonStatusParams,
} from '@/api/expense';
/**
 * @description 销售杂费折扣管理
 */
export interface SaleIncidentalsDiscountDetailItem {
  costType: string;
  costTypeName?: string;
  createBy?: string;
  createTime?: string;
  delFlag?: string;
  discountType: string;
  discountValue: number | string;
  salePriceDiscountDetailsId?: number;
  salePriceDiscountId?: number;
  updateBy?: string;
  updateTime?: string;
  zoningCode: string;
  zoningCodeList?: string[]; // 前端自定义需要用到
  id: number;
}
export interface SaleIncidentalsDiscountItem {
  createBy: string;
  createTime: string;
  delFlag: string;
  effectiveState: string;
  endTime: string;
  priceGrade: string;
  promotingProductsCode: string;
  salePriceDiscountDetailsList: SaleIncidentalsDiscountDetailItem[];
  salePriceDiscountId: number;
  startTime: string;
  status: string;
  updateBy: string;
  updateTime: string;
}
export type SaleIncidentalsDiscountPageGetResultModel = BasicFetchResult<SaleIncidentalsDiscountItem>;
export type SaleIncidentalsDiscountSearchParams = BasicPageParams & {
  promotingProductsCode?: string; // 销售产品编号
  status?: string; // 状态 0草稿 1发布 2作废
  effectiveState?: string; // 生效状态  0未生效 1生效 2过期
  startTime?: string;
  endTime?: string;
};
export type SaleIncidentalsDiscountParams = {
  salePriceDiscountId?: number;
  endTime: string;
  priceGrade: string;
  promotingProductsCode: string;
  salePriceDiscountDetailsList?: SaleIncidentalsDiscountDetailItem[];
  startTime: string;
};
export type SaleIncidentalsDiscountStatusParams = CommonStatusParams & {
  salePriceDiscountIds: number[];
};

/**
 * @description 销售杂费/销售杂费操作
 */
export interface SaleIncidentalsItem extends CommonIncidentalsItem {
  promotingProductsCode: string;
  sellProductsSundryChargesDetailsList: any[];
}
export type SaleIncidentalsPageGetResultModel = BasicFetchResult<SaleIncidentalsItem>;
export type SaleIncidentalsSearchParams = BasicPageParams & {
  promotingProductsCode?: string; // 销售产品
  currency?: string;
  status?: string; // 状态（0草稿1发布2作废）
  effectiveState?: string; // 生效状态（0未生效1生效2过期）
  startTime?: string;
  endTime?: string;
};
export type SaleIncidentalsParams = {
  sundryChargesId?: number;
  promotingProductsCode: string; // 销售产品编号
  currency: string;
  startTime: string;
  endTime: string;
  sellProductsSundryChargesDetailsList?: CommonProductsSundryChargesDetailsItem[];
};
export type SaleIncidentalsStatusParams = CommonStatusParams & {
  sundryChargesId: number[]; // ids
};

/**
 * @description 销售运费/销售运费操作
 */
export interface SaleFareItem {
  createBy: string;
  createTime: string;
  currency: string;
  delFlag: string;
  effectiveState: string;
  endTime: string;
  priceGrade: string;
  promotingProductsCode: string;
  salesPriceId: number;
  salesPriceName: string;
  sellSalesPriceDetailsList: any[];
  sellSalesPriceDetailsListTemp: CommonFarePriceDetailList;
  startTime: string;
  status: string;
  updateBy: string;
  updateTime: string;
}
export type SaleFarePageGetResultModel = BasicFetchResult<SaleFareItem>;
export type SaleFareSearchParams = BasicPageParams & {
  currency?: string;
  priceGrade?: string;
  promotingProductsCode?: string; // 销售产品
  status?: string;
  effectiveState?: string;
  startTime?: string;
  endTime?: string;
};
export type SaleFareParams = {
  salesPriceId?: number;
  currency: string;
  endTime: string;
  priceGrade: string;
  promotingProductsCode: string;
  salesPriceName: string;
  sellSalesPriceDetailsListTemp: CommonFarePriceDetailList;
  startTime: string;
};
export type SaleFareStatusParams = CommonStatusParams & {
  sellSalesPriceIds: number[]; // ids
};
