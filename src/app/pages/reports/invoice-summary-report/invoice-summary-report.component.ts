import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxPrinterService } from 'ngx-printer';
import { Subscription } from 'rxjs';
import { IDisplay } from '../ngx-lar-print/dto/interface/i-display';
import { SalesOrderService } from './api/sales-report.service';
import { IInvoiceList } from './interfaces/i-invoice-list';
import { IInvoiceSummary } from './interfaces/i-invoice-summary';
import { ISalesReportSettings } from './interfaces/i-sales-report-settings';
import { MInvoiceList } from './interfaces/m-invoice-list';
import { VmInvoiceSummaryReport } from './vm/vm-invoice-summary-report';

@Component({
  selector: 'app-invoice-summary-report',
  templateUrl: './invoice-summary-report.component.html',
  styleUrls: ['./invoice-summary-report.component.scss']
})
export class InvoiceSummaryReportComponent implements OnInit {

  currency = 'LAK';
  myDate = new Date();
  subscription: Subscription[] = [];
  constructor(
    private salesOrderApi: SalesOrderService,
    public vmInvoiceSummaryReport: VmInvoiceSummaryReport,
    public printerService: NgxPrinterService
  ) { }
  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  posSale = 0;
  itemCount = 0;
  selOperatorId = 0;
  leasingOption = 'all';
  showTotalLeasing = false;

  leasigTotal = 0;
  leasingName: string[] = [];

  ngOnInit(): void {
    this.salesOrderApi.getOperators().subscribe(
      (res) => {
        this.vmInvoiceSummaryReport.operatorList = res;
      });
    this.loadInvoiceList();
    this.prinCheck();
    this.getLeasingTotal();

  }

  prinCheck(): void {
    const printSub = this.printerService.$printWindowOpen.subscribe(
      (res) => {
        this.vmInvoiceSummaryReport.prinModel = res;
      },
      (err) => console.log(err),
      () => {
        this.subscription.push(printSub);
      }
    );
  }

  datimeFunc(date: Date): string {
    const format = 'd/M/yy h:mm a';
    const myDate = date;
    const locale = 'en-US';
    const formattedDate = formatDate(myDate, format, locale);
    return formattedDate;
  }

  updateOperatorId(): void {
    if (this.selOperatorId == 0) {
      this.vmInvoiceSummaryReport.settings.operatorIds = [];
    } else {
      this.vmInvoiceSummaryReport.settings.operatorIds = [];
      this.vmInvoiceSummaryReport.settings.operatorIds.push(this.selOperatorId)
    }
  }

  getInvoiceSummary(): IInvoiceSummary {
    return this.vmInvoiceSummaryReport.invoiceSummary;
  }

  loadInvoiceList(): void {

    this.vmInvoiceSummaryReport.settings.fromDt = new Date(this.vmInvoiceSummaryReport.settings.fromDtStr);
    this.vmInvoiceSummaryReport.settings.toDt = new Date(this.vmInvoiceSummaryReport.settings.toDtStr);




    this.salesOrderApi
      .invoiceList(this.vmInvoiceSummaryReport.settings)
      .subscribe((res: IInvoiceList[]) => {
        this.vmInvoiceSummaryReport.invoiceList = res;
        this.vmInvoiceSummaryReport.masterInvoice = res;
        this.getLeasingName(res);

      }, (err) => {
        console.log(err);
      }, () => {
        this.vmInvoiceSummaryReport.updateSummary();
      });
      this.getLeasingTotal();
  }

  getInvoiceList(): IInvoiceList[] {
    let copyItems: IInvoiceList[] = Object.assign(
      [],
      this.vmInvoiceSummaryReport.invoiceList
    );

    if (copyItems.length > 23) {
      this.itemCount = copyItems.length;
      return copyItems.splice(this.posSale * 100, 100);
    } else {
      this.itemCount = copyItems.length;
      return copyItems;
    }
  }

  paginateEvent($event: any): void {
    this.posSale = $event;
  }

