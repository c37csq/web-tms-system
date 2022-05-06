/*
 * @Author: handsomeFu
 * @Date: 2021-08-31 17:06:35
 * @LastEditTime: 2021-11-17 16:14:02
 * @LastEditors: handsomeFu
 * @Description:
 */

import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';
import type { UserInfo } from '#/store';

export type BaseParams = {
  id?: string;
  parentId?: string;
  type?: number;
};

export type MenuParams = {
  id?: string;
  title: string;
  path?: string;
  redirect?: string;
  name?: string;
  component?: string;
  icon?: string;
  hidden?: boolean;
  hideMenu?: boolean;
  hiddenChildrenInMenu?: boolean;
  isSecondary?: boolean;
  ignoreKeepAlive?: boolean;
  parentId?: string;
  permission?: string;
  sort?: number | string;
};

export interface MenuSet {
  id: string;
}
export type RolePageParams = BasicPageParams & {};

export type RoleParams = {
  id?: string;
  name: string;
  parentId: string;
  remarks: string;
  menuSet: MenuSet[];
};

export type UserPageParams = BasicPageParams & {
  loginName?: string;
  roleId?: string;
};

export type UserParams = {
  id?: string;
  loginName: string;
  nickName: string;
  enterpriseRecordId: string;
  email: string;
  tel: string;
  qq: string;
  roleLists: { id: string }[];
  roleIds: string[];
  locked: boolean;
};

export interface MenuListItem {
  id: string;
  title: string;
  name: string;
  path: string;
  ignoreKeepAlive: boolean;
  sort: string;
  createDate: string;
  status: number;
  icon: string;
  component: string;
  permission: string;
  isSecondary: boolean;
}

export interface RoleListItem {
  id: string;
  createDate: string;
  createId: string;
  delFlag: boolean;
  enterpriseRecordId: string;
  name: string;
  parentId: string;
  remarks: string;
  updateDate: string;
  updateId: string;
  createUser: null;
  enterpriseRecord: null;
  menuSet: any[];
  roleList: RoleListItem[];
  updateUser: null;
  userSet: any[];
}

export interface UserListItem {
  createDate: string;
  createId: string;
  createUser: null;
  delFlag: boolean;
  email: string;
  enterpriseRecordId: string;
  enterpriseRecordList: any[];
  icon: string;
  id: string;
  lastChangePasswordTime: null | string;
  lastLoginTime: null | string;
  locked: boolean;
  loginName: string;
  menuJSONStr: string;
  menus: any[];
  nickName: string;
  qq: string;
  remarks: string;
  roleLists: any[];
  tel: string;
  updateDate: string;
  updateId: string;
  updateUser: null;
}

export interface EnterpriseListItem {
  addrType: string;
  address: string;
  clientCode: string;
  clientName: string;
  companyName: string;
  contractEndTime: string;
  contractExpire: number;
  contractStartTime: string;
  createBy: string;
  createDate: string;
  delFlag: boolean;
  economics: string;
  effectiveState: number;
  email: string;
  enterpriseAbbr: string;
  enterpriseName: string;
  enterpriseRecord: null;
  enterpriseRecordCode: string;
  enterpriseRecordId: string;
  enterpriseRecordList: any[];
  enterpriseRecordNo: string;
  enterpriseStatus: number;
  enterpriseType: string;
  extrasLevel: string;
  freightLevel: string;
  id: string;
  sellRepresent: string;
  serviceRepresent: string;
  telephone: string;
  top: boolean;
  updateBy: string | null;
  updateDate: string | null;
  warehouseList: String;
}

export type RoleInfo = {
  delFlag: boolean;
  menuIds: string[];
  menuList: MenuItem[];
  parentRoleName: string;
  role: RoleParams;
};

export interface MenuItem {
  children: MenuItem[];
  id: string;
  name: string;
  parentId: string;
  title: string;
}

/**
 * @description: Request list return value
 */
export type MenuListGetResultModel = MenuListItem[];
export type RolePageListGetResultModel = BasicFetchResult<RoleListItem>;
export type RoleListGetResultModel = RoleListItem[];
export type UserPageListGetResultModel = BasicFetchResult<UserListItem>;
export type RoleInfoGetResultModel = RoleInfo;
export type EnterpriseListGetResultModel = EnterpriseListItem[];
export type UserInfoGetResultModel = {
  localUser: UserInfo;
  roleIds: string[];
  roleList: RoleListItem[];
};
