/**
 * Created By fzq on 2021/11/26 14:11
 */
import { tmsHttp } from '@/utils/http/axios';
import {
  TaskLogPageListGetResultModel,
  TaskLogSearchParams,
  TaskPageListGetResultModel,
  TaskParams,
  TaskSearchParams,
} from '@/api/system/scheduled/model/scheduledModel';

enum Api {
  List = '/admin/quartzTask/list',
  Add = '/admin/quartzTask/add',
  Edit = '/admin/quartzTask/edit',
  Del = '/admin/quartzTask/delete',
  Pause = '/admin/quartzTask/pause', // 暂停
  Recovery = '/admin/quartzTask/resume', // 恢复
  Execute = '/admin/quartzTask/run', // 执行
  LogList = '/admin/quartzTaskLog/list',
  DelLog = '/admin/quartzTaskLog/delete',
}

export const getTaskListByPage = (params: TaskSearchParams) =>
  tmsHttp.get<TaskPageListGetResultModel>({ url: Api.List, params });

export const addTask = (params: TaskParams) => tmsHttp.post({ url: Api.Add, params });
export const updateTask = (params: TaskParams) => tmsHttp.put({ url: Api.Edit, params });
export const delTask = (id: string) => tmsHttp.delete({ url: `${Api.Del}?id=${id}` });

export const executeTask = (id: string[]) => tmsHttp.put({ url: Api.Execute, params: { id } });
export const pauseTask = (id: string[]) => tmsHttp.put({ url: Api.Pause, params: { id } });
export const recoverTask = (id: string[]) => tmsHttp.put({ url: Api.Recovery, params: { id } });

// log
export const getTaskLogListByPage = (params: TaskLogSearchParams) =>
  tmsHttp.get<TaskLogPageListGetResultModel>({ url: Api.LogList, params: params });
export const delTaskLog = (id: string) => tmsHttp.delete({ url: `${Api.DelLog}?id=${id}` });
