import { tmsHttp } from '@/utils/http/axios';
import { RecalculateListParams, RecalculateListReturnType } from '@/api/finance/flow/model/recalculate';

enum Api {
  List = '/costDoubleBilling/list',
  Change = '/costDoubleBilling/recalculateCosts',
  GetFlow = '/costDoubleBilling/recalculateByExternalno',
}

export const getRecalculateList = (params: RecalculateListParams) =>
  tmsHttp.post<RecalculateListReturnType>({ url: Api.List, params });

export const recalculateChange = (params: { costType: number; orderCodeList: string[] }) =>
  tmsHttp.post<null>({ url: Api.Change, params });

export const getFlow = (params: string) => tmsHttp.get<null>({ url: `${Api.GetFlow}?externalno=${params}` });
