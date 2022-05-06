/*
 * @Author: handsomeFu
 * @Date: 2021-11-18 10:15:26
 * @LastEditTime: 2021-11-18 10:15:26
 * @LastEditors: handsomeFu
 * @Description:
 */
export interface FormColProps {
  span?: number;
  offset?: number;
  push?: number;
  pull?: number;
  xs?: number | IObj;
  sm?: number | IObj;
  md?: number | IObj;
  lg?: number | IObj;
  xl?: number | IObj;
  tag?: string;
}

export type FormComponent =
  | 'Radio'
  | 'RadioGroup'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'Input'
  | 'InputNumber'
  | 'Select'
  | 'Cascader'
  | 'Switch'
  | 'Slider'
  | 'TimePicker'
  | 'DatePicker'
  | 'Rate'
  | 'ColorPicker'
  | 'Transfer'
  | 'Divider';

export interface FormOptionsConfig {
  label: string; // 名称
  value: string | number; // 值
  disabled?: boolean; // 是否禁用
  key?: string | number; // 唯一标识
  children?: FormOptionsConfig[];
}

export interface FormOptionsField {
  labelField?: string; // label别名
  valueField?: string; // value 别名
}

export type FormValueType = string | number | string[] | number[] | boolean | null;

export interface FormSchemaConfig {
  field: string; // 字段名
  label?: string; // label名
  colProps?: FormColProps; // el-col props
  formItemProps?: IObj; // form-item的props
  component?: FormComponent; // 组件名称
  componentProps?: IObj; // 组件对应的props
  value?: FormValueType; // 值
  options?: FormOptionsConfig[] | any; // 下拉项
  optionsField?: FormOptionsField; // 下拉项别名
  onChange?: (T: IObj) => void; // change事件
  hidden?: boolean; // 是否隐藏
}
