/*
 * @Author: handsomeFu
 * @Date: 2021-11-16 10:44:16
 * @LastEditTime: 2021-11-16 11:45:28
 * @LastEditors: handsomeFu
 * @Description:
 */
import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

export const AppLogo = createAsyncComponent(() => import('./AppLogo.vue'), { loading: true });

export const NavbarItem = createAsyncComponent(() => import('./NavbarItem.vue'));
