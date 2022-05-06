/*
 * @Author: handsomeFu
 * @Date: 2021-11-16 18:39:58
 * @LastEditTime: 2021-11-16 18:45:46
 * @LastEditors: handsomeFu
 * @Description: Configure and register global directives
 */

import type { App } from 'vue';
import { setupPermissionDirective } from './permission';

export function setupGlobDirectives(app: App) {
  setupPermissionDirective(app);
}
