import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgxPrinterService } from 'ngx-printer';
import { IPrintInvoice } from './i-print-invoice';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {

  @Input() SetInvoice: IPrintInvoice = {
    invoiceId: 0,
    invoiceNo: '',
    paymentMethod: '',
    sellDate: new Date(),
    customerId: 0,
    customerName: '',
    phoneNumber: '',
    productList: [],
    totalAmount: 0,
    discountAmount: 0,
    grandTotalAmount: 0,
    paidAmount: 0,
    changeAmount: 0,
    bankName: '',
    shippingCost: 0,
    sellingType: '',
    leasingName: '',
    charge: 0,
    // saleRemarks: '',
    services:[]

  };

  constructor(public printerService: NgxPrinterService) {}

  ngAfterViewInit(): void {
    console.log(this.SetInvoice);
    this.printerService.printDiv('idOfDivToPrint');
  }

  datimeFunc(): string {
    const format = 'd/M/yy, h:mm a ,EEEE';
    const myDate = new Date();
    const locale = 'en-US';
    const formattedDate = formatDate(myDate, format, locale);
    return formattedDate;
  }

  ngOnInit(): void {}

}
