/**
 * Created By fzq on 2021/11/23 14:13
 */

import { ref, unref } from 'vue';
import {
  getCurrencyList,
  CurrencyItem,
  getProductTeamList,
  PartitionSchemeItem,
  getPartitionSchemeList,
  ProductTeamItem,
  getWarehouseList,
  WarehouseItem,
  getEnterpriseList,
  getClientList,
  ClientItem,
  getExpressList,
  ExpressItem,
  getExtraServiceList,
  ExtraServiceItem,
  getCountryList,
  CountryItem,
  getFeeTypeList,
  FeeTypeItem,
  getUserList,
  UserItem,
  getSelectUserByRoleId,
  SelectUserByRoleIdItem,
  getSelectDataByType,
  DictOptionItem,
  getServiceChannelList,
  ServiceChannelItem,
  getSaleProductList,
  SaleProductItem,
  getPartitionList,
  PartitionItem,
  getOdaList,
  OdaItem,
  getEntryClientList,
  EntryClientItem,
  getServiceList,
  ServiceItem,
} from '@/api/sys';

import { EnterpriseListItem } from '@/api/system';

/**
 * @description 获取币种列表
 */
export async function useCurrencyList() {
  const currencyList = ref<CurrencyItem[]>([]);
  try {
    currencyList.value = await getCurrencyList();
  } catch (e) {
    console.error(e);
    currencyList.value = [];
  }
  return unref(currencyList) || [];
}

/**
 * @description 产品组列表
 * @param teamName
 */
export async function useProductTeamList(teamName = '') {
  const productTeamList = ref<ProductTeamItem[]>([]);
  try {
    productTeamList.value = await getProductTeamList(teamName);
  } catch (e) {
    console.error(e);
    productTeamList.value = [];
  }
  return unref(productTeamList) || [];
}

/**
 * @description 分区方案下拉列表
 * @param teamCode 产品 code
 * @param warehouseCode 仓库代码 可选
 */
export async function usePartitionSchemeList(teamCode: string, warehouseCode?: string) {
  const PartitionSchemeList = ref<PartitionSchemeItem[]>([]);
  try {
    PartitionSchemeList.value = await getPartitionSchemeList(teamCode, warehouseCode);
  } catch (e) {
    console.error(e);
    PartitionSchemeList.value = [];
  }
  return unref(PartitionSchemeList) || [];
}

/**
 * @description 分区下拉接口
 * @param teamCode
 */
export async function usePartitionList(teamCode) {
  const partitionList = ref<PartitionItem[]>([]);
  try {
    partitionList.value = await getPartitionList(teamCode);
  } catch (e) {
    console.error(e);
    partitionList.value = [];
  }
  return unref(partitionList) || [];
}

/**
 * @description 服务商渠道下拉
 */
export async function useServiceChannelList(serviceProviderCode?: string) {
  const serviceChannelList = ref<ServiceChannelItem[]>([]);
  try {
    serviceChannelList.value = await getServiceChannelList(serviceProviderCode);
  } catch (e) {
    console.error(e);
    serviceChannelList.value = [];
  }
  return unref(serviceChannelList) || [];
}

/**
 * @description oda 下拉数据
 */
export async function useOdaList() {
  const odaList = ref<OdaItem[]>([]);
  try {
    odaList.value = await getOdaList();
  } catch (e) {
    console.error(e);
    odaList.value = [];
  }
  return unref(odaList) || [];
}

/**
 * @description 销售产品下拉
 */
export async function useSaleProductList() {
  const saleProductList = ref<SaleProductItem[]>([]);
  try {
    saleProductList.value = await getSaleProductList();
  } catch (e) {
    console.error(e);
    saleProductList.value = [];
  }
  return unref(saleProductList) || [];
}

/**
 * @description 仓库下拉列表
 */
export async function useWarehouseList() {
  const warehouseList = ref<WarehouseItem[]>([]);
  try {
    warehouseList.value = await getWarehouseList();
  } catch (e) {
    console.error(e);
    warehouseList.value = [];
  }
  return unref(warehouseList) || [];
}

/**
 * @description 客户企业下拉列表
 */
