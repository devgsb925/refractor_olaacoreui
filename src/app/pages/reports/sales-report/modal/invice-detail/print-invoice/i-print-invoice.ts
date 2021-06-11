export interface IPrintInvoice {
  invoiceId: number;
  paymentMethod: string; // 0 cash 1 bank
  invoiceNo: string;
  sellDate: Date;
  customerId: number;
  customerName: string;
  phoneNumber: string;
  productList: {
    productId: number;
    productDescription: string;
    productVariants: string;
    modelName: string;
    srp: number;
    rrp: number;
    sellQty: number;
    uidList: string[];
    free: boolean;
  }[];
  totalAmount: number;
  discountAmount: number;
  grandTotalAmount: number;
  paidAmount: number;
  changeAmount: number;
  bankName: string;
  shippingCost: number;
  sellingType: string;
  leasingName: string;
  charge: number;
  // saleRemarks: string;
  services:{
    serviceId: number;
    serviceCode: string;
    description: string;
    fee: number;
  }[]

}
