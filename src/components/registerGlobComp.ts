/*
 * @Author: handsomeFu
 * @Date: 2021-11-15 14:44:36
 * @LastEditTime: 2021-11-18 15:27:15
 * @LastEditors: handsomeFu
 * @Description:
 */
import type { App } from 'vue';
import { SearchButton, ResetButton, AddButton, DangerButton } from './Button';
import { BasicPagination } from './Pagination';
import { BasicDialog } from './Dialog';
import { BasicFilterSearch } from './Form';
import { EffectiveStatusText, StatusText } from './Text';

export function registerGlobComp(app: App) {
  app.component('BasicFilterSearch', BasicFilterSearch);
  app
    .use(SearchButton)
    .use(ResetButton)
    .use(AddButton)
    .use(DangerButton)
    .use(BasicPagination)
    .use(BasicDialog)
    .use(EffectiveStatusText)
    .use(StatusText);
}
