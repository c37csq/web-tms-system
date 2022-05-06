/*
 * @Author: handsomeFu
 * @Date: 2021-11-08 15:53:39
 * @LastEditTime: 2021-11-08 15:53:40
 * @LastEditors: handsomeFu
 * @Description:
 */

/**
 * Get the configuration file variable name
 * @param env
 */
export const getConfigFileName = (env: Record<string, any>) => {
  return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || '__APP'}__CONF__`.toUpperCase().replace(/\s/g, '');
};
