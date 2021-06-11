import { Component, OnInit } from '@angular/core';
import { NgxPrinterService } from 'ngx-printer';
import { SalesReportApiService } from '../../sales-report-api.service';
import { VmSalesReportService } from '../../vm/vm-sales-report.service';
import { IPrintInvoice } from './print-invoice/i-print-invoice';

@Component({
  selector: 'app-invice-detail',
  templateUrl: './invice-detail.component.html',
  styleUrls: ['./invice-detail.component.scss']
})
export class InviceDetailComponent implements OnInit {

  dsNextbtn = false;
  dsBackbtn = false;
  constructor(
    public vmInvoice : VmSalesReportService,
    public salesReportApi: SalesReportApiService,
    public printerService: NgxPrinterService,
  ) { }

  ngOnInit(): void {
    const printerSub = this.printerService.$printWindowOpen.subscribe(() => {
      this.vmInvoice.printInvoice = false;
    });
  }

  closeFunc(): void{
    this.vmInvoice.detail = false;
  }

  nextFunc(id: number, option: number): void{
    if(option === 1){
      const invoiceReport = this.vmInvoice.getAllInvoice();
      let index;

      index = invoiceReport.findIndex(f => f.invoiceId === id);
      index +=1;
      this.dsBackbtn = false;

      if(invoiceReport.length > index){
        const newList = this.salesReportApi.getInvoiceDetailByInvoiceId(invoiceReport[index].invoiceId).subscribe((res)=>{
          this.vmInvoice.setInvoice(res);
          this.vmInvoice.invoiceNo = invoiceReport.find(f => f.invoiceId === invoiceReport[index].invoiceId).invoiceNo;
        }, (err)=> console.log(err),
        () => {

        }
        )
      }else{
        this.dsNextbtn = true;
        return;
      }
    }else{


      const invoiceReport = this.vmInvoice.getAllInvoice();
      let index;
      index = invoiceReport.findIndex(f => f.invoiceId === id);

      if (index + 1 > 1) {
        index -= 1;
        this.dsNextbtn = false;
        const newList = this.salesReportApi.getInvoiceDetailByInvoiceId(invoiceReport[index].invoiceId).subscribe((res)=>{
          this.vmInvoice.setInvoice(res);
          this.vmInvoice.invoiceNo = invoiceReport.find(f => f.invoiceId === invoiceReport[index].invoiceId).invoiceNo;
        }, (err)=> console.log(err),
        () => {

        }
        )
      }else{
        this.dsBackbtn = true;
        return;
      }



    }
  }

  printInvoice(){
    this.vmInvoice.printInvoice = true;
    const model = this.vmInvoice.invoiceDetail;
    const mapPod = model.products.map((m) =>{
      return{
        productId: m.productId,
        productDescription: m.productDesc,
        productVariants: m.variants,
        modelName: m.productDesc,
        srp: m.unitPrice,
        rrp: 0,
        sellQty: m.qty,
        uidList: m.uidValues,
        free: m.isFree,
      }
    });

    const map: IPrintInvoice ={
      invoiceId: model.invoiceId,
      paymentMethod: model.paymentMethod, // 0 cash 1 bank
      invoiceNo: this.vmInvoice.invoiceNo,
      sellDate: model.sellDate,
      customerId: model.customerId,
      customerName: model.customerName,
      phoneNumber: model.customerPhoneNo,
      productList: mapPod,
      totalAmount: model.total + model.charge,
      discountAmount: model.discount,
      grandTotalAmount: model.grandTotal,
      paidAmount: model.cash,
      changeAmount: model.changeAmount,
      bankName: model.bankName,
      shippingCost: model.shippingCost,
      sellingType: model.sellingType,
      leasingName: this.vmInvoice.invoiceDetail.leasingName,
      charge: this.vmInvoice.invoiceDetail.charge,
      services: this.vmInvoice.invoiceDetail.services,
    };
    return map
  }

}
