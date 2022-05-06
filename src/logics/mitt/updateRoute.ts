/**
 * Created By fzq on 2021/11/29 18:50
 */
import mitt from '@/utils/mitt';

const emitter = mitt();

export function closeDetailRoute() {
  emitter.emit('close');
}

export function listPageListener(callback: () => void) {
  emitter.on('close', callback);
}
