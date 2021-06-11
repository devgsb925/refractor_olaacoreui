import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';
import { VmSalesReportService } from './vm/vm-sales-report.service';
import { SalesReportApiService } from './sales-report-api.service';
import { IInventoryHistory } from '../../stock-inventory/components/inventory-history/interface/i-inventory-history';
import { IInvoiceSummaryParams } from './interfaces/i-invoice-summary-params';
import { IInvoiceReportFilter } from './interfaces/i-invoice-report-filter';
import { DetailApiService } from '../../store/products/detail/detail-api.service';
import { IProductSummaryParams } from './interfaces/i-product-summary-params';
import { min } from 'rxjs/operators';
import { IProductReport } from './interfaces/i-product-report';
import { IProductReportFilter } from './interfaces/i-product-report-filter';
import { MProductReportSummary } from './interfaces/m.product-report-summary';
import { IInvoiceReport } from './interfaces/i-invoice-report';
import { ILoadVendor } from '../../vendors/dto/interfaces/i-load-vendor';
import { of } from 'rxjs';
import { SortingPipe } from 'src/app/shared/pipe/sorting.pipe';
import { IDisplay } from '../ngx-lar-print/dto/interface/i-display';
import { NgxPrinterService } from 'ngx-printer';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
})
export class SalesReportComponent implements OnInit, OnDestroy {
  sortQty: boolean = false;
  sortCost: boolean = false;
  sortAmount: boolean = false;
  sortProfit: boolean = false;

  active1 = false;
  active2 = false;
  active3 = false;
  active4 = false;
  currency = 'LAK';

  seltros = 0;
  seltrPod = 0;



  constructor(
    public vmSalesReport: VmSalesReportService,
    public salesReportApi: SalesReportApiService,
    public sort: SortingPipe,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadInvoiceReport();
    this.loadInvOperators();
    this.vmSalesReport.fromDate = this.datePipe.transform(new Date().toISOString(), 'yyyy-MM-dd');
    this.vmSalesReport.toDate = this.datePipe.transform(new Date().toISOString(), 'yyyy-MM-dd') + 'T23:59:59';
  }

  ngOnDestroy(): void {}

  loadInvOperators(): void {
    // return is nothing

    const loadOperators = this.salesReportApi
      .getOperators()
      .subscribe((res) => {
        this.vmSalesReport.invoiceOperators = res;
      });
  }

  loadInvoiceReport(): void {
    // return is nothing

    let fdate = new Date();
    fdate.setHours(7);
    fdate.setMinutes(0);

    let tdate = new Date();
    tdate.setHours(19);
    tdate.setMinutes(0);

    const model: IInvoiceSummaryParams = {
      fromDate: fdate,
      toDate: tdate,
      invoiceId: '',
      sellType: 0,
      sellMethod: 0,
      leaseBank: '',
      operatorIds: [],
    };

    const loadSub = this.salesReportApi
      .invoiceReport(model)
      .subscribe((res) => {
        this.vmSalesReport.invoiceProductSummary = res;
      });
  }

  filterInvoiceReport(params: IInvoiceReportFilter): void {

    if (
      params.invoiceDate == 'Custom' &&
      (params.invFromDate.toString().length == null || params.invToDate == null)
    ) {
      alert('From and To date must be selected. please try again.');
      return;
    }

    const model: IInvoiceSummaryParams = {
      fromDate: null,
      toDate: null,
      invoiceId: '',
      sellType: 0,
      sellMethod: 0,
      leaseBank: '',
      operatorIds: [],
    };

    if (params.invoiceDate === 'All') {
      model.fromDate = null;
      model.toDate = null;
    } else if (params.invoiceDate === '1') {
      model.fromDate = this.getDateLast(30);
      model.fromDate.setHours(7);
      model.fromDate.setMinutes(0);

      let tdate = new Date();
      tdate.setHours(19);
      tdate.setMinutes(0);

      model.toDate = new Date();
    } else if (params.invoiceDate === '3') {
      model.fromDate = this.getDateLast(90);
      model.fromDate.setHours(7);
      model.fromDate.setMinutes(0);

      model.toDate = new Date();
    } else if (params.invoiceDate === '12') {
      model.fromDate = this.getDateLast(365);
      model.fromDate.setHours(7);
      model.fromDate.setMinutes(0);

      model.toDate = new Date();
    } else {
      const fdt = new Date(params.invFromDate);
      fdt.setHours(7);
      fdt.setMinutes(0);
      fdt.setSeconds(0);

      model.fromDate = fdt;

      const tdt = new Date(params.invToDate);
      tdt.setHours(30);
      tdt.setMinutes(59);
      tdt.setSeconds(59);

      model.toDate = tdt;
    }

    if (this.vmSalesReport.invoiceFilter.operator > 0) {
      model.operatorIds.push(this.vmSalesReport.invoiceFilter.operator);
    }

    model.sellType = Number(params.sellType);
    model.sellMethod = Number(params.sellMethod);

    const operatorid = Number(params.operator);

    if (operatorid > 0) {
      model.operatorIds.push(operatorid);
    }

    model.invoiceId = params.kw;
    model.leaseBank = params.leasingBy;

    const filterSub = this.salesReportApi
      .invoiceReport(model)
      .subscribe((res) => {
        this.vmSalesReport.invoiceProductSummary = res;
      });

  }

