import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export type RecalculateListParams = {
  externalno: string;
  warehouseCode: string;
  serviceProviderCode: string;
  createStartTime: string;
  createEndTime: string;
  serviceChannelCode: string;
  billType: string;
} & BasicPageParams;

export type RecalculateListItem = {
  backOff: boolean;
  basicFile: string;
  billsCostStatus: string;
  billsStatus: string;
  chargedWeight: number;
  costChargedWeight: number;
  costPrice: number;
  price: number;
  costVolumeWeight: number;
  createDate: string;
  createId: string;
  currency: string;
  deliveryDate: string;
  deliveryTime: string;
  dimensionUnit: string;
  enterpriseRecordCode: string;
  enterpriseRecordId: string;
  exceptionType: string;
  externalno: string;
  externalno2: string;
  fileName: string;
  height: number;
  home: boolean;
  id: string;
  idCardNo: string;
  insuranceService: boolean;
  insuranceValue: number;
  labelContent: string;
  labelDate: string;
  labelSize: number;
  labelType: string;
  labelUrl: string;
  length: number;
  needClearance: number;
  serviceProviderCode: string;
  warehouseCode: string;
};

export type RecalculateListReturnType = BasicFetchResult<RecalculateListItem>;
