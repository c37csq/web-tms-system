/**
 * Created By fzq on 2021/11/23 17:18
 */
import { nextTick, onMounted, onActivated } from 'vue';

export function useMountedOrActivated(hook: Fn) {
  let mounted: boolean;

  onMounted(() => {
    hook();
    nextTick(() => {}).then(() => {
      mounted = true;
    });
  });

  onActivated(() => {
    if (mounted) {
      hook();
    }
  });
}