  getDisplsy() {
    const json: IDisplay = {
      headDp: [
        { lable: 'Date', value: this.datimeFunc(new Date(this.vmInvoiceSummaryReport.settings.fromDtStr)) + ' - ' + this.datimeFunc(new Date(this.vmInvoiceSummaryReport.settings.fromDt)) },
        { lable: 'Operator', value: this.getOperator() },
        { lable: 'Print', value: this.datimeFunc(this.myDate) }
      ],
      bodyDp: [
        { lable: 'Total', value: this.vmInvoiceSummaryReport.invoiceSummary.totalAmount },
        { lable: 'Tax', value: this.vmInvoiceSummaryReport.invoiceSummary.taxAmount },
        { lable: 'Discount', value: this.vmInvoiceSummaryReport.invoiceSummary.discountAmount },
        { lable: 'Service Charge', value: this.vmInvoiceSummaryReport.invoiceSummary.serviceCharge },
        { lable: 'Shipping Cost', value: this.vmInvoiceSummaryReport.invoiceSummary.shippingCost },
        { lable: 'Grand Total', value: this.vmInvoiceSummaryReport.invoiceSummary.grandTotalAmount + this.vmInvoiceSummaryReport.invoiceSummary.serviceCharge },
      ],

      footerDp: [
        { lable: 'Cash', value: (this.vmInvoiceSummaryReport.invoiceSummary.cashAmount - this.vmInvoiceSummaryReport.invoiceSummary.changeAmount) },
        { lable: 'Bank Transfer', value: this.vmInvoiceSummaryReport.invoiceSummary.bankTransferAmount },
        { lable: 'Leasing', value: this.leasigTotal },
      ],
    }

    return json;
  }

  getTitle() {
    const json = {
      headT: 'Sales Report',
      bodyT: 'TOTAL OF ALL INVOICES',
      footerT: 'RECEIVED SUMMARY',
      logo: ''
    }
    return json;
  }

  getOperator() {
    const operator: string[] = [];
    this.vmInvoiceSummaryReport.settings.operatorIds.forEach(f => {
      operator.push(this.vmInvoiceSummaryReport.operatorList.find(op => op.id === f).name)
    })
    if (operator.length === 0) {
      return 'All Operator';
    } else {
      return operator;
    }

  }

  getLeasingName(data){
    let checkList: string[] = []
    this.leasingName = [];
    checkList = data.map(m => m.leasingName).filter(f => f !== '');
    this.leasingName = checkList.filter((v,i,s) => s.indexOf(v) == i);
  }

  filterLeasing():void{
      this.vmInvoiceSummaryReport.invoiceList = this.vmInvoiceSummaryReport.masterInvoice.filter(f =>
       f.leasingName.toLowerCase().includes(this.leasingOption.toLowerCase()));
       this.vmInvoiceSummaryReport.updateSummary();
       if(this.leasingOption === 'all'){
        this.vmInvoiceSummaryReport.invoiceList = this.vmInvoiceSummaryReport.masterInvoice;
        this.vmInvoiceSummaryReport.updateSummary();
       }
  }


  getLeasingTotal(){
    this.vmInvoiceSummaryReport.settings.fromDt = new Date(this.vmInvoiceSummaryReport.settings.fromDtStr);
    this.vmInvoiceSummaryReport.settings.toDt = new Date(this.vmInvoiceSummaryReport.settings.toDtStr);

    const model : MInvoiceList ={
      fromDt: this.vmInvoiceSummaryReport.settings.fromDt,
      toDt:  this.vmInvoiceSummaryReport.settings.toDt,
      sellTypeId: 2,
      sellMethodId: 0,
      operatorIds: []
    }

    this.salesOrderApi.invoiceList(model).subscribe((res) => {

      let array = res.map(m => m.grandTotal);
      this.leasigTotal = array.reduce((acc, cur) => acc + cur, 0);


      }, (err) => {
        console.log(err);
      }, () => {});


  }

}
