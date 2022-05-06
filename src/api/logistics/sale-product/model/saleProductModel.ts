// 请求列表参数类型
import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export type SaleListParams = BasicPageParams & {
  status?: string; // 状态
  teamCode?: string; // 产品组编号
  schemeCode?: string; // 分区方案编号
  promotingProductsName?: string; // 销售产品中文名称
};

type flagStatus = '0' | '1'; // 0 否 1 是

export type SaleProductDetail = {
  productsId: number;
  teamCode: string;
  schemeCode: string;
  promotingProductsCode: string;
  promotingProductsName: string;
  promotingProductsNameEn: string;
  status: flagStatus;
  clientCode: string;
  startWeightRange: number;
  endWeightRange: number;
  freightMinAge: string;
  freightMaxAge: string;
  chargedWeight: '0' | '1' | '2'; // 0取实重，1取体积重，2按规则
  defaultPhone: string;
  defaultZipCode: string;
  verifyRemote: string;
  trackable: flagStatus;
  envelope: flagStatus;
  insuranceService: flagStatus;
  ageVerificationService: flagStatus;
  uploadTag: flagStatus;
  tag: flagStatus;
  ignoreAddress: flagStatus;
  withoutElectricity: flagStatus;
  vat: flagStatus;
  delFlag: '0' | '2'; // 0 存在 2 删除
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  ageVerificationServiceLabel: string;
  insuranceServiceLabel: string;
  warehouseCode: string;
};

export interface LogisticsListItem {
  productsId: number;
  teamCode: string;
  schemeCode: string;
  promotingProductsCode: string;
  promotingProductsName: string;
  promotingProductsNameEn: string;
  status: '0' | '1';
  clientCode: string;
  startWeightRange: number;
  endWeightRange: number;
  freightMinAge: string;
  freightMaxAge: string;
  chargedWeight: string;
  defaultPhone: string;
  defaultZipCode: string;
  verifyRemote: string;
  trackable: string;
  envelope: string;
  insuranceService: string;
  ageVerificationService: string;
  uploadTag: string;
  tag: string;
  ignoreAddress: string;
  withoutElectricity: string;
  vat: string;
  delFlag: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  isActive: boolean;
}

export type SaleProductRuleListItem = {
  weightRulesId: number;
  weightRulesName: string;
  productsId: number;
  volumeFactor: string;
  conditionExpression: string;
  weightExpression: string;
  status: '0' | '1' | '2'; // 0 草稿 1 发布 2 过期
  effectiveState: string; // 0 未生效 1 生效 2 过期
  startTime: string;
  endTime: string;
  delFlag: '0' | '2'; // 0 存在 2 删除
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  sort: number;
};

export type AddProductType = {
  teamCode: string; // 产品组编号
  warehouseCode: string; // 仓库
  schemeCode: string; // 分区方案编号
  promotingProductsCode: string; // 销售产品编号
  promotingProductsName: string; // 销售产品中文名称
  promotingProductsNameEn: string; // 销售产品英文名称
  clientCode: string; // 客户编号
  startWeightRange: string; // 起始重量区间
  endWeightRange: string; // 结束重量区间
  freightMinAge: string; // 货运最低时效
  freightMaxAge: string; // 货运最佳时效
  defaultPhone: string; // 默认填充电话
  defaultZipCode: string; // 默认填充邮编
  verifyRemote: string; // oda编号
  insuranceService: string; // 保险服务(0否，1是)
  ageVerificationService: string; // 签名服务(0否，1成年2未成年)
};

export type AddRuleParamsType = {
  weightRulesId?: number;
  weightRulesName: string;
  productsId: string;
  volumeFactor: string;
  conditionExpression: string;
  weightExpression: string;
  status?: string;
  effectiveState?: string;
  startTime: string;
  endTime: string;
  delFlag?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  sort: string;
};

// list return type
export type LogisticsListReturnType = BasicFetchResult<LogisticsListItem>;
