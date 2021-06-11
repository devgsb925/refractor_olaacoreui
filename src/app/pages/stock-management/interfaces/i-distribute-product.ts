import { IUid } from "./i-uid";
export interface IDistributeProduct {
  pId: number;
  sku: string;
  productDesc: string;
  uidName: string;
  stockQty: number;
  unitInWarehouse: number;
  unitInDisplay: number;
  unitInDemo: number;
  unitInQc: number;
  unsave: boolean;
  moveBy: string;
  requestBy: string;
  moveFrom: string;
  movedQty: number;
  to: string;
  remarks: string;
  uidType: string; //imei //s //mac
  uid: IUid[]; // []
  masterUidList: IUid[];
}
