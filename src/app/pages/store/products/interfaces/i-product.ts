export interface IProduct {
  productId: number;
  sku: string;
  productImage: string;
  modelId: number;
  modelName: string;
  productNo: string;
  productDesc: string;
  brandId: number;
  brandName: string;
  productType: string;
  keywords: string;
  versionId: number;
  versionName: string;
  sizeId: number;
  sizeName: string;
  colorId: number;
  colorName: string;
  warrantyId: number;
  warrantyName: string;
  orderIndex: number;
  promotionFlagId: number;
  promotionFlagName: string;
  shippingFlagId: number;
  shippingFlagName: string;
  lifecycleFlagId: number;
  lifecycleFlagName: string;

  category1Id: number;
  category1Name: string;
  category2Id: number;
  category2Name: string;
  category3Id: number;
  category3Name: string;
  vendorId: number;
  vendorName: string;
  vendorProductName: string;
  remark: string;
  publishStatus: number;


//V2
  srp: number;
  stockQty: number;
  reorderQty: number;

}
