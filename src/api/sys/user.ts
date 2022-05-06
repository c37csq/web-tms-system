/*
 * @Author: handsomeFu
 * @Date: 2021-11-09 15:52:54
 * @LastEditTime: 2021-11-10 18:44:22
 * @LastEditors: handsomeFu
 * @Description:
 */
import type { ErrorMessageMode } from '#/axios';

import { tmsHttp } from '@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel, ChangePwdParams } from './model/userModel';

enum Api {
  Login = '/login/main',
  Logout = '/systemLogout',
  GetUserInfo = '/admin/system/user/getUserInfo',
  Generate = '/isGenCaptcha',
  ChangePwd = '/admin/system/user/changePassword',
}

/**
 * @description: user login api / 用户登录接口
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return tmsHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo api / 获取用户信息接口
 */
export function getUserInfo() {
  return tmsHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

/**
 * @description: logout api / 用户登出接口
 */
export function doLogout() {
  return tmsHttp.get({ url: Api.Logout }, { errorMessageMode: 'none' });
}

/**
 * @description: Generate captcha api / 生成验证码接口
 */
export const isGenCaptcha = (params: LoginParams) => tmsHttp.post({ url: Api.Generate, params });

/**
 * @description 修改密码
 */
export const changePassword = (params: ChangePwdParams) => tmsHttp.post({ url: Api.ChangePwd, params });
