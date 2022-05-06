import { tmsHttp } from '@/utils/http/axios';
import { ErrorListParams, ErrorListReturnType } from '@/api/order/order-manage/model/ErrorListModel';

enum Api {
  List = '/externalOrder/list',
  Sync = '/externalOrder/synchronizeAgain',
}

// 获取问题件列表
export const getErrorList = (params: ErrorListParams) => tmsHttp.post<ErrorListReturnType>({ url: Api.List, params });

// 同步问题件
export const errorOrderSync = (params: { ids: string[] }) => tmsHttp.post<null>({ url: Api.Sync, params });
