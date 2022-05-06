/*
 * @Author: handsomeFu
 * @Date: 2021-11-11 14:39:00
 * @LastEditTime: 2021-11-11 14:41:03
 * @LastEditors: handsomeFu
 * @Description:
 */
import type { Router } from 'vue-router';
import { useAppStore } from '@/store/modules/app';
import { useMultipleTabStore } from '@/store/modules/multipleTab';
import { useUserStore } from '@/store/modules/user';
import { usePermissionStore } from '@/store/modules/permission';
import { PageEnum } from '@/enums/pageEnum';
import { removeTabChangeListener } from '@/logics/mitt/routeChange';

export function createStateGuard(router: Router) {
  router.afterEach(async (to) => {
    // Just enter the login page and clear the authentication information
    if (to.path === PageEnum.BASE_LOGIN) {
      const tabStore = useMultipleTabStore();
      const userStore = useUserStore();
      const appStore = useAppStore();
      const permissionStore = usePermissionStore();

      await appStore.resetAllState();
      permissionStore.resetState();
      tabStore.resetState();
      userStore.resetState();
      removeTabChangeListener();
    }
  });
}
