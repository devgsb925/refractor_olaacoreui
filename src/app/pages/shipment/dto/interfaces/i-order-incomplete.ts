export interface IOrderIncomplete {
  orderId: number;
  orderDetails: {
    brandName: string;
    color: string;
    modelName: string;
    modelNumber: string;
    orderQty: number;
    productName: string;
    purchasingOrderDetailId: number;
    purchasingOrderId: number;
    recieved: number;
    recover: number;
    remaining: number;
    remarks: string;
    shipmentDetailId: number;
    size: string;
    status: number;
    storeProductId: number;
    totalAmount: number;
    totalShippedQty: number;
    unitPrice: number;
  }[];
}
