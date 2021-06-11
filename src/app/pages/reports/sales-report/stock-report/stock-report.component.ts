import { Component, OnInit } from '@angular/core';
import { SortingPipe } from 'src/app/shared/pipe/sorting.pipe';
import { SalesReportApiService } from '../sales-report-api.service';
import { VmSalesReportService } from '../vm/vm-sales-report.service';
import { IGetStock } from './interface/i-get-stock';
import { IStockReport } from './interface/i-stock-report';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.scss']
})
export class StockReportComponent implements OnInit {

  pos = 0;
  selTable = 0;
  sortUnit = false;
  active1 = false;
  sortQty = false;
  active2 = false;
  sortValue = false;
  active3 = false;



  constructor(
    private api: SalesReportApiService,
    public vm: VmSalesReportService,
    public pipe: SortingPipe,
    ) { }

  ngOnInit(): void {
    this.loadStockReport();
  }

  loadStockReport(): void{
    const model: IGetStock ={
      kw: '',
      brandId: 0,
      categoryId : 0,
    }

    this.api.stockReport(model).subscribe((res)=>{
      this.vm.setMasterStock(res);
      this.vm.setStockFunc(res);
    }, (err)=> console.log(err),
    () =>{

    }
    )
  }


  submitButtonFunc(): void{

    this.api.stockReport(this.vm.stockFilter).subscribe((res)=>{
      // this.vm.setMasterStock(res);
      this.vm.setStockFunc(res);
      console.log(res);

    }, (err)=> console.log(err),
    () =>{

    }
    )

  }

  openFilterFunc(): void{
    this.vm.stockFilterModal =! this.vm.stockFilterModal;
  }

  getItemsCount(): number {
    return this.vm.getStock().length;
  }

  posEventEmmit($event: any): void {
    this.pos = $event;
  }

  stockList(): IStockReport[] {
    const copyItems: IStockReport[] = Object.assign([], this.vm.getStock());
    if (copyItems.length > 100) {
      const newList = copyItems.splice(this.pos * 100, 100);
      return newList;
    } else {
      return copyItems;
    }
  }

  sortByUnitCost(): void{
    this.active1 = true;
    this.active2 = false;
    this.active3 = false
    this.sortUnit =! this.sortUnit;
    (this.sortUnit === true)?this.vm.setStockList(this.pipe.transform(this.vm.stockReportList, 'unitCost')):this.vm.setStockList(this.pipe.transform(this.vm.stockReportList, 'unitCost').reverse());
  }

  sortByQty(): void{
    this.active1 = false;
    this.active2 = true;
    this.active3 = false;
    this.sortQty =! this.sortQty;
    (this.sortQty === true)?this.vm.setStockList(this.pipe.transform(this.vm.stockReportList, 'qty')):this.vm.setStockList(this.pipe.transform(this.vm.stockReportList, 'qty').reverse());
  }

  sortValueFunc(): void{
    this.active1 = false;
    this.active2 = false;
    this.active3 = true;
    this.sortValue =! this.sortValue;
    (this.sortValue === true)?this.vm.setStockList(this.pipe.transform(this.vm.stockReportList, 'subTotal')):this.vm.setStockList(this.pipe.transform(this.vm.stockReportList, 'subTotal').reverse());
  }

  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }





}
