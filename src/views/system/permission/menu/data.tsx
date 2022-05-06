import { h } from 'vue';
import { BasicTableColumn } from '@/components/Table/';

export const columns: BasicTableColumn[] = [
  { prop: 'title', label: '标题 ' },
  { prop: 'name', label: 'name' },
  { prop: 'path', label: 'path' },
  { prop: 'permission', label: '权限' },
  { prop: 'component', label: '组件地址' },
  { prop: 'sort', label: '排序' },
  {
    prop: 'hideMenu',
    label: '是否隐藏',
    formatter(_row, _cell, cellValue) {
      return h(
        'span',
        {
          class: ['', 'text-publish'][+cellValue],
        },
        cellValue ? '是' : '否',
      );
    },
  },
  {
    prop: 'path',
    label: '类型',
    formatter(_row, _cell, cellValue) {
      return cellValue ? '菜单' : '按钮';
    },
  },
  {
    prop: 'isSecondary',
    label: '是否是二级菜单',
    width: '140',
    formatter(_row, _cell, cellValue) {
      return cellValue ? '是' : '否';
    },
  },
  {
    prop: 'ignoreKeepAlive',
    label: '是否忽略缓存',
    width: '140',
    formatter(_row, _cell, cellValue) {
      return cellValue ? '是' : '否';
    },
  },
];

export const menuIconList = [
  { id: 1, label: '首页', icon: 'home' },
  { id: 2, label: '客户管理', icon: 'customer' },
  { id: 3, label: '订单管理', icon: 'order' },
  { id: 4, label: '费用管理', icon: 'expenses' },
  { id: 5, label: '财务结算', icon: 'finance' },
  { id: 6, label: '物流管理', icon: 'logistics' },
  { id: 7, label: '报表管理', icon: 'report' },
  { id: 8, label: '系统设置', icon: 'setting' },
];
