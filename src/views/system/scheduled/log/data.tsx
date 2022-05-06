import { BasicTableColumn } from '@/components/Table/';
import { h } from 'vue';

export const columns: BasicTableColumn[] = [
  { prop: 'name', label: '任务名称' },
  { prop: 'targetBean', label: '执行的类' },
  { prop: 'targetMethod', label: '执行方法' },
  { prop: 'error', label: '异常消息' },
  {
    prop: 'status',
    label: '状态',
    formatter: (_row, _column, cellValue) => {
      const value = ['成功', '异常'][cellValue];
      const stateClass = ['text-publish', 'text-delete'][cellValue];
      return h(
        'span',
        {
          class: stateClass,
        },
        value,
      );
    },
  },
  {
    prop: 'times',
    label: '执行时间',
    formatter: (_row, _column, cellValue) => {
      return cellValue + ' ms' || '/';
    },
  },
  { prop: 'createDate', label: 'createDate' },
];
