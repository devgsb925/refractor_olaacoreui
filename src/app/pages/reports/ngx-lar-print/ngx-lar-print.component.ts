import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { NgxPrinterService } from 'ngx-printer';
import { Subscription } from 'rxjs';
import { VmInvoiceSummaryReport } from '../invoice-summary-report/vm/vm-invoice-summary-report';
import { IDisplay } from './dto/interface/i-display';
import { ITitle } from './dto/interface/i-title';

@Component({
  selector: 'app-ngx-lar-print',
  templateUrl: './ngx-lar-print.component.html',
  styleUrls: ['./ngx-lar-print.component.scss']
})
export class NgxLarPrintComponent implements  AfterViewInit, OnDestroy {

  subscription: Subscription[] = [];
  @Input() lable: IDisplay | undefined;
  @Input() title: ITitle | undefined;
  @Input() currency: string | undefined;
  @Input() sellingType: number;

  constructor(
    public printerService: NgxPrinterService,
    public vmInvoiceSummaryReport: VmInvoiceSummaryReport,
    ) { }

  ngAfterViewInit(): void {
    this.printerService.printDiv('idOfDivToPrint');
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => {
      sub.unsubscribe();
    });
    }

    getBodyDate(){
      if(this.sellingType === 1 || this.sellingType === 3){
        return this.lable.footerDp.filter(f => f.lable !== 'Leasing');
      }

      if(this.sellingType === 0){
        return this.lable.footerDp;
      }
    }

}
