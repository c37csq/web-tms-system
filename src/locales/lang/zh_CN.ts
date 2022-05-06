/*
 * @Author: handsomeFu
 * @Date: 2021-11-08 16:17:46
 * @LastEditTime: 2021-11-15 09:25:43
 * @LastEditors: handsomeFu
 * @Description:
 */
import { genMessage } from '../helper';
import epLocale from 'element-plus/es/locale/lang/zh-cn';
import 'dayjs/locale/zh-cn';

const modules = import.meta.globEager('./zh-CN/**/*.ts');
export default {
  message: {
    ...genMessage(modules, 'zh-CN'),
    epLocale,
  },
};
