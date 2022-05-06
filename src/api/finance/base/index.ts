export * from './service';
export * from './model/clientModel';
export * from './model/serviceModel';
export * from './quota';
export * from './client';

enum Api {
  EntryInfo = '/sys/list/payment/info',
}

import { tmsHttp } from '@/utils/http/axios';
import { ServiceEntry } from './model';

/**
 * 入账基础信息查询(客户,服务商)
 * @param objectCode 客户或服务商代码
 * @param settlementObject 1客户 2服务商
 */
export const getEntryInfo = (objectCode: string, settlementObject: 1 | 2) =>
  tmsHttp.get<ServiceEntry>({ url: Api.EntryInfo, params: { objectCode, settlementObject } });
