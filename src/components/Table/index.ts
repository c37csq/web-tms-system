/*
 * @Author: handsomeFu
 * @Date: 2021-11-17 16:33:12
 * @LastEditTime: 2021-11-18 10:43:01
 * @LastEditors: handsomeFu
 * @Description:
 */
import { withInstall } from '@/utils';

export * from './src/typing';
export * from './src/const';

import basicTable from './src/BasicTable.vue';

export const BasicTable = withInstall(basicTable);
