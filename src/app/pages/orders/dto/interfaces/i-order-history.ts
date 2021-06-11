export interface IOrderHistory {
  orderId: number;
  referenceNo: string;
  pOInvoiceNo: string;
  dateCreate: string;
  lastModified: string;
  vendorId: number;
  vendorName: string;
  contactName: string;
  shipmentCount: number;
  orderStatus: number;
  totalAmount: number;
  recoverBalance: number;
  shipmentCost: number;
  modeOfPayment: string;
  hasUpdate: boolean;
  totalItemsReceived: number;
  paymentStatus: number;
  shipmentStatus: number;
  recievedCount: number;
  recievedStatus: number;
  purchasingRefCurrencyTypeId: number;
  notRecieved: boolean;
  lessReceived: boolean;
  overReceived: boolean;
  rate: number;
}
