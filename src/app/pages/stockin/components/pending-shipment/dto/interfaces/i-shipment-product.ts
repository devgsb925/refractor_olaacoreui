import { IVariants } from './../../../../../../shared/interfaces/i-variants';
export interface IShipmentProduct {
  orderId: number;
  productId: number;
  productDescription: string;
  productNo: string;
  productVariants: IVariants[];
  brandName: string;
  shippedQty: number;
  receivedQty: number;
  barcode: string;
  remarks: string;
  hasUpdate: boolean;
  newStatus: boolean;
  shipmentDetailId: number;
  lockStatus: boolean;
}
