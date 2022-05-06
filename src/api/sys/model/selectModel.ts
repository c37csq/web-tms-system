/**
 * Created By fzq on 2021/11/23 10:30
 */
export interface BasicOptionsItem {
  label: string;
  value: string;
  key?: string;
}

/**
 * @description 国家类型
 */
export interface CountryItem extends BasicOptionsItem {
  stateChineseName: string;
  stateCode: string;
  stateEnglishName: string;
}

/**
 * @description 仓库item
 */
export interface WarehouseItem extends BasicOptionsItem {
  warehouseCode: string;
  warehouseId: number;
  warehouseName: string;
}

/**
 * @description 额外服务item
 */
export interface ExtraServiceItem extends BasicOptionsItem {
  extraServiceCode: string;
  extraServiceId: number;
  extraServiceNameCn: string;
  extraServiceNameEn: string;
}

/**
 * @description 服务渠道item
 */
export interface ServiceChannelItem extends BasicOptionsItem {
  serviceChannelCode: string; // 服务渠道代码
  serviceChannelId: number; // 服务渠道id
  serviceProviderCode: string;
  teamCode: string;
}

/**
 * @description 销售产品item
 */
export interface SaleProductItem {
  productsId: number;
  promotingProductsCode: string;
  teamCode?: string;
}

/**
 * @description 产品组item
 */
export interface ProductTeamItem extends BasicOptionsItem {
  odaCode: string;
  teamCode: string;
  teamId: number;
  teamName: string;
}

/**
 * @description 费用类型item
 */
export interface FeeTypeItem {
  feeCode: string;
  feeId: number;
  feeNameCn: string;
}

/**
 * @description oda item
 */
export interface OdaItem extends BasicOptionsItem {
  odaCode: string;
  odaId: number;
  odaName: string;
}

/**
 * @description 分区方案item
 */
export interface PartitionSchemeItem extends BasicOptionsItem {
  endZipCode: string; // 结束邮编
  schemeCode: string;
  schemeId: number;
  schemeName: string;
  startZipCode: string; // 起始邮编
  status: number; // 状态（0草稿1发布2作废）
  teamId: number;
}

/**
 * @description 分区下拉item
 */
export interface PartitionItem {
  teamId?: number;
  zoningCode: string; // 分区代码
  zoningId: number; // 分区代码id
  zoningName?: string; // 分区名称
}

/**
 * @description 根据角色ID查询列表item
 */
export interface SelectUserByRoleIdItem extends BasicOptionsItem {
  id: string;
  nickName: string;
}

/**
 * @description 客户item
 */
export interface ClientItem extends BasicOptionsItem {
  clientCode: string;
  companyName: string;
  currencySymbol: string;
  id: string;
}

/**
 * @description 快递公司item
 */
export interface ExpressItem extends BasicOptionsItem {
  code: string;
  id: number;
  name: string;
  nameCn: string;
}

/**
 * @description 总公司用户item
 */
export interface UserItem extends BasicOptionsItem {
  id: string;
  nickName: string;
}

/**
 * @description 入账客户/服务商 item
 */
export interface EntryClientItem extends BasicOptionsItem {
  clientCode: string;
  companyName: string;
  currencySymbol: string;
  id: string;
}

/**
 * @description 币种item
 */
export interface CurrencyItem extends BasicOptionsItem {
  currencyId: number; // 币种ID
  currencyName: string; // 币种名称
  currencyStatus: 0 | 1; // 币种状态（0启用1未启用）
  currencySymbol: string; // 币种符号
  exchangeRate: number; // 汇率
  startupDate: string; // 启用日期（格式年月）
}

/**
 * @description 字典item
 */
export interface DictOptionItem {
  description?: string;
  id: string | number;
  label: string;
  type?: string;
  value: string | number;
}

/**
 * @description 服务商item
 */
export interface ServiceItem {
  apiServiceCode: string;
  serviceProviderCode: string;
  serviceProviderId: number;
  serviceProviderName: string;
  version: number;
}
