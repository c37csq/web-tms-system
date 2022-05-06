import { BasicTableColumn } from '@/components/Table/';

export const columns: BasicTableColumn[] = [
  { prop: 'messageTitle', label: '标题' },
  {
    prop: 'clientCodes',
    label: '指定的客户代码',
    formatter(_row, _cell, cellValue) {
      return !!cellValue ? cellValue : '所有客户可看';
    },
  },
  {
    prop: 'compelStatus',
    label: '是否强制阅读',
    width: '140',
    formatter(_row, _cell, cellValue) {
      return !!+cellValue ? '是' : '否';
    },
  },
  { prop: 'createBy', label: '操作人', width: '140' },
  {
    prop: 'startTime',
    width: '320',
    label: '有效期',
    formatter(row) {
      return (
        <span>
          {row.startTime} - {row.endTime}
        </span>
      );
    },
  },
];
