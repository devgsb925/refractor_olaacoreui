import { IProductVariants } from "src/app/pages/vendors/dto/interfaces/i-product-variants";

export interface IShipmentVendorProducts {
  brand: string;
  hasUpdate: boolean;
  modelName: string;
  orderDetailId: number;
  orderId: number;
  productDescription: string;
  productId: number;
  productNo: string;
  productVariants: IProductVariants[];
  remainingQty: number;
  shippedQty: number;
}