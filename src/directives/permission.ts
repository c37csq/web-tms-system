/*
 * @Author: handsomeFu
 * @Date: 2021-11-16 18:40:27
 * @LastEditTime: 2021-11-16 18:45:28
 * @LastEditors: handsomeFu
 * @Description: Global authority directive
 * Used for fine-grained control of component permissions
 */

import type { App, Directive, DirectiveBinding } from 'vue';

import { usePermission } from '@/hooks/web/usePermission';

/**
 * @Example v-auth="xx:xx" v-auth="['xx:xx']"
 */
function isAuth(el: Element, binding: any) {
  const { hasPermission } = usePermission();

  const value = binding.value;
  if (!value) return;
  if (!hasPermission(value)) {
    el.parentNode?.removeChild(el);
  }
}

const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  isAuth(el, binding);
};

const authDirective: Directive = {
  mounted,
};

export function setupPermissionDirective(app: App) {
  app.directive('auth', authDirective);
}

export default authDirective;
