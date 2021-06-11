import { switchMap } from 'rxjs/operators';
import { IRefBrands } from './../../../../api/products/references/interfaces/i-ref-brands';
import { INgjSelectModel } from './../../../../shared/components/ngj-select/model/i-ngj-select-model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersViewModelService } from '../../view-model/orders-view-model.service';
import { Subject, Subscription } from 'rxjs';
import { EditOrderViewModelService } from './edit-order-view-model.service';
import { ProductReferencesViewModel } from '../../../../view-model/product-references-view-model';
import { OrderViewModelService } from '../order/order-view-model.service';
import { IRefCurrencyTypes } from 'src/app/api/products/references/interfaces/i-ref-refCurrencyTypes';
import { IProdVariants } from '../stock/dto/interface/i-prod-variants';
import { IRefModels } from 'src/app/api/products/references/interfaces/i-ref-model';
import { EditOrderApiService } from './edit-order-api.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss'],
})
export class EditOrderComponent implements OnInit, OnDestroy {
  constructor(
    public productReferenceViewModel: ProductReferencesViewModel,
    public ordersViewModel: OrdersViewModelService,
    public editOrderViewModel: EditOrderViewModelService,
    public vmOrder: OrderViewModelService,
    public apiEditOrder: EditOrderApiService
  ) {}

  searchValue = '';
  searchOption = 0;

  searchShipValueSubject = new Subject<string>();
  searchShipValue = '';
  searchShipOption = 0;

  tabPos = 0;
  sdPos = 0;
  invoice = '';
  shipmentCost = 0;
  showAddNewProd = false;
  orderDetailSelectIds: number[] = [];

  // Variable for add new product
  searchModelValue = '';
  searchBrandValue = '';
  brand: IRefBrands = { refBrandId: 0, name: '', orderIndex: 0, url: '' };
  productName = '';
  model: IRefModels = { refModelId: 0, name: '' };
  modelNumber = '';
  size = '';
  color = '';
  unitPrice = '0';
  orderQty = '0';
  recover = '0';
  remark = '';

  selIndex = null;

  showRemarkModal = false;

  larSearchShipment: string;

  orderDetailId = 0;
  remarkOfOrderDetail = '';
  selTr = 0;

  private subscription = new Subscription();

