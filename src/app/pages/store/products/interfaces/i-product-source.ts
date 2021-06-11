export interface IProductSource {
  productId: number;
  productImage: string;
  sku: string;
  productNo: string;
  modelId: number;
  productDesc: string;
  brandId: number;
  productType: string;
  keywords: string;
  variantIds: number[];
  flagIds: number[];
  categoryIds: number[];
  orderIndex: number;
  vendorId: number;
  vendorName: string;
  vendorProductName: string;
  remark: string;
  publishStatus: number;


  // V2
  srp: number;
  stockQty: number;
  reorderQty: number;
}
