import { Injectable } from '@angular/core';
import { IInvoiceList } from '../interfaces/i-invoice-list';

import { MInvoiceList } from '../interfaces/m-invoice-list';
import { IInvoiceSummary } from '../interfaces/i-invoice-summary';

import { ISalesReportSettings } from '../interfaces/i-sales-report-settings';
import { IOperators } from '../interfaces/i-operators';

@Injectable()
export class VmInvoiceSummaryReport {

  settings: ISalesReportSettings = {
    fromDt: new Date(),
    fromDtStr: this.getDefaultFromDate(),
    toDt: new Date(),
    toDtStr: this.getDefaultToDate(),
    sellTypeId: 0,
    sellMethodId: 0,
    operatorIds: []
  }

  prinModel = false;

  invoiceList: IInvoiceList[] = [];
  operatorList: IOperators[] = [];
  masterInvoice: IInvoiceList[] = [];


  invoiceSummary: IInvoiceSummary = {
    totalAmount: 0,
    taxAmount: 0,
    discountAmount: 0,
    shippingCost: 0,
    grandTotalAmount: 0,
    receivedTotalAmount: 0,
    changeAmount: 0,
    cashAmount: 0,
    bankTransferAmount: 0,
    caReceivedTotalAmount: 0,
    serviceCharge: 0,
  };

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
    date.setHours(26);
    date.setMinutes(0);
    date.setMilliseconds(0);
    date.setSeconds(0);

    // now you can get the string
    var isodate = date.toISOString();
    return isodate.slice(0, 16);
  }

  constructor() {}

  updateSummary(): void {
    const summary: IInvoiceSummary = {
      totalAmount:
        this.invoiceList.length > 0
          ? this.invoiceList
              .map((a) => a.total)
              .reduce(function (a, b) {
                return a + b;
              })
          : 0,
      taxAmount:
        this.invoiceList.length > 0
          ? this.invoiceList
              .map((a) => a.tax)
              .reduce(function (a, b) {
                return a + b;
              })
          : 0,
      discountAmount:
        this.invoiceList.length > 0
          ? this.invoiceList
              .map((a) => a.discount)
              .reduce(function (a, b) {
                return a + b;
              })
          : 0,
      shippingCost:
        this.invoiceList.length > 0
          ? this.invoiceList
              .map((a) => a.shippingCost)
              .reduce(function (a, b) {
                return a + b;
              })
          : 0,
      grandTotalAmount:
        this.invoiceList.length > 0
          ? this.invoiceList
              .map((a) => a.grandTotal)
              .reduce(function (a, b) {
                return a + b;
              })
          : 0,
      receivedTotalAmount:
        this.invoiceList.length > 0
          ? this.invoiceList
              .map((a) => a.receivedTotal)
              .reduce(function (a, b) {
                return a + b;
              })
          : 0,
      changeAmount:
        this.invoiceList.length > 0
          ? this.invoiceList
              .map((a) => a.change)
              .reduce(function (a, b) {
                return a + b;
              })
          : 0,
          cashAmount: this.invoiceList.length > 0
          ? this.invoiceList
              .map((a) => a.cash)
              .reduce(function (a, b) {
                return a + b;
              })
          : 0,
          bankTransferAmount: this.invoiceList.length > 0
          ? this.invoiceList
              .map((a) => a.bankTransfer)
              .reduce(function (a, b) {
                return a + b;
              })
          : 0,

          caReceivedTotalAmount: this.invoiceList.length > 0
          ? this.invoiceList
              .map((a) => a.receivedTotal)
              .reduce(function (a, b) {
                return a + b;
              })
          : 0,

          serviceCharge: this.invoiceList.length > 0
          ? this.invoiceList
              .map((a) => a.charge)
              .reduce(function (a, b) {
                return a + b;
              })
          : 0,

    };

    this.invoiceSummary = summary;
  }
}
