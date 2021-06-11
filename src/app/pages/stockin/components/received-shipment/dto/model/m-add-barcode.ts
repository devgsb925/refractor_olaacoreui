export interface MAddBarcode {
  productId: number;
  uidValue: string;
  uidType: number; // 1 = IMEI, 2 = S/N, 3 = MAC, 0 = NONE
}
