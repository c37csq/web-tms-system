/*
 * @Author: handsomeFu
 * @Date: 2021-11-15 15:06:55
 * @LastEditTime: 2021-11-18 15:27:02
 * @LastEditors: handsomeFu
 * @Description:
 */
import { withInstall } from '@/utils';
import ExportBtn from './src/ExportButton.vue';
import ImportBtn from './src/ImportButton.vue';
import DangerBtn from './src/DangerButton.vue';
import SearchBtn from './src/SearchButton.vue';
import AddBtn from './src/AddButton.vue';
import ResetBtn from './src/ResetButton.vue';

export const SearchButton = withInstall(SearchBtn);
export const ExportButton = withInstall(ExportBtn);
export const ImportButton = withInstall(ImportBtn);
export const DangerButton = withInstall(DangerBtn);
export const AddButton = withInstall(AddBtn);
export const ResetButton = withInstall(ResetBtn);
