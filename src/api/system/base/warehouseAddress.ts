/**
 * Created By fzq on 2021/11/25 16:21
 */
import { tmsHttp } from '@/utils/http/axios';
import { WarehouseSearchParams, WarehouseListGetResultModel, WarehouseParams } from '@/api/system';

enum Api {
  List = '/sys/basics/warehouses/list',
  Warehouse = '/sys/basics/warehouses',
}

export const getWarehouseByPage = (params: WarehouseSearchParams) =>
  tmsHttp.get<WarehouseListGetResultModel>({ url: Api.List, params });

export const addWarehouse = (params: WarehouseParams) => tmsHttp.post({ url: Api.Warehouse, params });
export const updateWarehouse = (params: WarehouseParams) => tmsHttp.put({ url: Api.Warehouse, params });
export const delWarehouse = (id: number) => tmsHttp.delete({ url: `${Api.Warehouse}?warehouseId=${id}` });
