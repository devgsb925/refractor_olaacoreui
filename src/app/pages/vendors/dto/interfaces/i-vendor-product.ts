import { IProductVariants } from './i-product-variants';

export interface IVendorProduct {
  brandId: number;
  brandName: string;
  modelName: string;
  orderIndex: number;
  productDescription: string;
  productId: number;
  productVariants: IProductVariants[];
  sku : string;
  productNo: string;
}
