/*
 * @Author: handsomeFu
 * @Date: 2021-11-11 14:51:24
 * @LastEditTime: 2021-11-11 14:51:24
 * @LastEditors: handsomeFu
 * @Description:
 */
import type { TransitionSetting } from '#/config';

import { computed } from 'vue';

import { useAppStore } from '@/store/modules/app';

export function useTransitionSetting() {
  const appStore = useAppStore();

  const getEnableTransition = computed(() => appStore.getTransitionSetting?.enable);

  const getOpenNProgress = computed(() => appStore.getTransitionSetting?.openNProgress);

  const getOpenPageLoading = computed((): boolean => {
    return !!appStore.getTransitionSetting?.openPageLoading;
  });

  const getBasicTransition = computed(() => appStore.getTransitionSetting?.basicTransition);

  function setTransitionSetting(transitionSetting: Partial<TransitionSetting>) {
    appStore.setProjectConfig({ transitionSetting });
  }
  return {
    setTransitionSetting,

    getEnableTransition,
    getOpenNProgress,
    getOpenPageLoading,
    getBasicTransition,
  };
}
