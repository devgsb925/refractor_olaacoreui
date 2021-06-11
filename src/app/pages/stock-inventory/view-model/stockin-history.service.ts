import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StockinInventoryApiService } from '../api/stockin-inventory-api.service';
import { IEditInventory } from '../components/edit-stockin-history/dto/interfaces/i-edit-inventory';
import { ISaveEdit } from '../components/edit-stockin-history/dto/model/i-save-edit';
import { IInventoryHistory } from '../components/inventory-history/interface/i-inventory-history';
import { IOperator } from '../components/inventory-history/interface/i-operator';

@Injectable()
export class StockinHistoryService {

  inventoryList: IInventoryHistory[] = [];
  operator: IOperator[] = [];
  editInventoryList: IEditInventory[] = []
  editPage : boolean = false;


  constructor(private inHistory : StockinInventoryApiService) { }

  setInventoryList(inlist: IInventoryHistory[]): void{
    this.inventoryList = inlist;
  }

  setOperator(oplist: IOperator[]): void{
      this.operator = oplist;
  }

  setEditInventory(es : IEditInventory[]): void{
    this.editInventoryList = es;
  }

  getInventoryList():Observable<IInventoryHistory[]>{
   return this.inHistory.getInventory();
  }

  getOperator():Observable<IOperator[]>{
    return this.inHistory.getOperator();
  }

  getEditInventory(model:{inventoryDate: Date; OperatorId: number}):Observable<any>{
    return this.inHistory.getEditInventory(model);
  }

  addInventoryHistory(model:{operatorId: number}): Observable<IInventoryHistory>{
    return this.inHistory.addInventoryHistory(model);
  }

  saveSubmit(model :ISaveEdit ): Observable<any>{
    return this.inHistory.editInventoryHistory(model);
  }


}
