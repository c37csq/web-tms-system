import { BasicTableColumn } from '@/components/Table/';
import { dateUtil } from '@/utils/dateUtil';
import { h, ref } from 'vue';

export const columns = ref<BasicTableColumn[]>([
  {
    label: '账单号',
    prop: 'billsNumber',
    formatter: (_row, _column, cellValue) => {
      return cellValue;
    },
  },
  {
    label: '账单时间',
    prop: 'billsDate',
    formatter: (_row, _column, cellValue) => {
      return dateUtil(cellValue).format('YYYY-MM-DD');
    },
  },
  {
    label: '客户代码',
    prop: 'clientCode',
    formatter: (_row, _column, cellValue) => {
      return cellValue;
    },
  },
  {
    label: '金额',
    prop: 'billsMoney',
    formatter: (_row, _column, cellValue) => {
      return h('span', { class: 'text-publish' }, cellValue);
    },
  },
  {
    label: '状态',
    prop: 'billStatus',
    formatter: (_row, _column, cellValue) => {
      const value = ['待确认', '确认', '作废'][cellValue];
      const stateClass = ['text-invalid', 'text-active', 'text-delete'][cellValue];
      return h('span', { class: stateClass }, value);
    },
  },
  {
    label: '操作人',
    prop: 'createBy',
    formatter: (_row, _column, cellValue) => {
      return cellValue || '/';
    },
  },
  {
    label: '更新时间',
    prop: 'createTime',
    formatter: (_row, _column, cellValue) => {
      return dateUtil(cellValue).format('YYYY-MM-DD');
    },
  },
  {
    label: '更新人',
    prop: 'updateBy',
    formatter: (_row, _column, cellValue) => {
      return cellValue || '/';
    },
  },
]);
