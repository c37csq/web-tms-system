export interface BasicClientScrollColumns {
  label: string;
  prop: string;
}

export const clientScrollColumns: BasicClientScrollColumns[] = [
  {
    label: '客户代码',
    prop: 'clientCode',
  },
  {
    label: '公司名称',
    prop: 'companyName',
  },
  {
    label: '销售代表',
    prop: 'sellRepresent',
  },
  {
    label: '客户代表',
    prop: 'serviceRepresent',
  },
  {
    label: '可用余额',
    prop: 'currentBalance',
  },
];
