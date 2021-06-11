import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { IInvoiceReportFilter } from '../interfaces/i-invoice-report-filter';
import {IInvoiceOperator} from '../interfaces/i-invoice-operator';
import { IInvoiceReportSummaryReport} from '../interfaces/i-invoices-summary-report';
import { IInvoiceReport } from '../interfaces/i-invoice-report';
import { Observable } from 'rxjs';
import { IProductReportFilter} from '../interfaces/i-product-report-filter';
import { MProductReportSummary } from '../interfaces/m.product-report-summary';
import { IInvoiceDetail } from '../../sales-report/modal/invice-detail/interfaces/i-invoice-detail'
import { IRefCategory } from 'src/app/api/products/references/interfaces/i-ref-category';
import { IStockReport } from '../stock-report/interface/i-stock-report';
import { IMasterStock } from '../../sales-report/stock-report/interface/i-master-stock';
import { IGetStock } from '../stock-report/interface/i-get-stock';
import { ISummary } from '../stock-report/interface/i-summary';
@Injectable()
export class VmSalesReportService {
  tab: number = 0;
  categories: any[] = [];
  brands: any[] = [];
  invoiceId:number =0;
  invoiceNo = '';
  invoiceDetail : IInvoiceDetail;
  masterInvoiceDetail : IInvoiceDetail;
  detail = false;
  printInvoice = false;
  ngxLarPrint = false;
  catId = 0;
  brandId = 0;
  fromDate = '';
  toDate = '';

    //stock report
    masterStock: IMasterStock = {
      stockReportListing: [],
      stockReportSummary: {
        totalQty: 0,
        totalValue: 0
      }
    };
    stockReportList: IStockReport[] =[];
    stockSummary: ISummary ={
      totalQty: 0,
      totalValue: 0
    };

    stockFilterModal = false;

    stockFilter: IGetStock = {
      kw: '',
      brandId: 0,
      categoryId : 0,
    }

    catName = 'ALL Categories';
    brandName = '';

    //end stock report



  invoiceProductSummary: IInvoiceReportSummaryReport = {
    invoicesReport : [],
    invoicesSummary : {
      totalAmount:0,
      discountAmount:0,
      taxAmount:0,
      shippingCost:0,
      grandTotal:0,
      cashAmount:0,
      bankTransferAmnount:0,
      leasingAmount:0,
      totalCost:0,
      totalProfit:0

    }

  };

  productReportSummary: MProductReportSummary ={
    productsReport:[],
    productsSummary: {
      totalQty:0,
      totalCost:0,
      totalSalesAmount:0,
      totalProfit:0
    }
  }

  invoiceFilter: IInvoiceReportFilter = {
    invoiceDate: 'Custom',
    sellType: '0',
    leasingBy: 'All Leasing',
    sellMethod: '0',
    operator: 0,
    show: false,

    invFromDate: this.getDefaultFromDate(),
    invToDate: this.getDefaultToDate(),
    kw: ''
  };

  invoiceOperators: IInvoiceOperator[]=[];

  invoiceCount = 0;
  invoicePos = 0;
  invoicePageCount = 20;

  productFilter:IProductReportFilter = {
    transationType:'Sold',
    prodDate:'Custom',
    categories:'ALL Categories',
    brand:'ALL Brands',
    show:false,
    fromDt: this.getDefaultFromDate(),
    toDt: this.getDefaultToDate(),
    kw: ''
  }


  cat1IdSelect: IRefCategory = {
    refCategoryId: 0,
    icon: '',
    name: 'Filter by categories',
    orderIndex: 0,
    parentId: 0,
    link: '',
      bannerUrl: ''
  };

  cat2IdSelect: IRefCategory = {
    refCategoryId: 0,
    icon: '',
    name: 'Filter by categories',
    orderIndex: 0,
    parentId: 0,
    link: '',
      bannerUrl: ''
  };

  cat3IdSelect: IRefCategory = {
    refCategoryId: 0,
    icon: '',
    name: 'Filter by categories',
    orderIndex: 0,
    parentId: 0,
    link: '',
      bannerUrl: ''
  };

  constructor() {}

  getInvoiceReportList(): IInvoiceReport[] {

    this.invoiceCount = this.invoiceProductSummary.invoicesReport.length;
    return this.invoiceProductSummary.invoicesReport.slice( this.invoicePos * this.invoicePageCount, (this.invoicePos + 1) * this.invoicePageCount);
  }

  invPosEventEmmit($event: any): void {
    this.invoicePos = $event;
  }

  setInvoice(inv : IInvoiceDetail): void{
    this.invoiceDetail = inv;
  }

  setMasterDetail(inv: IInvoiceDetail): void{
    this.masterInvoiceDetail = inv;
  }

  getAllInvoice(): IInvoiceReport[] {
    return this.invoiceProductSummary.invoicesReport;
  }

  getDefaultFromDate(): string {
    let date = new Date();
    date.setHours(14);
    date.setMinutes(0);
    date.setMilliseconds(0);
    date.setSeconds(0);

    // now you can get the string
    var isodate = date.toISOString();
    return isodate.slice(0, 16);
  }

  getDefaultToDate(): string {
    let date = new Date();
    date.setHours(28);
    date.setMinutes(0);
    date.setMilliseconds(0);
    date.setSeconds(0);

    // now you can get the string
    var isodate = date.toISOString();
    return isodate.slice(0, 16);
  }

  //#region  stock Report

    setMasterStock(ms:IMasterStock): void{
      this.masterStock = ms;
    }

    setStockFunc(st:IMasterStock){
      this.stockReportList = st.stockReportListing;
      this.stockSummary = st.stockReportSummary;
    }


    setStockList(stock: IStockReport[]): void{
      this.stockReportList = stock;
    }

    setSummary(sy:ISummary): void{
      this.stockSummary = sy;
    }

    getStock(): IStockReport[]{
        return this.stockReportList.filter(f => f.qty > 0);
    }

    getSummary():  ISummary{
      return this.stockSummary;
    }

  //#endregion stock report




}
