/**
 * Created By fzq on 2021/12/3 09:20
 */
export interface DragVerifyActionType {
  resume: () => void;
}

export interface PassingData {
  isPassing: boolean;
  time: number;
}

export interface MoveData {
  event: MouseEvent | TouchEvent;
  moveDistance: number;
  moveX: number;
}

export interface SlideVerifyExpose {
  show: () => void;
}
