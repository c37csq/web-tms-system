import { BasicTableColumn } from '@/components/Table/';

export const columns: BasicTableColumn[] = [
  { prop: 'name', label: '角色' },
  { prop: 'createId', label: '创建人' },
  { prop: 'createDate', label: '创建时间' },
  { prop: 'updateId', label: '修改人' },
  { prop: 'updateDate', label: '修改时间' },
  { prop: 'remarks', label: '备注' },
];
