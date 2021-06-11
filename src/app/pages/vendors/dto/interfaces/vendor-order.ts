export interface VendorOrder {
  contactName: string;
  dateCreate: string;
  hasUpdate: boolean;
  lastModified: Date;
  lessReceived: Date;
  modeOfPayment: string;
  notRecieved: boolean;
  orderId: number;
  orderStatus: number;
  overReceived: boolean
  pOInvoiceNo: string;
  paymentStatus: number;
  purchasingRefCurrencyTypeId: number;
  rate: number;
  recievedCount: number;
  recievedStatus: number;
  recoverBalance: number;
  referenceNo: string;
  shipmentCost: number;
  shipmentCount: number;
  shipmentStatus: number;
  totalAmount: number;
  totalItemsReceived: number;
  vendorId: number;
  vendorName: string;
}
