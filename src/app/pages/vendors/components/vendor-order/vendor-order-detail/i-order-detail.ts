import { IProduct } from "./i-product";

export interface IOrderDetail {
  invoiceNo: string;
  orderDetails: IProduct[];
  orderId: number;
  rate: number;
  recoverBalance: number;
  refCurrencyTypeId: number;
  shippingCount: number;
  totalAmount: number;
  totalShipmentCost: number;
  vendorId: number;
  vendorName: string;
}
