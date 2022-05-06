import { BasicTableColumn } from '@/components/Table/';
import { h } from 'vue';

export const columns: BasicTableColumn[] = [
  { prop: 'name', label: '任务名称' },
  { prop: 'cron', label: '任务表达式' },
  { prop: 'targetBean', label: '执行的类' },
  { prop: 'targetMethod', label: '执行方法' },
  { prop: 'remarks', label: '备注' },
  {
    prop: 'status',
    label: '任务状态',
    formatter: (_row, _column, cellValue) => {
      const value = ['正常', '暂停'][cellValue];
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
  { prop: 'createDate', label: '创建日期' },
];
