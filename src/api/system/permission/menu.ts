/*
 * @Author: handsomeFu
 * @Date: 2021-08-31 17:05:57
 * @LastEditTime: 2021-11-17 16:01:53
 * @LastEditors: handsomeFu
 * @Description:
 */

import { MenuParams, MenuListGetResultModel, MenuListItem } from './model/permissionModel';
import { tmsHttp } from '@/utils/http/axios';

enum Api {
  MenuList = '/admin/system/menu/list',
  MenuAdd = '/admin/system/menu/add',
  MenuEdit = '/admin/system/menu/edit',
  MenuDel = '/admin/system/menu/delete',
}

/**
 * @description: 获取菜单列表
 */
export const getMenuList = (params?: { type: number }) =>
  tmsHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params });
/**
 * @description: 添加/编辑/删除菜单
 */
export const addMenu = (params: MenuParams) => tmsHttp.post<null>({ url: Api.MenuAdd, params });
export const updateMenu = (params: MenuParams) => tmsHttp.post<null>({ url: Api.MenuEdit, params });
export const delMenu = (id: string) => tmsHttp.get<null>({ url: Api.MenuDel, params: { id } });
export const getOneMenu = (id: string) => tmsHttp.get<MenuListItem>({ url: Api.MenuEdit, params: { id } });
