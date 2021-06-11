export interface MProduct {
  productId: number;
  sku: string;
  modelId: number;
  modelName: string;
  productNo: string;
  productDesc: string;
  brandId: number;
  brandName: string;
  vendorId: number;
  vendorProductName: string;
  productType: string;
  keywords: string;
  variantIds: number[];
  flagIds: number[];
  categoryIds: number[];
  orderIndex: number;
  publishStatus: number;
  remark: string;

  // V2
  srp: number;
  stockQty: number;
  reorderQty: number
}
