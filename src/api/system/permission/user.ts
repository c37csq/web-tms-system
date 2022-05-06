/*
 * @Author: handsomeFu
 * @Date: 2021-08-31 17:05:52
 * @LastEditTime: 2021-08-31 18:17:23
 * @LastEditors: your name
 * @Description:
 */

import { ContentTypeEnum } from '@/enums/httpEnum';

import {
  UserPageParams,
  UserPageListGetResultModel,
  UserInfoGetResultModel,
  EnterpriseListGetResultModel,
  UserParams,
  RoleListGetResultModel,
} from './model/permissionModel';
import { tmsHttp } from '@/utils/http/axios';

enum Api {
  UserList = '/admin/system/user/list',
  UserAdd = '/admin/system/user/add',
  UserEdit = '/admin/system/user/edit',
  EnterpriseForUser = '/admin/system/enterprise/enterprisesForUser',
  ResetPass = '/admin/system/user/resetPass',
}

export const getUserListByPage = (params?: UserPageParams) =>
  tmsHttp.post<UserPageListGetResultModel>({ url: Api.UserList, params });

/**
 * @description 获取用户企业列表
 */
export const getUserEnterpriseList = () => tmsHttp.get<EnterpriseListGetResultModel>({ url: Api.EnterpriseForUser });
export const getUserRoleList = () => tmsHttp.get<RoleListGetResultModel>({ url: Api.UserAdd });
export const addUser = (params: UserParams) => tmsHttp.post<null>({ url: Api.UserAdd, params });
export const updateUser = (params: UserParams) => tmsHttp.post({ url: Api.UserEdit, params });
export const getUserInfoById = (params: { id: string }) =>
  tmsHttp.get<UserInfoGetResultModel>({ url: Api.UserEdit, params });

export const resetUserPass = (params: { id: string }) =>
  tmsHttp.post({
    url: Api.ResetPass,
    params,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  });
