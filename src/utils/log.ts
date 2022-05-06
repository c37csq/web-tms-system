/*
 * @Author: handsomeFu
 * @Date: 2021-11-08 15:54:51
 * @LastEditTime: 2021-11-08 15:56:06
 * @LastEditors: handsomeFu
 * @Description:
 */
const projectName = import.meta.env.VITE_GLOB_APP_TITLE;

export function warn(message: string) {
  console.warn(`[${projectName} warn]:${message}`);
}

export function error(message: string) {
  throw new Error(`[${projectName} error]:${message}`);
}
