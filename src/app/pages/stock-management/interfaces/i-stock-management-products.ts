export interface IStockManagementProducts {
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
  date?: Date;
  status: number; // 0 - clear , 1 - ok, 2 - over or under
  check: number; //  0 - check , 1 - re check

  pselect: boolean; //  boolean set to false

  edit: boolean;
  touch: boolean;

}
