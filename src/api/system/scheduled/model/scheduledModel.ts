/**
 * Created By fzq on 2021/11/26 13:47
 */
import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export interface TaskItem {
  createDate: Date;
  createId: string;
  createUser: null;
  cron: string;
  delFlag: boolean;
  id: string;
  name: string;
  params: string;
  remarks: string;
  status: number;
  targetBean: string;
  targetMethod: string;
  updateDate: Date;
  updateId: string;
  updateUser: null;
}
export type TaskSearchParams = BasicPageParams & {};
export type TaskParams = {
  id?: string;
  targetBean: string;
  targetMethod: string;
  name: string;
  cron: string;
  remarks: string;
  status: number;
};
export type TaskPageListGetResultModel = BasicFetchResult<TaskItem>;

export interface TaskLogItem {
  createDate: Date;
  createId: string;
  createUser: null;
  delFlag: boolean;
  error: string;
  id: string;
  jobId: string;
  name: string;
  params: string;
  remarks: string;
  status: number;
  targetBean: string;
  targetMethod: string;
  times: number;
  updateDate: Date;
  updateId: string;
  updateUser: null;
}
export type TaskLogSearchParams = BasicPageParams & {};
export type TaskLogPageListGetResultModel = BasicFetchResult<TaskLogItem>;
