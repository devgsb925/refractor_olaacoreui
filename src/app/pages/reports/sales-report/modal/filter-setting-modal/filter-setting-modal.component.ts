import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VmSalesReportService } from '../../vm/vm-sales-report.service';

@Component({
  selector: 'app-filter-setting-modal',
  templateUrl: './filter-setting-modal.component.html',
  styleUrls: ['./filter-setting-modal.component.scss']
})
export class FilterSettingModalComponent implements OnInit {

  constructor(
    public vmSalesReport : VmSalesReportService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

  }

  saveSettings(): void {

    this.vmSalesReport.invoiceFilter.show=false;

    if(this.vmSalesReport.invoiceFilter.invoiceDate !== 'Custom') {
      this.vmSalesReport.invoiceFilter.invFromDate = null;
      this.vmSalesReport.invoiceFilter.invToDate = null;
    }else{
      this.vmSalesReport.invoiceFilter.invFromDate =  this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.vmSalesReport.invoiceFilter.invToDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    }


  }

}
