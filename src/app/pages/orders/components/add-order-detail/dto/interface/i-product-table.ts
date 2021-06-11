import { IVendorList } from './i-vendor-list';

export interface IProductTable {
  brandId: number;
  modelNameId: number;
  modelNumber: string;
  productId: number;
  vendorProductId: number;
  stockQty: number;
  reorderQty: number;
  remarks: string;
  productNo: string;
  vendorList: IVendorList[];
  variantIds: number[];
  hasUpdate: boolean;
  modelName: string;
  productDescription: string; //prod name
  sku:string;
  otw: number;
  keywords: string;
  productNumber: string;
  productType: string;
  volume: number;
  weigth : number;
}

