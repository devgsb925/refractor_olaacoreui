import { IVariants } from '../../../../shared/interfaces/i-variants';
export interface IProduct {
  barcode: string;
  brandName: string;
  hasUpdate: boolean;
  newStatus: boolean;
  orderId: number;
  productDescription: string;
  productId: number;
  productNo: string;
  productVariants: IVariants[];
  receivedQty: number;
  remarks: string;
  shippedQty: number;
  hasSelect: boolean;
  modelName: string;
}
