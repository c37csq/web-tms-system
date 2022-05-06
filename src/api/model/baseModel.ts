/*
 * @Author: handsomeFu
 * @Date: 2021-11-17 16:07:59
 * @LastEditTime: 2021-11-18 11:53:10
 * @LastEditors: handsomeFu
 * @Description:
 */
export interface BasicPageParams {
  pageNum: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

export interface BasicDataItem {
  createBy: string | null;
  createTime?: string | null;
  createDate?: string | null;
  updateBy: string | null;
  updateTime?: string | null;
  updateDate?: string | null;
}

export type ClientBaseType = {
  enterpriseRecordId: string;
  clientCode: string;
};

// 公共状态
export type CommonStatus = 'all';
