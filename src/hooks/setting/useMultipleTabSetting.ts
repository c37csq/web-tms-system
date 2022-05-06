/*
 * @Author: handsomeFu
 * @Date: 2021-11-12 15:29:41
 * @LastEditTime: 2021-11-12 15:31:52
 * @LastEditors: handsomeFu
 * @Description:
 */
import type { MultiTabsSetting } from '#/config';

import { computed } from 'vue';

import { useAppStore } from '@/store/modules/app';

export function useMultipleTabSetting() {
  const appStore = useAppStore();

  const getShowMultipleTab = computed(() => appStore.getMultiTabsSetting.show);

  const getShowQuick = computed(() => appStore.getMultiTabsSetting.showQuick);

  const getShowRedo = computed(() => appStore.getMultiTabsSetting.showRedo);

  const getShowFold = computed(() => appStore.getMultiTabsSetting.showFold);

  function setMultipleTabSetting(multiTabsSetting: Partial<MultiTabsSetting>) {
    appStore.setProjectConfig({ multiTabsSetting });
  }

  return {
    setMultipleTabSetting,
    getShowMultipleTab,
    getShowQuick,
    getShowRedo,
    getShowFold,
  };
}
