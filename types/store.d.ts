/*
 * @Author: handsomeFu
 * @Date: 2021-11-08 15:58:59
 * @LastEditTime: 2021-11-11 14:05:20
 * @LastEditors: handsomeFu
 * @Description:
 */
import { ErrorTypeEnum } from '@/enums/exceptionEnum';

export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

export interface UserInfo {
  clientCode: string;
  createDate: string;
  createId: string;
  delFlag: boolean;
  email: string;
  enterpriseRecordId: string;
  id: string;
  lastChangePasswordTime: string | null;
  loginName: string;
  menuJsonStr: string;
  nickName: string;
  qq: string;
  remarks: string | null;
  tel: string;
  roleLists: RoleItem[];
  homePath?: string;
  locked: boolean;
}

export interface RoleItem {
  id: string;
  name: string;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}
