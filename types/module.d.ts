/*
 * @Author: handsomeFu
 * @Date: 2021-11-05 14:45:18
 * @LastEditTime: 2021-11-10 18:47:26
 * @LastEditors: handsomeFu
 * @Description:
 */
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const Component: DefineComponent<{}, {}, any>;
  export default Component;
}
