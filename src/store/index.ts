/*
 * @Author: handsomeFu
 * @Date: 2021-11-05 18:15:17
 * @LastEditTime: 2021-11-10 18:49:10
 * @LastEditors: handsomeFu
 * @Description:
 */
import type { App } from 'vue';
import { createPinia } from 'pinia';

const store = createPinia();

export function setupStore(app: App<Element>) {
  app.use(store);
}

export { store };
