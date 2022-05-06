/*
 * @Author: handsomeFu
 * @Date: 2021-11-18 09:58:28
 * @LastEditTime: 2021-11-18 14:19:16
 * @LastEditors: handsomeFu
 * @Description:
 */
export interface BasicTableColumn {
  prop: string;
  label: string;
  width?: number | string;
  fixed?: boolean;
  isShow?: boolean;
  sortable?: boolean;
  formatter?: (row: any, column: any, cellValue: any) => any;
}
