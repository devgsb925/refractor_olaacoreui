import { IVariants } from './i-variants';

export interface IShipmentDetail
{
  barcode: string;
  brand: string;
  hasUpdate: boolean;
  modelName: string;
  orderDetailId: number;
  orderDetailsId: 0;
  orderId: number;
  orderQty: number;
  productDescription: string;
  productId: number;
  productNo: string;
  productVariants: IVariants[];
  purchasingShipmentDetailId: number;
  purchasingShipmentId: number;
  recievedQty: number;
  remainingQty: number;
  remarks: string;
  select: boolean;
  shipmentDate: string;
  shipmentDetailStatus: number;
  shippedQty: number;
  vendorId: number;
}
