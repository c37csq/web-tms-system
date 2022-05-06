/*
 * @Author: handsomeFu
 * @Date: 2021-11-11 09:40:34
 * @LastEditTime: 2021-11-11 09:40:34
 * @LastEditors: handsomeFu
 * @Description:
 */
import type { ComputedRef, Ref } from 'vue';

export type DynamicProps<T> = {
  [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
};
