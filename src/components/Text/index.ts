/**
 * Created By fzq on 2021/11/23 16:25
 */
import { withInstall } from '@/utils';

import effectiveStatusText from './src/EffectiveStatusText.vue';
import statusText from './src/StatusText.vue';

export const EffectiveStatusText = withInstall(effectiveStatusText);
export const StatusText = withInstall(statusText);
