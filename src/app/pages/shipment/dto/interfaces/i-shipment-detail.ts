// import { IProductVariants } from 'src/app/pages/vendors/dto/interfaces/i-product-variants';

export interface IShipmentDetail {
  barcode: string;
  brand: string;
  modelName: string;
  modelNumber: string;
  orderId: number;
  orderQty: number;
  productId: number;
  orderDetailsId: number;
  purchasingShipmentDetailId: number;
  purchasingShipmentId: number;
  recievedQty: number;
  remarks: string;
  shipmentDetailStatus: number;
  shippedQty: number;
  shipmentDate: Date;
  remainingQty: number;
  // productVariants: IProductVariants[];
  select: boolean;
  hasUpdate: boolean;
  vendorId: number;
  productDescription: string; //prod name
  productNo: string;
  addToStock: boolean;
}
