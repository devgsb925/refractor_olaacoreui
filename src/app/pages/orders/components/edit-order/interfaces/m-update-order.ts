import { MUpdateOrderDetail } from './m-update-order-detail';

export interface MUpdateOrder {
  orderId: number;
  invoiceNo: string;
  purchasingRefCurrencyTypeId: number;
  rate: number;
  totalAmount: number;
  recoverBalance: number;
  shipmentCost: number;
  orderDetails: MUpdateOrderDetail[];
}
