/*
 * @Author: handsomeFu
 * @Date: 2021-11-10 18:03:23
 * @LastEditTime: 2021-11-11 15:55:35
 * @LastEditors: handsomeFu
 * @Description:
 */
import type { UserInfo } from '#/store';
import { RouteItem } from '@/router/types';

/**
 * @description: Login interface parameters / 登录接口参数
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * @description: Login interface return value / 登录接口返回值
 */
export interface LoginResultModel {
  access_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * @description: Get user information return value /获取用户信息返回值
 */
export interface GetUserInfoModel {
  baseInfo: UserInfo;
  routes: RouteItem[];
  top: boolean; // 是否是头部企业
}

/**
 * @description 修改密码参数
 */
export type ChangePwdParams = {
  username: string;
  passwordOld: string;
  passwordNew: string;
};
