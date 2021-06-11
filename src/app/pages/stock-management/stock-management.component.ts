import { Component, OnInit } from '@angular/core';
import { VmStockManagementService } from './vm/vm-stock-management.service';

@Component({
  selector: 'app-stock-management',
  templateUrl: './stock-management.component.html',
  styleUrls: ['./stock-management.component.scss']
})
export class StockManagementComponent implements OnInit {

  constructor(
    public vmStockManagement: VmStockManagementService,
  ) { }

  ngOnInit(): void {
  }

}