  getDateLast(months: number): Date {
    return new Date(new Date().getTime() - months * 24 * 60 * 60 * 1000);
  }


  //#region product report

  changeTabs(id: number): void {
    this.vmSalesReport.tab = id;
    this.filterProductReport(this.vmSalesReport.productFilter);

  }

  pad(num: number): any {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  }

  loadProductReport(): void {
    let fdate = new Date();

    const FDATE =
      fdate.getFullYear() +
      '-' +
      this.pad(fdate.getMonth()) +
      '-' +
      this.pad(fdate.getDate()) +
      'T' +
      '07' +
      ':' +
      this.pad(fdate.getMinutes()) +
      ':' +
      this.pad(fdate.getSeconds()) +
      '.' +
      (fdate.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
      'Z';

    const model: IProductSummaryParams = {
      fromDate: new Date(fdate),
      toDate: new Date(fdate),
      kw: '',
      categoryId: 0,
      brandId: 0,
      transactionType: 'Sold',
    };

    const loadSub = this.salesReportApi
      .productReport(model)
      .subscribe((res) => {
        this.vmSalesReport.productReportSummary = res;
      });
  }

  filterProductReport(params: IProductReportFilter): void {
    if (
      params.prodDate == 'Custom' &&
      (params.prodDate.toString().length == null || params.prodDate == null)
    ) {
      alert('From and To date must be selected. please try again.');
      return;
    }

    const model: IProductSummaryParams = {
      fromDate: null,
      toDate: null,
      kw: '',
      categoryId: 0,
      brandId: 0,
      transactionType: 'Sold',
    };

    if (params.prodDate === 'All') {
      model.fromDate = this.getDateLast(3650);
      model.toDate = new Date();
    } else if (params.prodDate === '1') {
      let fdate = this.getDateLast(30);
      fdate.setHours(7);
      fdate.setMinutes(0);

      const FDATE =
        fdate.getFullYear() +
        '-' +
        this.pad(fdate.getMonth() + 1) +
        '-' +
        this.pad(fdate.getDate()) +
        'T' +
        '07' +
        ':' +
        this.pad(fdate.getMinutes()) +
        ':' +
        this.pad(fdate.getSeconds()) +
        '.' +
        (fdate.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';

      model.fromDate = new Date(FDATE);

      let tdate = new Date();
      tdate.setHours(21);
      tdate.setMinutes(0);

      const TDATE =
        tdate.getFullYear() +
        '-' +
        this.pad(tdate.getMonth() + 1) +
        '-' +
        this.pad(tdate.getDate()) +
        'T' +
        '21' +
        ':' +
        this.pad(tdate.getMinutes()) +
        ':' +
        this.pad(tdate.getSeconds()) +
        '.' +
        (tdate.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';

      model.toDate = new Date(TDATE);
    } else if (params.prodDate === '3') {
      let fdate = this.getDateLast(90);
      fdate.setHours(7);
      fdate.setMinutes(0);

      const FDATE =
        fdate.getFullYear() +
        '-' +
        this.pad(fdate.getMonth() + 1) +
        '-' +
        this.pad(fdate.getDate()) +
        'T' +
        '07' +
        ':' +
        this.pad(fdate.getMinutes()) +
        ':' +
        this.pad(fdate.getSeconds()) +
        '.' +
        (fdate.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';

      model.fromDate = new Date(FDATE);

      let tdate = new Date();
      tdate.setHours(21);
      tdate.setMinutes(0);

      const TDATE =
        tdate.getFullYear() +
        '-' +
        this.pad(tdate.getMonth() + 1) +
        '-' +
        this.pad(tdate.getDate()) +
        'T' +
        '21' +
        ':' +
        this.pad(tdate.getMinutes()) +
        ':' +
        this.pad(tdate.getSeconds()) +
        '.' +
        (tdate.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';

      model.toDate = new Date(TDATE);
    } else if (params.prodDate === '12') {
      let fdate = this.getDateLast(365);
      fdate.setHours(7);
      fdate.setMinutes(0);

      const FDATE =
        fdate.getFullYear() +
        '-' +
        this.pad(fdate.getMonth() + 1) +
        '-' +
        this.pad(fdate.getDate()) +
        'T' +
        '07' +
        ':' +
        this.pad(fdate.getMinutes()) +
        ':' +
        this.pad(fdate.getSeconds()) +
        '.' +
        (fdate.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';

      model.fromDate = new Date(FDATE);

      let tdate = new Date();
      fdate.setHours(21);
      fdate.setMinutes(0);

      const TDATE =
        tdate.getFullYear() +
        '-' +
        this.pad(tdate.getMonth() + 1) +
        '-' +
        this.pad(tdate.getDate()) +
        'T' +
        '21' +
        ':' +
        this.pad(tdate.getMinutes()) +
        ':' +
        this.pad(tdate.getSeconds()) +
        '.' +
        (tdate.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';

      model.toDate = new Date(TDATE);
    } else {
      const fdt = new Date(params.fromDt);
      fdt.setHours(7);
      fdt.setMinutes(0);
      fdt.setSeconds(0);

      model.fromDate = fdt;

      const tdt = new Date(params.toDt);
      tdt.setHours(30);
      tdt.setMinutes(59);
      tdt.setSeconds(59);

      model.toDate = tdt;
    }

      model.categoryId = this.vmSalesReport.catId;
      model.brandId = this.vmSalesReport.brandId;
      model.transactionType = params.transationType;
      model.kw = params.kw;

      console.log(model);


    const loadSub = this.salesReportApi
      .productReport(model)
      .subscribe((res) => {
        this.vmSalesReport.productReportSummary = res;
      });
  }
  //#endregion

  getProductCount(): number {
    return this.vmSalesReport.productReportSummary.productsReport.length;
  }

  productPos = 0;

  getProductPosition($event): void {
    this.productPos = $event;
  }

  getProduct(): Observable<IProductReport[]> {
    let pod: IProductReport[] = [];

    const copyItems = Object.assign(
      [],
      this.vmSalesReport.productReportSummary.productsReport
    );
    if (copyItems.length > 100) {
      pod = copyItems.splice(this.productPos * 100, 100);
    } else {
      pod = copyItems;
    }
    return of(pod);
  }

  sortingAmount(id: number, sortype: string) {
    id === 1 ? (this.sortQty = !this.sortQty) : (this.sortQty = false);
    id === 2 ? (this.sortCost = !this.sortCost) : (this.sortCost = false);
    id === 3 ? (this.sortAmount = !this.sortAmount) : (this.sortAmount = false);
    id === 4 ? (this.sortProfit = !this.sortProfit) : (this.sortProfit = false);

    this.active1 = id === 1 ? true : false;
    this.active2 = id === 2 ? true : false;
    this.active3 = id === 3 ? true : false;
    this.active4 = id === 4 ? true : false;

    if (
      this.sortQty === true ||
      this.sortCost === true ||
      this.sortAmount === true ||
      this.sortProfit === true
    ) {
      const model = this.vmSalesReport.productReportSummary.productsReport;
      this.vmSalesReport.productReportSummary.productsReport =
        this.sort.transform(model, sortype);
    } else {
      const model = this.vmSalesReport.productReportSummary.productsReport;
      this.vmSalesReport.productReportSummary.productsReport = model.reverse();
    }
  }

  submitDetail(data: IInvoiceReport) {
    this.vmSalesReport.invoiceId = data.invoiceId;
    this.vmSalesReport.invoiceNo = data.invoiceNo;

    this.vmSalesReport.detail = true;
    this.salesReportApi.getInvoiceDetailByInvoiceId(this.vmSalesReport.invoiceId).subscribe((res) => {
      this.vmSalesReport.setInvoice(res);

    },(err) => console.log(err),
    () => {

    }
    )

  }


  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }


  changeFromDateInvoic(value: string): void {
    this.vmSalesReport.invoiceFilter.invoiceDate = 'Custom';
    this.vmSalesReport.invoiceFilter.invFromDate = this.datePipe.transform(value, 'yyyy-MM-dd');
  }

  changeToDateInvoic(value: string): void {
    this.vmSalesReport.invoiceFilter.invoiceDate = 'Custom';
    this.vmSalesReport.invoiceFilter.invToDate = this.datePipe.transform(value, 'yyyy-MM-dd') + 'T23:59:59';
  }

  changtFromDateProduct(value: string): void{
    this.vmSalesReport.productFilter.prodDate = 'Custom';
    this.vmSalesReport.productFilter.fromDt = this.datePipe.transform(value, 'yyyy-MM-dd');

  }

  changeToDateProduct(value: string): void {
    this.vmSalesReport.productFilter.prodDate = 'Custom';
    this.vmSalesReport.productFilter.toDt = this.datePipe.transform(value, 'yyyy-MM-dd') + 'T23:59:59';
  }

}
