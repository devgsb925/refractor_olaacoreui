import { Iproduct } from "./iproduct";

export interface IInvoiceDetail {
    invoiceId: number;
    sellDate: Date;
    operatorName: string;
    sellMethod: string;
    customerName: string;
    paymentMethod: string;
    saleNote: string;
    products: Iproduct[];
    total: number;
    tax: number;
    discount: number;
    shippingCost: number;
    grandTotal: number;
    totalRecevied: number;
    cash: number;
    balance: number;
    changeAmount: number;
    invoiceStatus: number;
    bankName: string;
    bank: number
    sellingType: string;
    invoiceNo: string;
    customerPhoneNo: string;
    customerId: number;
    cancelDate: Date;
    cancelBy: string;
    charge: number;
    services: {
    serviceId: number;
    serviceCode: string;
    description: string;
    fee: number;
  }[]


  leasingName: string;
}
