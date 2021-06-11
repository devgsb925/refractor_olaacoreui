export interface MUpdateProduct {
  // Detail
  productId: number;
  sku: string;
  modelId: number;
  modelName: string;
  productNo: string;
  brandId: number;
  brandName: string;
  productDesc: string;
  productType: string;
  keywords: string;

  // Variants
  variantIds: number[];
  categoryIds: number[];
  orderIndex: number;
  publishStatus: number;


  // Flag
  flagIds: number[];

  // Unknown 1
  link: string;
  remark: string;

  // Vendor
  vendorId: number;
  vendorProductName: string;

  // Pricing
  srp: number;
  rrp: number;
  msrpUSD: number;
  competitorTHB: number;
  shippingCost: number;
  unitCost: number;

  // Unknown 2
  barcode: string;

  // Stock detail & distrition
  reorderQty: number;
  warehouseLoc: string;
  uom: number;
  unitsWeight: number;
  volume: number;
  boxSize: number;
  sellingShipping: number;


  // V2
  stockQty: number;

}
