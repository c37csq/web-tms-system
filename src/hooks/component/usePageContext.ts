/*
 * @Author: handsomeFu
 * @Date: 2021-11-12 15:36:05
 * @LastEditTime: 2021-11-12 15:39:15
 * @LastEditors: handsomeFu
 * @Description:
 */
import type { InjectionKey, ComputedRef, Ref } from 'vue';
import { createContext, useContext } from '@/hooks/core/useContext';

export interface PageContextProps {
  contentHeight: ComputedRef<number>;
  pageHeight: Ref<number>;
  setPageHeight: (height: number) => Promise<void>;
}

const key: InjectionKey<PageContextProps> = Symbol();

export function createPageContext(context: PageContextProps) {
  return createContext<PageContextProps>(context, key, { native: true });
}

export function usePageContext() {
  return useContext<PageContextProps>(key);
}
