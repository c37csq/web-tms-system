import { h } from 'vue';
import { BasicTableColumn } from '@/components/Table/';

export const statusColumns: BasicTableColumn[] = [
  {
    label: '合同状态',
    prop: 'effectiveState',
    formatter: (_row, _column, cellValue) => {
      const value = ['未生效', '生效', '过期'][cellValue];
      const stateClass = ['', 'text-active', 'text-invalid'][cellValue];
      return h(
        'span',
        {
          class: stateClass,
        },
        value,
      );
    },
    width: 80,
  },
  {
    label: '企业状态',
    prop: 'enterpriseStatus', // 企业状态（0待审核、1审核通过、2停用、3审核不通过）
    formatter: (_row, _column, cellValue) => {
      const value = ['待审核', '审核通过', '停用', '审核不通过'][cellValue];
      const stateClass = ['', 'text-active', 'text-invalid', 'text-delete'][cellValue];
      return h(
        'span',
        {
          class: stateClass,
        },
        value,
      );
    },
    width: 90,
  },
];

export type CommandType =
  | 'batchWarehouse'
  | 'batchRepresent'
  | 'add'
  | 'edit'
  | 'review'
  | 'awaitReview'
  | 'represent'
  | 'warehouse'
  | 'apply'
  | 'fixed'
  | 'freeze'
  | 'priceMaintain'
  | 'status';

export type DialogType = 'warehouse' | 'represent' | 'account' | 'review' | 'apply' | 'balance' | 'priceMaintain';
