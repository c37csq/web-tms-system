/**
 * Created By fzq on 2021/11/25 15:00
 */
import { tmsHttp } from '@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { DictItem, DictPageListGetResultModel, DictParams, DictSearchParams } from '@/api/system';

enum Api {
  List = '/admin/system/dict/list',
  Refresh = '/admin/system/dict/refreshAll', // 刷新
  Add = '/admin/system/dict/add',
  Edit = '/admin/system/dict/edit',
  Del = '/admin/system/dict/delete',
}

export const getDictByPage = (params: DictSearchParams) =>
  tmsHttp.post<DictPageListGetResultModel>({ url: Api.List, params });
export const addDict = (params: DictParams) => tmsHttp.post({ url: Api.Add, params });
export const getDict = (id: string) => tmsHttp.get<DictItem>({ url: Api.Edit, params: { id } });
export const updateDict = (params: DictParams) =>
  tmsHttp.post({
    url: Api.Edit,
    params,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  });
export const delDict = (id: string) => tmsHttp.get({ url: Api.Del, params: { id } });
export const refreshAllDict = () => tmsHttp.get({ url: Api.Refresh });
