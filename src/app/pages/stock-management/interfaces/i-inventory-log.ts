export interface IInventoryLog {
  pId:number;
  smId: number;
  sku:string;
  productDescription: string;
  stockQty: number;
  invStockQty: number;
  stockFlag: number; // 0 - even , 1 - over, 2 - under
  warehouseQty: number;
  invWarehouseQty: number;
  warehouseFlag: number; // 0 - even , 1 - over, 2 - under
  displayQty: number;
  invDisplayQty: number;
  displayFlag: number; // 0 - even , 1 - over, 2 - under
  demoQty: number;
  invDemoQty: number;
  demoFlag: number; // 0 - even , 1 - over, 2 - under
  qcQty: number;
  invQcQty: number;
  qcFlag: number; // 0 - even , 1 - over, 2 - under
  remarks: string;
  operatorCheck: string;
  date: Date;
}
