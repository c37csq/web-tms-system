/*
 * @Author: handsomeFu
 * @Date: 2021-11-08 16:17:33
 * @LastEditTime: 2021-11-15 09:25:37
 * @LastEditors: handsomeFu
 * @Description:
 */
import { genMessage } from '../helper';
import epLocale from 'element-plus/es/locale/lang/en';
import 'dayjs/locale/en';

const modules = import.meta.globEager('./en/**/*.ts');
export default {
  message: {
    ...genMessage(modules, 'en'),
    epLocale,
  },
};
