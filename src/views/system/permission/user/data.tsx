/*
 * @Author: handsomeFu
 * @Date: 2021-11-18 10:40:41
 * @LastEditTime: 2021-11-18 15:59:44
 * @LastEditors: handsomeFu
 * @Description: UserManagement
 */
import { h } from 'vue';
import { BasicTableColumn } from '@/components/Table/';
import { RoleListItem } from '@/api/system';

export const columns: BasicTableColumn[] = [
  { prop: 'loginName', label: '账号' },
  { prop: 'nickName', label: '姓名' },
  { prop: 'email', label: '邮箱' },
  { prop: 'tel', label: '电话' },
  {
    prop: 'roleLists',
    label: '角色',
    formatter: (_row, _col, cellValue) => {
      return cellValue.map((e: RoleListItem) => e.name).join(',');
    },
  },
  {
    prop: 'locked',
    label: '状态',
    formatter: (_row, _col, cellValue) => {
      const value = ['可用', '禁用'][+cellValue];
      const stateClass = ['text-active', 'text-delete'][+cellValue];
      return h(
        'span',
        {
          class: stateClass,
        },
        value,
      );
    },
  },
  { prop: 'createDate', label: '创建时间' },
];
