/*
 * @Author: handsomeFu
 * @Date: 2021-11-08 15:34:45
 * @LastEditTime: 2021-11-15 16:48:34
 * @LastEditors: handsomeFu
 * @Description:
 */
import type { LocaleSetting, LocaleType } from '#/config';

export const LOCALE: { [key: string]: LocaleType } = {
  ZH_CN: 'zh_CN',
  EN_US: 'en',
};

export const localeSetting: LocaleSetting = {
  showPicker: true,
  // Locale
  locale: LOCALE.ZH_CN,
  // Default locale
  fallback: LOCALE.ZH_CN,
  // available Locales
  availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US],
};

interface LocalItem {
  label: string;
  value: LocaleType;
}

// locale list
export const localeList: LocalItem[] = [
  {
    label: '简体中文',
    value: LOCALE.ZH_CN,
  },
  {
    label: 'English',
    value: LOCALE.EN_US,
  },
];
