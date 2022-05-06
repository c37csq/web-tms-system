/*
 * @Author: handsomeFu
 * @Date: 2021-08-31 17:06:05
 * @LastEditTime: 2021-11-17 16:01:15
 * @LastEditors: handsomeFu
 * @Description:
 */

import {
  RolePageParams,
  RoleParams,
  RolePageListGetResultModel,
  RoleListGetResultModel,
  RoleInfoGetResultModel,
  MenuItem,
} from './model/permissionModel';
import { tmsHttp } from '@/utils/http/axios';

enum Api {
  RoleList = '/admin/system/role/list',
  RoleAdd = '/admin/system/role/add',
  RoleEdit = '/admin/system/role/edit',
  MenuForRole = '/admin/system/role/getMenusForAdd',
  IsAdmin = '/admin/system/role/isAdmin',
}

/**
 * @description: 获取分页角色列表
 */
export const getRoleListByPage = (params: RolePageParams) =>
  tmsHttp.post<RolePageListGetResultModel>({ url: Api.RoleList, params });

export const getRoleList = () => tmsHttp.get<RoleListGetResultModel>({ url: Api.RoleAdd });
export const addRole = (params: RoleParams) => tmsHttp.post<null>({ url: Api.RoleAdd, params });
export const getRoleInfo = (params: { id: string }) =>
  tmsHttp.get<RoleInfoGetResultModel>({ url: Api.RoleEdit, params });
export const updateRole = (params: RoleParams) => tmsHttp.post({ url: Api.RoleEdit, params });
export const getMenuForRole = (params: { parentId: string }) =>
  tmsHttp.get<MenuItem[]>({ url: Api.MenuForRole, params });
export const getUserIsAdmin = () => tmsHttp.get<{ isAdmin: string }>({ url: Api.IsAdmin });
