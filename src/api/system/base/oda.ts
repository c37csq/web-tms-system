/**
 * Created By fzq on 2021/11/24 17:27
 */
import { tmsHttp, blobFileHttp } from '@/utils/http/axios';
import { OdaParams, OdaItem, OdaRulePageListGetResultModel, OdaRuleSearchParams, OdaRuleParams } from '@/api/system';

enum Api {
  List = '/sys/basics/oda/list',
  Oda = '/sys/basics/oda',
  OdaRule = '/sys/basics/oda/detail',
  ExportOdaRule = '/sys/basics/oda/detail/derive',
}

export const getOdaList = () => tmsHttp.get<OdaItem[]>({ url: Api.List });
export const addOda = (params: OdaParams) => tmsHttp.post({ url: Api.Oda, params });
export const updateOda = (params: OdaParams) => tmsHttp.put({ url: Api.Oda, params });

export const getOdaRuleByPage = (params: OdaRuleSearchParams) =>
  tmsHttp.get<OdaRulePageListGetResultModel>({ url: Api.OdaRule, params });
export const addOdaRule = (params: OdaRuleParams) => tmsHttp.post({ url: Api.OdaRule, params });
export const updateOdaRule = (params: OdaRuleParams) => tmsHttp.put({ url: Api.OdaRule, params });
export const delOdaRule = (params: number[]) => tmsHttp.delete({ url: Api.OdaRule, params });

export const exportOdaRule = (params: { odaId: number }) => blobFileHttp.get({ url: Api.ExportOdaRule, params });
