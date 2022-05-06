import { reactive } from 'vue';
import { UploadApiResult } from './model/uploadModel';
import { tmsHttp } from '@/utils/http/axios';
import { UploadFileParams } from '#/axios';
import { useGlobSetting } from '@/hooks/setting';

const { uploadUrl = '' } = useGlobSetting();

/**
 * @description: Upload interface
 */
export function uploadApi(params: UploadFileParams, onUploadProgress: (progressEvent: ProgressEvent) => void) {
  return tmsHttp.uploadFile<UploadApiResult>(
    {
      url: uploadUrl,
      onUploadProgress,
    },
    params,
  );
}

/**
 * @description 导入接口
 */
export enum UploadApi {
  Warehouse = '/tms_api/sys/basics/warehouses/list', // 导入仓库
  ServiceWeight = '/tms_api/sys/product/weight/temps', // 导入重量段
  OdaRule = '/tms_api/sys/basics/oda/detail/list', // 导入 oda 规则
  Postcode = ' /tms_api/sys/product/charge/partitions', // 导入邮编
  CostFare = ' /tms_api/costPrice/batch', // 导入成本运费
  SaleFare = ' /tms_api/sellSalesPrice/batch', // 导入销售运费
  OpenAccount = '/tms_api/sys/client/client/infos', // 账户批量开户
  CostBill = ' /tms_api/orderBills/batch', // 成本账单导入u
  CommonUpload = '/tms_api/sys/remittance/file/uploading', // 传入文件返回华为云地址
}

/**
 * 公共导入
 * @param url
 * @param params
 */
export function commonUpload(url: string, params: UploadFileParams) {
  return tmsHttp.uploadFile({ url }, params);
}

/**
 * 文件导入公共数据
 * @param action
 * @param params
 * @param templateUrl
 */
interface ImportDialogParams {
  [key: string]: any;
}
export const importDialogState = (action: string, templateUrl?: string, params?: ImportDialogParams) => {
  return reactive({
    visible: false,
    action,
    templateUrl,
    params,
  });
};
