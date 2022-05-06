/**
 * isAdd: 是否新增 isEdit: 是否编辑 isSaveAs: 是否另存为 isLook: 是否查看
 */
export type OperateTypeText = 'isAdd' | 'isEdit' | 'isSaveAs' | 'isLook';

export type OperateTypeTextMap = Partial<Record<OperateTypeText, string>>;

export enum OperateTypeEnum {
  IsAdd = 'isAdd',
  IsEdit = 'isEdit',
  IsSaveAs = 'isSaveAs',
  IsLook = 'isLook',
}
export const OperateTypeTitleMap: OperateTypeTextMap = {
  isAdd: '新增',
  isEdit: '编辑',
  isSaveAs: '另存为',
  isLook: '查看',
};

/**
 * 通用type
 * add 添加  edit 编辑
 * discard 废弃 batchDiscard 批量废弃
 * import 导入 export 导出
 * review 审核 batchReview 批量审核 look 查看
 * saveAS 另存为  saveReview 保存并审核 log: 日志
 * @description 区别在于 ActionType 则会具有 record 数据
 */
export type CommonActionType = 'edit' | 'discard' | 'look' | 'review' | 'log' | 'saveAs';
export type CommonBtnType = 'add' | 'import' | 'export' | 'saveReview' | 'batchReview' | 'batchDiscard';

export type UserManagementType = 'add' | 'edit' | '';
