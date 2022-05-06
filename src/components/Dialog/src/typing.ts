/**
 * Created By fzq on 2021/11/24 15:36
 */
export interface PubTableItem {
  action: number;
  id: number;
  newEndTime: string;
  newStartTime: string;
  oldEndTime: string;
  oldStartTime: string;
}

export type PubDialogState = {
  visible: boolean;
  canClick: boolean;
  data: PubTableItem[];
};

export interface DialogSubmitAction {
  showLoading: () => void;
  closeLoading: () => void;
  closeDialog: () => void;
}
