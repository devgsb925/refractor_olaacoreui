export interface IProduct {
  brandName:string;
  lessReceived: boolean;
  modelName: string;
  notReceived: boolean;
  orderQty: number;
  overReceived: boolean;
  productDescription: string;
  productId: number;
  productNo: string;
  productNumber: string;
  productVariants: {productVariantId: number; refVariantId: number; variantName: string; variantValue: string;}[]
  purchasingOrderDetailId: number;
  purchasingOrderId: number;
  recievedQty: number;
  recievedStatus: number;
  recover: number;
  remaining: number;
  remarks: string;
  shipmentDetailId:number;
  shipmentStatus: number;
  shippedQty: number;
  sku: string;
  status:number;
  totalAmount:number;
  totalShippedQty:number;
  unitPrice:number;
  vendorId: number;
  vendorProductId: number;
}
