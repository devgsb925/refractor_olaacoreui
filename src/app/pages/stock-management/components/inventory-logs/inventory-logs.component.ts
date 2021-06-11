import { Component, OnInit } from '@angular/core';
import { StockManagementService } from '../../api/stock-management.service';
import { IInventoryLog} from '../../interfaces/i-inventory-log';

@Component({
  selector: 'app-inventory-logs',
  templateUrl: './inventory-logs.component.html',
  styleUrls: ['./inventory-logs.component.scss']
})
export class InventoryLogsComponent implements OnInit {

  sortDate = false;
  products: IInventoryLog[] = [];

  pagePos = 0;
  prodLength = 0;

  constructor(
    private ApiStockManagementService: StockManagementService
  ) { }

  ngOnInit(): void {
    this.ApiStockManagementService.inventoryLogs().subscribe(
      (res) => {
      this.products = res;
    })
  }

  posEventEmmit($event: any): void {
    this.pagePos = $event;
  }

  getPagePosition($event): void {
    this.pagePos = $event;
  }

  getProducts(): IInventoryLog[] {
    let prods: IInventoryLog[] = [];

    const copyItems = Object.assign([], this.products);

    this.prodLength = copyItems.length;

    if (copyItems.length > 150) {
      prods = copyItems.splice(this.pagePos * 150, 150);
    } else {
      prods = copyItems;
    }

    return prods;
  }

  filterByDateOrder(): void {

    this.sortDate = !this.sortDate;

    if(this.sortDate) {

      const newList = this.products.sort((b, a) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.products = newList;

    }
    else if(!this.sortDate) {
      const newList = this.products.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.products = newList;
    }
  }

  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }



}
