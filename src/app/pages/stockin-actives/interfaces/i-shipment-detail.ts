export interface IShipmentDetail {
  orderId: number;
  productId: number;
  brand: string;
  productName: string;
  modelName: string;
  modelNumber: string;
  size: string;
  color: string;
  orderQty: number;
  shippedQty: number;
  recieved: number;
  remarks: string;
  purchasingShipmentDetailId: number;
  purchasingShipmentId: number;
  barcode: string;
  productDescription: string;
  productNo: string;
}
