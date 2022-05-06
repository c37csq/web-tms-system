/**
 * Created By fzq on 2021/11/22 13:36
 */
import { unref } from 'vue';
import { MenuItem } from '@/api/system';
import type { ElForm } from 'element-plus';

export function formValidate(formRef) {
  return new Promise((resolve) => {
    unref(formRef)?.validate((isValid: boolean) => {
      if (!isValid) return;
      resolve(true);
    });
  });
}
export function formResetFields(formRef) {
  return unref(formRef)?.resetFields();
}

export const submitForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  return new Promise((resolve) => {
    formEl.validate((valid) => {
      if (!valid) return;
      resolve(true);
    });
  });
};

export const resetForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

/**
 *
 * @param data
 * @return {FormData}
 */
export const json2form = (data = {}) => {
  const fm = new FormData();
  for (const key in data) {
    if (data[key] === undefined) {
      continue;
    }
    fm.append(key, data[key]);
  }
  return fm;
};

/**
 * @param menuList 菜单数据
 * @description 扁平化菜单 获取所有的id
 */
export function getAllMenuIds(menuList) {
  const allMenuIds: string[] = [];
  const flatten = (menuList: MenuItem[]) => {
    menuList.map((item) => {
      if (item.children && item.children.length) {
        flatten(item.children);
      } else {
        allMenuIds.push(item.id);
      }
      return null;
    });
    return allMenuIds;
  };
  return flatten(menuList);
}

/**
 * 过滤值
 * @param key
 * @param list
 * @param listValKey
 * @param listLabelKey
 * @return {*}
 */
export const findNameById = (key, list, listValKey, listLabelKey) => {
  if (Array.isArray(list)) {
    return list.find((e) => e[listValKey]?.toString() === key?.toString())?.[listLabelKey];
  }
  return '';
};

/**
 * 获取两个数组的差级
 * @param maxArr 最大的数组
 * @param minArr 最小的数组
 * @return {[]}
 */
export const getArrayDifference = (maxArr: any[], minArr: any[]) => {
  return maxArr.filter(function (item) {
    const temp = minArr.map((e) => e.id);
    return !temp.includes(item.id);
  });
};

/**
 * 数字展示千位分割形式 123456 ==> 123,456
 * @param value
 * @return {string}
 */
export const digitallyReplaceThousands = (value: string | number): string => {
  if (!value) return value + '';
  return value.toString().replace(/\d+/, function (n) {
    // 先提取整数部分
    return n.replace(/(?=(\B\d{3})+$)/g, function ($1) {
      return $1 + ',';
    });
  });
};
