import { Component, OnInit } from '@angular/core';
import { IStockDistribution } from './interfaces/i-stock-distribution';
import { VmStockDistribution } from './vm/vm-stock-distribution.service';

@Component({
  selector: 'app-stock-distribution',
  templateUrl: './stock-distribution.component.html',
  styleUrls: ['./stock-distribution.component.scss']
})
export class StockDistributionComponent implements OnInit {

  constructor(private vmStockDistribution: VmStockDistribution) { }

  prods: IStockDistribution[] = [
    { productId: 1, productDesc: 'Lorem ipsum dolor sit amet.', stockQty: 1, warehouseQty:1, displayQty: 1, demoQty: 1, select: false}

  ];

  ngOnInit(): void {
  }

  getActiveTab(): number {
    return this.vmStockDistribution.activeTab;
  }

  setActiveTab(tab: number): void {
    this.vmStockDistribution.activeTab = tab;
  }



}
