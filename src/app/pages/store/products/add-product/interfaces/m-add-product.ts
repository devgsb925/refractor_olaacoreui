export interface MAddProduct {
  productId: number;
  sku: string;
  vendorId: number;
  vendorProductName: string;
  brandId: number;
  modelId: number;
  productNo: string;
  productDesc: string;
  productType: string;
  keywords: string;


  // Variant
  variantIds: number[];
  barcode: string;
  categoryIds: number[];
  orderIndex: number;

  rrp: number;
  srp: number;


  uom: number;
  reorderQty: number;
  warehouseLoc: string;
  unitsWeight: number;
  boxSize: number;
  volume: number;

  // productInfo: string;
  flagIds: number[];
  publishStatus: number;

  // buying
  shippingCost: number;

  msrpUSD: number;
  competitorTHB: number;

  link: string;

  remark: string;

  sellingShipping: number;


  // V2
  stockQty: number;

}

