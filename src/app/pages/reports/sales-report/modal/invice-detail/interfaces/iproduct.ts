export interface Iproduct {
  productId: number;
  productDesc: string;
  unitPrice: number;
  qty: number;
  uidValues: string[];
  tax: number;
  discount: number;
  subTotal: number;
  variants: string;
  isFree: boolean;
}
