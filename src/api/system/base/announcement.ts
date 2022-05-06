/**
 * Created By fzq on 2021/11/23 18:03
 */
import { tmsHttp } from '@/utils/http/axios';
import { AnnouncementParams, AnnouncementSearchParams, AnnouncementPageListGetResultModel } from '@/api/system';

enum Api {
  List = '/sys/client/enterpriseMessage/list',
  Add = '/sys/client/enterpriseMessage',
  Update = '/sys/client/enterpriseMessage/update',
  Delete = '/sys/client/enterpriseMessage',
}

export const getAnnouncementListByPage = (params: AnnouncementSearchParams) =>
  tmsHttp.get<AnnouncementPageListGetResultModel>({ url: Api.List, params });
export const addAnnouncement = (params: AnnouncementParams) => tmsHttp.post({ url: Api.Add, params });
export const updateAnnouncement = (params: AnnouncementParams) => tmsHttp.post({ url: Api.Update, params });
export const delAnnouncement = (id: number) => tmsHttp.delete({ url: `${Api.Delete}/${id}` });
