/*
 * @Author: handsomeFu
 * @Date: 2021-11-15 14:10:44
 * @LastEditTime: 2021-11-16 10:13:20
 * @LastEditors: handsomeFu
 * @Description:
 */
import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

export const DownloadBtn = createAsyncComponent(() => import('./DownloadBtn.vue'));

export const UserDropdown = createAsyncComponent(() => import('./UserDropdown.vue'));

export const ToggleLanguage = createAsyncComponent(() => import('./ToggleLanguage.vue'));
