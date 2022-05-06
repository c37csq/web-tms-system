/*
 * @Author: handsomeFu
 * @Date: 2021-11-10 11:44:56
 * @LastEditTime: 2021-11-11 15:54:26
 * @LastEditors: handsomeFu
 * @Description:
 */
// import { ExtractPropTypes } from 'vue';
import { h } from 'vue';
import { ElMessage, ElMessageBox, ElNotification, ElLoading } from 'element-plus';
// import { MessageProps } from 'element-plus/lib/components/message';
import { ElMessageBoxOptions } from 'element-plus/lib/components/message-box';
import { LoadingOptions } from 'element-plus/es/components/loading';

import { isString } from '@/utils/is';
import { useI18n } from './useI18n';

function getBaseOptions() {
  const { t } = useI18n();
  return {
    confirmButtonText: t('common.okText'),
  };
}

function renderMessage({ message }: Pick<ElMessageBoxOptions, 'message'>) {
  if (isString(message)) {
    return h('div', {}, message);
  } else {
    return message;
  }
}

type MessageType = 'success' | 'error' | 'warning' | 'info';

function createConfirm(options: ElMessageBoxOptions) {
  const type = options.type || 'warning';
  return ElMessageBox({ ...getBaseOptions(), ...options, showCancelButton: true, type });
}

function createAlertOptions(options: ElMessageBoxOptions, type: MessageType) {
  return {
    ...getBaseOptions(),
    message: renderMessage(options),
    type,
    ...options,
  };
}

function createSuccessAlert(options: ElMessageBoxOptions) {
  return ElMessageBox(createAlertOptions(options, 'success'));
}

function createErrorAlert(options: ElMessageBoxOptions) {
  return ElMessageBox(createAlertOptions(options, 'error'));
}

function createWarningAlert(options: ElMessageBoxOptions) {
  return ElMessageBox(createAlertOptions(options, 'warning'));
}

function createInfoAlert(options: ElMessageBoxOptions) {
  return ElMessageBox(createAlertOptions(options, 'info'));
}

function createLoading(options: LoadingOptions, isCustomClose: boolean, timer = 2000) {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
    ...options,
  });
  if (isCustomClose) {
    return loadingInstance;
  } else {
    setTimeout(() => {
      loadingInstance.close();
    }, timer);
  }
}

function createBriefSuccessMsg(message: string) {
  return ElMessage.success({ duration: 1500, message });
}

export function useMessage() {
  return {
    createMessage: ElMessage,
    createBriefSuccessMsg,
    notification: ElNotification,
    createConfirm,
    createSuccessAlert,
    createErrorAlert,
    createWarningAlert,
    createInfoAlert,
    createLoading,
  };
}
