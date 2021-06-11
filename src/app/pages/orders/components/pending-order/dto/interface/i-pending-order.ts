import { IVariants } from './i-variants';

export interface IPendingOrder {
  brandName: string;
  costPrice: number;
  dateOfRequest: string;
  modelName: string;
  pendingOrderId: number;
  pendingOrderStatus: number;
  productDescription: string;
  productNo: string;
  reOrderQty: number;
  remarks: string;
  requestedQty: number;
  sku: string;
  stockId: number;
  stockQty: number;
  hasUpdate: boolean;
  hasSelect: boolean;
  vendorProductId: number;
  vendorId: number;
  otw: number;
  productImage: string;
}
