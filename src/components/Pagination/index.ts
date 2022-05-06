/*
 * @Author: handsomeFu
 * @Date: 2021-11-17 16:33:12
 * @LastEditTime: 2021-11-18 10:43:01
 * @LastEditors: handsomeFu
 * @Description: Created By fzq on 2021/11/18 18:04
 */
import { withInstall } from '@/utils';

import basicPagination from './src/BasicPagination.vue';

export const BasicPagination = withInstall(basicPagination);

export * from './src/data';

export interface PageChangeParams {
  pageSize?: number;
  pageNum?: number;
}
