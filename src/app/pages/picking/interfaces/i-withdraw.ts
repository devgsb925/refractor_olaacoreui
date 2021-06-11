import { IProductVariants } from '../../vendors/dto/interfaces/i-product-variants';

export interface IWithDraw {
  agentCartId: number;
  agentId: number;
  agentName: string;
  productImage: string;
  modelName: string;
  productDescription: string;
  productId: number;
  productVariants: IProductVariants[];
  qty: number;
  srp: number;
  warehouseWithdrawalId: number;
  withdrawalDate: string;
  withdrawalStatus: number;
}

