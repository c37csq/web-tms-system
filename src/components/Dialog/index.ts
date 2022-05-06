/**
 * Created By fzq on 2021/11/19 15:14
 */
import { withInstall } from '@/utils';

export * from './src/typing';

import basicDialog from './src/BasicDialog.vue';
import pubDialog from './src/PubDialog.vue';

export const BasicDialog = withInstall(basicDialog);
export const PubDialog = withInstall(pubDialog);
