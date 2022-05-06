/**
 * Created By fzq on 2021/11/29 14:50
 */
/**
 * @description 试算(成本/销售)
 */
export type TrialSearchParams = {
  warehouseCode: string;
  stateCode: string;
  state: string;
  city: string;
  zipCode: string;
  length: string;
  wide: string;
  high: string;
  weight: string;
};
export type CostTrialSearchParams = TrialSearchParams & {
  serviceChannelCode: string;
};
export type SaleTrialSearchParams = TrialSearchParams & {
  promotingProductsCode: string;
};
interface TrialDetailItem {
  costType: string;
  chargeUnit: string;
  costValue: string;
}
export type TrialResultItem = {
  allCost: string;
  costHandleDetailVoList: TrialDetailItem[];
  costPrice: string;
  currency: string;
  otherCost: string;
  priceGrade: string;
  promotingProductsCode: string;
  schemeName: string;
  serviceChannelCode: string;
  weight: string;
  zoneCode: string;
  detailList: TrialDetailItem[]; // 自定义
};

/**
 * @description 成本/销售通用杂费item
 */
export interface CommonIncidentalsItem {
  createBy: string;
  createTime: string;
  currency: string;
  delFlag: string;
  effectiveState: string;
  endTime: string;
  startTime: string;
  status: string;
  sundryChargesId: number;
  updateBy: string;
  updateTime: string;
}

/**
 * @description 通用发布参数
 */
export type CommonStatusParams = {
  status: number; // 作废传2 发布传1
  verify?: number; // 发布的时候传0则获取数据 传1表示验证发布
};

/**
 * @description 成本/销售通用详情item
 */
export interface CommonProductsSundryChargesDetailsItem {
  id: number;
  costType: string;
  costTypeName: string;
  chargeUnit: string;
  baseFeeList: string[];
  baseFee: string;
  unitPrice: string;
  extraService: string;
  extraServiceName: string;
  zoningCodeList: string[];
  zoningCode: string;
  startWeight: string;
  endWeight: string;
  startTime: string;
  endTime: string;
  feeCodeList: string[];
}

interface CommonFareDetailTableBodyItem {
  weight: string;
  [key: string | number]: string;
}

export interface CommonFarePriceDetailList {
  tableBody: CommonFareDetailTableBodyItem[];
  tableHeader: { prop: string; label: string }[];
}