  ngOnInit(): void {
    const order = this.ordersViewModel.order;
    this.editOrderViewModel.setOrderId(order.orderId);

    const orderDetailSub = this.editOrderViewModel
      .readOrderDetail()
      .subscribe((res) => {
        if (res !== undefined) {
          this.invoice = res.invoiceNo;
          this.shipmentCost = order.shipmentCost;
          if (res.orderDetails !== undefined) {
            this.editOrderViewModel.setOrderDetail(res.orderDetails);
            this.ordersViewModel.setProdIds(
              res.orderDetails.map((orderDetail) => orderDetail.vendorProductId)
            );
          }
        }
      });
    this.subscription.add(orderDetailSub);

    this.initOrderDetail();

    // this.initShipment();

    this.searchShipFunc();

    console.log(this.editOrderViewModel.getOrderDetail().map( m => m.shipmentDetailId));


  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  initOrderDetail(): void {
    const newOrderDetailSub = this.ordersViewModel
      .subscriptionNewOrderDetail()
      .subscribe((res) => {
        this.ordersViewModel.addProdId(res.vendorProductId);
        this.editOrderViewModel.addOrderDetail(res);
      });
    this.subscription.add(newOrderDetailSub);
  }

  addOrderDetailSelect(id: number): void {
    const orderDetailId = this.orderDetailSelectIds.find((or) => or === id);
    if (orderDetailId === undefined) {
      this.orderDetailSelectIds.push(id);
    } else {
      this.orderDetailSelectIds = this.orderDetailSelectIds.filter(
        (or) => or !== id
      );
    }
  }

  checkAllFunc(): void {
    if (this.checkSelectAllDetail()) {
      this.orderDetailSelectIds = [];
    } else {
      this.orderDetailSelectIds = this.editOrderViewModel
        .getOrderDetail()
        .map((or) => or.purchasingOrderDetailId);
    }
  }

  checkShippedStatus(orderQty: number, shippedQty: number): string {
    if (shippedQty > 0) {
      if (orderQty > shippedQty) {
        return '#fcbf49';
      } else {
        return 'none';
      }
    } else {
      return 'none';
    }
  }

  checkRecievedStatus(shipStatus: number, receivedStatus: number): string {
    if (receivedStatus > 0) {
      return 'red';
    } else if (shipStatus > 0) {
      return '#fcbf49';
    } else {
      return 'none';
    }
  }

  saveFunc(): void {
    const saveSub = this.editOrderViewModel
      .updateOrder(
        this.invoice,
        this.ordersViewModel.order.purchasingRefCurrencyTypeId,
        this.ordersViewModel.order.rate,
        this.getTotalAmount(),
        this.getRecoverBalance(),
        this.shipmentCost
      )
      .subscribe(
        (res) => {
          if (res > 0) {
            alert('Update data is Successful!!');
            this.updateOrderAfteSave();
            this.saveRamarkFunc();
          } else if (typeof res === 'string') {
            alert(res);
          } else {
            alert('Order not have update!!');
          }
        },
        (err) => console.log(err),
        () => {
          this.selIndex = null;
          this.editOrderViewModel.resetHasupdate();
        }
      );

    this.subscription.add(saveSub);
  }

  updateOrderAfteSave(): void {
    const updateSub = this.editOrderViewModel.updateOrderAfteSave().subscribe(
      (res) => {
        this.editOrderViewModel.setOrderHistory(res);
        console.log(res);
      },
      (err) => console.log(err)
    );
    this.subscription.add(updateSub);
  }

  removeFunc(): void {
    const removeSub = this.editOrderViewModel
      .deleteOrderDetail(this.orderDetailSelectIds)
      .subscribe((res) => {
        if (res > 0) {
          alert('Delete Successful!!');
          this.editOrderViewModel.clearOrderDetailFromIds(
            this.orderDetailSelectIds
          );
          this.orderDetailSelectIds = [];
          this.updateOrderTableAfterDelete();
        } else {
          alert(
            'Has Error in Delete transection!! please try again next year...'
          );
        }
      });
    this.subscription.add(removeSub);
  }

  updateOrderTableAfterDelete() {
    if (this.editOrderViewModel.getOrderDetail().length === 0) {
      this.editOrderViewModel.setOrderHistory(
        this.vmOrder
          .getOrderHistory()
          .filter((f) => f.orderId !== this.editOrderViewModel.orderId)
      );
    }
  }

  addNewProductFunc(): void {
    const addNewProductSub = this.editOrderViewModel
      .addNewProduct(
        this.ordersViewModel.order.vendorId,
        this.brand.refBrandId,
        this.productName,
        this.model.refModelId,
        this.modelNumber,
        this.size,
        this.color,
        this.unitPrice,
        this.orderQty,
        this.recover,
        this.remark
      )
      .subscribe((res) => {
        this.ordersViewModel.addProdId(res.storeProductId);
        this.editOrderViewModel.addOrderDetail(res);
        this.brand = null;
        this.productName = '';
        this.model = null;
        this.modelNumber = '';
        this.size = '';
        this.color = '';
        this.unitPrice = '0';
        this.orderQty = '0';
        this.recover = '0';
        this.remark = '';
        this.showAddNewProd = false;
      });

    this.subscription.add(addNewProductSub);
  }

  setShipDetailPos(pos: number): void {
    this.sdPos = pos;
  }

  checkSelectDetail(id: number): boolean {
    return this.orderDetailSelectIds.find((od) => od === id) !== undefined;
  }

  checkSelectAllDetail(): boolean {
    return (
      this.editOrderViewModel.getOrderDetail().length ===
        this.orderDetailSelectIds.length && this.orderDetailSelectIds.length > 0
    );
  }

  getTotalAmount(): number {
    let totalPrice = 0;
    this.editOrderViewModel.getOrderDetail().forEach((orderDetail) => {
      totalPrice += orderDetail.unitPrice * orderDetail.orderQty;
    });
    totalPrice += this.shipmentCost;
    return totalPrice;
  }

  getTotalAmountLak(rate: number): number {
    let totalPriceLak = 0;
    totalPriceLak = this.getTotalAmount() * rate;
    return totalPriceLak;
  }

  getRecoverBalance(): number {
    let recoverBalance = 0;
    this.editOrderViewModel.getOrderDetail().forEach((orderDetail) => {
      recoverBalance += orderDetail.unitPrice * orderDetail.recover;
    });
    return recoverBalance;
  }

  onBrandSearchChange(value: string): void {
    this.searchBrandValue = value;
  }

  onModelSearchChange(value: string): void {
    this.searchModelValue = value;
  }

  onNgjSelectBrand(select: INgjSelectModel): void {
    this.brand = this.productReferenceViewModel
      .getBrands()
      .find((b) => b.refBrandId === select.Id);
  }

  getAllBrand(): INgjSelectModel[] {
    return (this.searchBrandValue === ''
      ? this.productReferenceViewModel.getBrands()
      : this.productReferenceViewModel
          .getBrands()
          .filter((b) =>
            b.name
              .toLocaleLowerCase()
              .includes(this.searchBrandValue.toLocaleLowerCase())
          )
    ).map((b) => {
      return {
        Id: b.refBrandId,
        Name: b.name,
      };
    });
  }

  initShipment(): void {
    const shipmentSub = this.editOrderViewModel
      .readShippment()
      .subscribe((res) => {
        if (res.length > 0) {
          this.editOrderViewModel.setShipments(res);
          this.editOrderViewModel.setShipIds(res.map((r) => r.shipmentId));
        }
      });
    this.subscription.add(shipmentSub);

    const shipmentDetailSub = this.editOrderViewModel
      .readShippmentDetail()
      .subscribe((res) => {
        this.editOrderViewModel.setShipmentDetails(res);
      });
    this.subscription.add(shipmentDetailSub);
  }

  searchShipFunc(): void {
    const searchShipSub = this.searchShipValueSubject
      .pipe(
        switchMap((value) => {
          if (value !== '') {
            switch (this.searchShipOption.toString()) {
              case '0':
                return this.editOrderViewModel.readShipById(
                  parseInt(value, 10)
                );
              case '1':
                return this.editOrderViewModel.readShipByForwarderNo(value);
              case '2':
                return this.editOrderViewModel.readShipByTrackingNo(value);
            }
          } else {
            return this.editOrderViewModel.readShippment();
          }
        })
      )
      .subscribe((res) => {
        if (res.length > 0) {
          this.editOrderViewModel.setShipments(res);
          this.editOrderViewModel.setShipId(res[0].shipmentId);
        }
      });
    this.subscription.add(searchShipSub);
  }

  onSearchShipValueChange(): void {
    this.searchShipValueSubject.next(this.searchShipValue);
  }

  onSearchShipOptionChange(): void {
    this.searchShipValue = '';
    this.searchShipValueSubject.next('');
  }

  closeFunc(): void {
    this.ordersViewModel.showEditOrderModal = false;
    this.editOrderViewModel.clearShipments();
  }

  getRefCurrencyTypes(): IRefCurrencyTypes[] {
    return this.productReferenceViewModel.getRefCurrencyTypes();
  }

  getVariant(variants: IProdVariants[], varianttype: number): string {
    return variants.find((f) => f.refVariantId === varianttype) !== undefined
      ? variants.find((f) => f.refVariantId === varianttype).variantValue
      : '-';
  }



  checkHasUpdate(): boolean {
    return false;
  }

  showRemarkModalFunc(id: number): void {
    const remark = this.editOrderViewModel.getRemarkById(id);

    this.orderDetailId = id;
    this.remarkOfOrderDetail = remark;
    this.showRemarkModal = true;
  }

  saveRamarkFunc(): void {
    this.editOrderViewModel.setRemarkById(
      this.orderDetailId,
      this.remarkOfOrderDetail
    );
    this.cancelRemarkFunc();
  }
  cancelRemarkFunc(): void {
    this.orderDetailId = 0;
    this.remarkOfOrderDetail = '';
    this.showRemarkModal = false;
  }

  checkRemarkFunc(id: number): boolean {
    const remark = this.editOrderViewModel.getRemarkById(id);
    return remark !== '' && remark !== undefined;
  }

  checkShipCount(remainingQty: number): string {
    if (remainingQty > 0) {
      return '#fcbf49';
    } else {
      return null;
    }
  }

  receivedQtyFlag(rqty: number, sqty: number): string {
    if (rqty < sqty && rqty !== 0) {
      return '#ff4747';
    }
    if (rqty > sqty && rqty !== 0) {
      return 'green';
    }
    if (rqty === sqty && rqty !== 0) {
      return '';
    }

    if (rqty === 0) {
      return '';
    }
  }


  sliceFunc(arr: any[], pos: number ,count: number): any[]{
    return arr.slice(pos * count, (pos + 1) * count);
  }


  navOrder(index: number): void{

    const orders = this.vmOrder.getOrderHistory();
    let newOrder;
    if (index > 0) {
      newOrder = orders[orders.findIndex(o => o.orderId == this.editOrderViewModel.orderId) + 1];
    } else {
      newOrder = orders[orders.findIndex(o => o.orderId == this.editOrderViewModel.orderId) - 1];
    }
    if (!newOrder) {
      this.closeFunc();
      return;
    }

    this.ordersViewModel.order = newOrder;
    this.editOrderViewModel.setOrderId(newOrder.orderId);

    const orderDetailSub = this.editOrderViewModel
      .readOrderDetail()
      .subscribe((res) => {
        if (res !== undefined) {
          this.invoice = res.invoiceNo;
          this.shipmentCost = newOrder.shipmentCost;
          if (res.orderDetails !== undefined) {
            this.editOrderViewModel.addOrderDetails(res.orderDetails);
            this.editOrderViewModel.setOrderDetail(res.orderDetails);
            this.ordersViewModel.setProdIds(
              res.orderDetails.map((orderDetail) => orderDetail.vendorProductId)
            );
          }
        }
      });
    this.subscription.add(orderDetailSub);

  }


  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }

  changeTab(id: number): void{
    this.tabPos = id;
    (this.tabPos)?this.initShipment():'';
  }

}
