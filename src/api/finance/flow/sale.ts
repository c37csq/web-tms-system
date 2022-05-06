import { tmsHttp, blobFileHttp } from '@/utils/http/axios';
import { SaleListParams, SaleListReturnType } from '@/api/finance/flow/model/saleModel';

enum Api {
  List = '/sysEnterpriseBalanceLog/list',
  Export = '/sysEnterpriseBalanceLog/export',
}

// 获取成本流水列表
export const getSaleList = (params: SaleListParams) => tmsHttp.post<SaleListReturnType>({ url: Api.List, params });

// 销售流水列表
export const exportSale = (params: SaleListParams) => blobFileHttp.post({ url: Api.Export, params });
