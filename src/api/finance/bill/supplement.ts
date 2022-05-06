/**
 * Created By fzq on 2021/12/3 10:52
 */
import { tmsHttp, blobFileHttp } from '@/utils/http/axios';

import {
  SupplementImportParams,
  SupplementListGetResultModel,
  SupplementSearchParams,
  SupplementStatusParams,
} from '@/api/finance/bill/model/billModel';
import { ContentTypeEnum } from '@/enums/httpEnum';

enum Api {
  Supplement = '/subOrderBills', // get list / post import / put 修改状态
  ImportSupplement = '/tms/subOrderBills',
  ImportDiff = '/tms/subOrderBills/diff', // 导入差异账单
  ImportAgain = '/tms/subOrderBills/other', // 二次补 收账单导入
  ReCosting = '/subOrderBills/subBillTrial', // 费用重计
  ExportBill = '/subOrderBills/export',
  ExportSellBill = '/subOrderBills/exportSell',
}

export const getSupplementListByPage = (params: SupplementSearchParams) =>
  tmsHttp.get<SupplementListGetResultModel>({
    url: Api.Supplement,
    params,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  });

export const importSupplementBill = (params: SupplementImportParams) =>
  tmsHttp.uploadFile(
    {
      url: Api.ImportSupplement,
    },
    params,
  );

export const changeSupplementBillStatus = (params: SupplementStatusParams) =>
  tmsHttp.put({
    url: `${Api.Supplement}?subBillsNumber=${params.subBillsNumber}&billStatus=${params.billStatus}`,
  });

// 费用重计 -- 差异账单导入后不能再重计
export const costReCosting = (subBillsNumber: string) =>
  tmsHttp.get({ url: Api.ReCosting, params: { subBillsNumber } });

// 二次导入
export const importAgainBill = (params: SupplementImportParams) =>
  tmsHttp.uploadFile(
    {
      url: `${Api.ImportAgain}?subBillNumber=${params.subBillNumber}`,
    },
    { file: params.file },
  );
export const importDiffBill = (params: SupplementImportParams) =>
  tmsHttp.uploadFile(
    {
      url: `${Api.ImportDiff}?subBillNumber=${params.subBillNumber}`,
    },
    { file: params.file },
  );

export const exportCostBill = (subBillsNumber: string) =>
  blobFileHttp.get({ url: Api.ExportBill, params: { subBillsNumber } });
export const exportSellBill = (subBillsNumber: string) =>
  blobFileHttp.get({ url: Api.ExportSellBill, params: { subBillsNumber } });
