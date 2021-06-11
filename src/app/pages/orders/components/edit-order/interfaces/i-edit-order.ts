import { IOrderDetails } from './i-order-details';

export interface IEditOrder {
  currencyType: string;
  invoiceNo: string;
  orderDetails: IOrderDetails[];
  orderId: number;
  purchasingExchangeRateId: number;
  rateToKip: number;
  rateToKipString: string;
  recoverBalance: number;
  shippingCount: number;
  totalAmount: number;
  totalShipmentCost: number;
  vendorId: number;
  vendorName: string;
}
