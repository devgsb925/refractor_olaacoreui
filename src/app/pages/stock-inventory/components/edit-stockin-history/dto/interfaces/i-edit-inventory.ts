export interface IEditInventory {
  stockInventoryLogId : number;
  inventoryDate: Date;
  lastUpdate: Date;
  productId: number;
  productDescription: string;
  stockQty: number;
  unitsOnWarehouse: number;
  unitsOnDisplay: number;
  unitsOnDemo: number;
  unitsOnQC: number;
  status: number;
  hasUpdate: boolean;
}

