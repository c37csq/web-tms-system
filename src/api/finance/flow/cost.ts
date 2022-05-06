import { tmsHttp, blobFileHttp } from '@/utils/http/axios';
import { CostListParams, CostListReturnType } from '@/api/finance/flow/model/costModel';

enum Api {
  List = '/cspProviderBalanceLog/list',
  Export = '/cspProviderBalanceLog/export',
}

// 获取成本流水列表
export const getCostList = (params: CostListParams) => tmsHttp.post<CostListReturnType>({ url: Api.List, params });

// 获取成本流水列表
export const exportCost = (params: CostListParams) => blobFileHttp.post({ url: Api.Export, params });
