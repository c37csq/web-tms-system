/**
 * Created By fzq on 2021/12/3 11:23
 */
import { tmsHttp, blobFileHttp } from '@/utils/http/axios';
import {
  BillChangeStatusParams,
  BillGenBillParams,
  BillListGetResultModel,
  BillSearchByCodeParams,
  BillSearchItem,
  BillSearchParams,
} from '@/api/finance/bill/model/billModel';

enum Api {
  Bill = '/orderBills',
  SearchBill = '/orderBills/notCreate',
  ExportBill = '/orderBills/export',
}

export const getBillListByPage = (params: BillSearchParams) =>
  tmsHttp.get<BillListGetResultModel>({ url: Api.Bill, params });

export const searchBillByCode = (params: BillSearchByCodeParams) =>
  tmsHttp.get<BillSearchItem[]>({ url: Api.SearchBill, params });

export const genBill = (params: BillGenBillParams) => tmsHttp.post({ url: Api.Bill, params });
export const changeBillStatus = (params: BillChangeStatusParams) =>
  tmsHttp.put({
    url: `${Api.Bill}?billNumber=${params.billNumber}&billStatus=${params.billStatus}`,
  });
export const exportBill = (params: { billsNumber: string }) => blobFileHttp.get({ url: Api.ExportBill, params });
