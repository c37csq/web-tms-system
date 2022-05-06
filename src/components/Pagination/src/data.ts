/*
 * @Author: handsomeFu
 * @Date: 2021-11-18 09:58:28
 * @LastEditTime: 2021-11-18 14:19:16
 * @LastEditors: handsomeFu
 * @Description:
 */
import { reactive } from 'vue';

/**
 * @description: 分页初始数据
 * @param pageSize
 */
export const pageData = (pageSize = 10) => {
  return reactive({
    pageSize,
    pageNum: 1,
    total: 0,
  });
};
