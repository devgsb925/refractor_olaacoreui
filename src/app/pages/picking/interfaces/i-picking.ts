import { IProduct } from './i-product';

export interface IPicking {
  pickingId: number;
  warehouseWithdrawalId: number;
  agentId: number;
  agentCartId: number;
  productId: number;
  qty: number;
  pickingStatus: number;
  pickingType: number;
  pickingDate: string;
}