export async function useEnterpriseList() {
  const EnterpriseList = ref<EnterpriseListItem[]>([]);
  try {
    EnterpriseList.value = await getEnterpriseList();
  } catch (e) {
    console.error(e);
    EnterpriseList.value = [];
  }
  return unref(EnterpriseList) || [];
}

/**
 * @description 客户代码列表
 */
export async function useClientCodeList() {
  const clientCodeList = ref<ClientItem[]>([]);
  try {
    clientCodeList.value = await getClientList();
  } catch (e) {
    console.error(e);
    clientCodeList.value = [];
  }
  return unref(clientCodeList) || [];
}

/**
 * @description 快递代码列表
 */
export async function useExpressList() {
  const expressList = ref<ExpressItem[]>([]);
  try {
    expressList.value = await getExpressList();
  } catch (e) {
    console.error(e);
    expressList.value = [];
  }
  return unref(expressList).filter((item) => item) || [];
}

/**
 * @description 额外服务列表
 */
export async function useExtraServiceList() {
  const extraServiceList = ref<ExtraServiceItem[]>([]);
  try {
    extraServiceList.value = await getExtraServiceList();
  } catch (e) {
    console.error(e);
    extraServiceList.value = [];
  }
  return unref(extraServiceList) || [];
}

/**
 * @description 国家下拉列表
 */
export async function useCountryList() {
  const countryList = ref<CountryItem[]>([]);
  try {
    countryList.value = await getCountryList();
  } catch (e) {
    console.error(e);
    countryList.value = [];
  }
  return unref(countryList) || [];
}

/**
 * @description 费用类型下拉
 */
export async function useFeeTypeList() {
  const feeTypeList = ref<FeeTypeItem[]>([]);
  try {
    feeTypeList.value = await getFeeTypeList();
  } catch (e) {
    console.error(e);
    feeTypeList.value = [];
  }
  return unref(feeTypeList) || [];
}

/**
 * @description 总公司用户下拉
 */
export async function useUserList() {
  const userList = ref<UserItem[]>([]);
  try {
    userList.value = await getUserList();
  } catch (e) {
    console.error(e);
    userList.value = [];
  }
  return unref(userList) || [];
}

/**
 * 根据角色ID查询列表
 * @param roleId
 * 3704e0b8-0f9f-0bbf-9572-607b3e79075e  销售列表
 * 6bb22324-fcfa-bfe0-4055-ca37c4bff46f  客服列表
 */
export async function useUserByRoleId(roleId: string) {
  const userList = ref<SelectUserByRoleIdItem[]>([]);
  try {
    userList.value = await getSelectUserByRoleId(roleId);
  } catch (e) {
    userList.value = [];
  }
  return unref(userList) || [];
}

/**
 * @description 获取字典数据
 * @param type 类型
 * warehouseType 仓库类型
 * exceptionType 问题件回退类型
 * chargeUnit (成本/销售)杂费 计费单位下拉数据
 * priceGrade 价格等级
 */
export async function useDictData(type: string) {
  const dictData = ref<DictOptionItem[]>([]);
  try {
    dictData.value = await getSelectDataByType(type);
    dictData.value = dictData.value.map((e) => {
      e.value = isNaN(+e.value) ? e.value : +e.value;
      return e;
    });
  } catch (e) {
    dictData.value = [];
  }
  return unref(dictData) || [];
}

/**
 * 企业代码下拉选(客户/服务商)
 * @param settlementObject 客户1 服务商2
 */
export async function useEntryClientList(settlementObject: 1 | 2) {
  const entryClientList = ref<EntryClientItem[]>([]);
  try {
    entryClientList.value = await getEntryClientList(settlementObject);
  } catch (e) {
    console.error(e);
    entryClientList.value = [];
  }
  return unref(entryClientList) || [];
}

/**
 * @description 服务商列表
 */
export async function useServiceList() {
  const serviceList = ref<ServiceItem[]>([]);
  try {
    serviceList.value = await getServiceList();
  } catch (e) {
    console.error(e);
    serviceList.value = [];
  }
  return unref(serviceList);
}
