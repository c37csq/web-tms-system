/**
 * Created By fzq on 2021/12/2 10:55
 * 暂时曲线救国  把 router 的 query 参数暂存
 */
import { defineStore } from 'pinia';
import { store } from '@/store';

interface ParamsState {
  clientCode: string;
  announcementVisible: boolean;
}

export const useParamsStore = defineStore({
  id: 'app-params',
  state: (): ParamsState => ({
    clientCode: '',
    announcementVisible: false,
  }),
  getters: {
    getClientCode(): string {
      return this.clientCode;
    },
    getAnnouncementVisible(): boolean {
      return this.announcementVisible;
    },
  },
  actions: {
    setClientCode(clientCode: string) {
      this.clientCode = clientCode;
    },
    setAnnouncementVisible(visible: boolean) {
      this.announcementVisible = visible;
    },
  },
});

// Need to be used outside the setup
export function useParamsStoreWithOut() {
  return useParamsStore(store);
}
