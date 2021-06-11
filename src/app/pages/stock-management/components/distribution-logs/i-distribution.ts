export interface IDistribution {
  description: string;
  distributionId: number;
  fromLoc: string;
  moveBy: string;
  moveDate: string;
  productId: number;
  qty: number;
  remarks: string;
  requestBy: string;
  sku: string;
  toLoc: string;
  uids: {
    uidId: number;
    uidType: number;
    uidValue: string;
  }[]
}
