import { IProdVariants } from './i-prod-variants';
import { IVendorProduct } from './i-vendor-product';

export interface IProductInventory {
  hasPendingOrder: boolean;
  hasUpdate: boolean;
  modelNo: string;
  productId: number;
  productVariants: IProdVariants[];
  quickEditStock: false;
  refBrandId: number;
  refModelId: number;
  remarks: string;
  reOrder: number;
  stockQty: number;
  vendorList: IVendorProduct[];
  modelName: string;
  productDescription: string;
  productImage: string;
  productNo: string;
  sku: string;
  uow: number;
}
