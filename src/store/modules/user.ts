/*
 * @Author: handsomeFu
 * @Date: 2021-11-09 15:03:03
 * @LastEditTime: 2021-11-18 15:27:27
 * @LastEditors: handsomeFu
 * @Description:
 */
import type { UserInfo } from '#/store';
import type { ErrorMessageMode } from '#/axios';
import type { RouteRecordRaw } from 'vue-router';

import { defineStore } from 'pinia';
import { store } from '@/store';
import { PageEnum } from '@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { LoginParams } from '@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi } from '@/api/sys/user';
import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import { router } from '@/router';
import { usePermissionStore } from '@/store/modules/permission';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { isArray } from '@/utils/is';
import { useWatermark } from '@/hooks/web/useWatermark';

import { RouteItem } from '@/router/types';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: string[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  routeList: RouteItem[];
  isTop: boolean;
  hasChangePwd: boolean;
}

const { clear, setWatermark } = useWatermark();

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    // route list
    routeList: [],
    isTop: false,
    hasChangePwd: false,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(): string[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<string[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
    getRouteList(): RouteItem[] {
      return this.routeList;
    },
    getIsTop(): boolean {
      return this.isTop;
    },
    getHasChangePwd(): boolean {
      return this.hasChangePwd;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : undefined;
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: string[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    setIsTop(isTop: boolean) {
      this.isTop = isTop;
    },
    setRouteList(list: RouteItem[]) {
      this.routeList = list;
    },
    setHasChangePwd(hasChangePwd: boolean) {
      this.hasChangePwd = hasChangePwd;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
      this.routeList = [];
      this.isTop = false;
      this.hasChangePwd = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<UserInfo | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        const { access_token: token } = data;

        // save token
        this.setToken(token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();
      const routeList = this.getRouteList;
      if (!routeList.length) return null;

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const { baseInfo: userInfo, routes, top } = await getUserInfo();
      const { roleLists = [] } = userInfo;
      if (isArray(roleLists)) {
        const roleList = roleLists.map((item) => item.name);
        this.setRoleList(roleList);
      } else {
        userInfo.roleLists = [];
        this.setRoleList([]);
      }
      this.setUserInfo(userInfo);
      this.setRouteList(routes);
      this.setIsTop(top);
      setWatermark(userInfo.loginName);
      this.setHasChangePwd(!!userInfo.lastChangePasswordTime);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch (e) {
          console.error('注销Token失败', e);
        } finally {
          this.setToken(undefined);
          this.setSessionTimeout(false);
          this.setUserInfo(null);
          clear();
        }
      }
      goLogin && (await router.push(PageEnum.BASE_LOGIN));
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        type: 'warning',
        title: t('sys.app.logoutTip'),
        message: t('sys.app.logoutMessage'),
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            try {
              await this.logout(true);
            } catch (e) {
              console.error(e);
            } finally {
              done();
              instance.confirmButtonLoading = false;
            }
          } else {
            done();
          }
        },
      })
        .then(() => {})
        .catch(() => {});
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
