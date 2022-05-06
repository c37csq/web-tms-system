/*
 * @Author: handsomeFu
 * @Date: 2021-11-16 18:41:19
 * @LastEditTime: 2021-11-16 18:44:34
 * @LastEditors: handsomeFu
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router';

import { usePermissionStore } from '@/store/modules/permission';

import { useTabs } from './useTabs';
import { router, resetRouter } from '@/router';
import { intersection } from 'lodash-es';
import { isArray } from '@/utils/is';
import { useMultipleTabStore } from '@/store/modules/multipleTab';

// User permissions related operations
export function usePermission() {
  const permissionStore = usePermissionStore();
  const { closeAll } = useTabs(router);

  /**
   * Reset and regain authority resource information
   */
  async function resume() {
    const tabStore = useMultipleTabStore();
    tabStore.clearCacheTabs();
    resetRouter();
    const routes = await permissionStore.buildRoutesAction();
    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });
    permissionStore.setLastBuildMenuTime();
    await closeAll();
  }

  /**
   * Determine whether there is permission
   */
  function hasPermission(value?: string | string[], def = true): boolean {
    // Visible by default
    if (!value) {
      return def;
    }

    const allCodeList = permissionStore.getPermCodeList as string[];
    if (!isArray(value)) {
      return allCodeList.includes(value);
    }
    return (intersection(value, allCodeList) as string[]).length > 0;
  }

  /**
   * refresh menu data
   */
  async function refreshMenu() {
    await resume();
  }

  return { hasPermission, refreshMenu };
}
