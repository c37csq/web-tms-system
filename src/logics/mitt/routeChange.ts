/*
 * @Author: handsomeFu
 * @Date: 2021-11-11 14:41:24
 * @LastEditTime: 2021-11-12 16:08:41
 * @LastEditors: handsomeFu
 * @Description:
 */
import type { RouteLocationNormalized } from 'vue-router';

import mitt from '@/utils/mitt';
import { getRawRoute } from '@/utils';

const emitter = mitt();

const key = Symbol();

let lastChangeTab: RouteLocationNormalized;

export function setRouteChange(lastChangeRoute: RouteLocationNormalized) {
  const r = getRawRoute(lastChangeRoute);
  emitter.emit(key, r);
  lastChangeTab = r;
}

export function listenerRouteChange(callback: (route: RouteLocationNormalized) => void, immediate = true) {
  emitter.on(key, callback);
  immediate && lastChangeTab && callback(lastChangeTab);
}

export function removeTabChangeListener() {
  emitter.clear();
}
