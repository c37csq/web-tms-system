/*
 * @Author: handsomeFu
 * @Date: 2021-11-09 16:08:11
 * @LastEditTime: 2021-11-09 16:08:12
 * @LastEditors: handsomeFu
 * @Description:
 */
/**
 * @description: Request result set
 */
export enum ResultEnum {
  SUCCESS = 1,
  ERROR = 32,
  TIMEOUT = 401,
  FILE_SOME_SUCCESS = 60, // 文件部分导入成功
  FILE_ERROR = 61, // 文件导入失败
  UN_AUTH = 57, // 无授权
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  contentTyp
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
