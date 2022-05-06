/*
 * @Author: handsomeFu
 * @Date: 2021-11-08 09:17:03
 * @LastEditTime: 2021-11-11 16:06:38
 * @LastEditors: handsomeFu
 * @Description:
 */
import type { AppRouteRecordRaw } from '@/router/types';

import { PageEnum } from '@/enums/pageEnum';

import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '@/router/routes/basic';
import AboutRoute from '@/router/routes/modules/about';

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/sys/login/Login.vue'),
  meta: {
    title: '登录',
  },
};

// Basic routing without permission
export const basicRoutes = [LoginRoute, RootRoute, AboutRoute, REDIRECT_ROUTE, ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE];
