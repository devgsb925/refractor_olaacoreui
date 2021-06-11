import { IVariants } from './i-variants';

export interface IOrderDetails
{
  brandName: string;
  lessReceived: boolean;
  modelName: string;
  notReceived: boolean;
  orderQty: number;
  overReceived: boolean;
  productDescription: string;
  productId: number;
  productNo: string;
  productNumber: string;
  productVariants: IVariants[];
  purchasingOrderDetailId: number;
  purchasingOrderId: number;
  recievedQty: number;
  recievedStatus: number;
  recover: number;
  remaining: number;
  remarks: string;
  shipmentDetailId: number;
  shipmentStatus: number;
  shippedQty: number;
  status: number;
  totalAmount: number;
  totalShippedQty: number;
  unitPrice: number;
  vendorId: number;
  vendorProductId: number;
  sku: string;

  productImage: string;
}
