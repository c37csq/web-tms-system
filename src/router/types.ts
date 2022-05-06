/*
 * @Author: handsomeFu
 * @Date: 2021-11-08 09:57:29
 * @LastEditTime: 2021-11-16 17:00:05
 * @LastEditors: handsomeFu
 * @Description:
 */
import type { RouteRecordRaw, RouteMeta } from 'vue-router';
import { defineComponent } from 'vue';

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>);

// @ts-ignore
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string;
  meta: RouteMeta;
  component?: Component | string;
  components?: Component;
  children?: AppRouteRecordRaw[];
  props?: Recordable;
  fullPath?: string;
}

export interface RouteItem {
  id: string;
  path: string;
  component: any;
  meta: RouteMeta;
  pid?: string;
  name?: string;
  hidden?: boolean;
  disabled?: boolean; // tree data
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success';
  content?: string;
  dot?: boolean;
}

export interface Menu {
  id?: string;
  title?: string;
  name: string;
  icon?: string;
  path: string;
  // path contains param, auto assignment.
  paramPath?: string;
  disabled?: boolean;
  children?: Menu[];
  orderNo?: number;
  roles?: string[];
  hidden?: boolean;
  noShowingChildren?: boolean;
  meta?: Partial<RouteMeta>;
  tag?: MenuTag;
  pid?: string;
  hideMenu?: boolean;
  isSecondary?: boolean;
}

export interface MenuModule {
  orderNo?: number;
  menu: Menu;
}

// export type AppRouteModule = RouteModule | AppRouteRecordRaw;
export type AppRouteModule = AppRouteRecordRaw;
