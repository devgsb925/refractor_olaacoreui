import { switchMap } from 'rxjs/operators';
import { IShipment } from './../../../stockin-actives/interfaces/i-shipment';
import { MUpdateAddNewProduct } from './interfaces/m-add-new-product';
import { MUpdateOrder } from './interfaces/m-update-order';
import { IEditOrder } from './interfaces/i-edit-order';
import { Observable, Subject } from 'rxjs';
import { EditOrderApiService } from './edit-order-api.service';
import { Injectable } from '@angular/core';
import { IOrderDetails } from './interfaces/i-order-details';
import { IShipmentDetail } from './interfaces/i-shipment-detail';
import { IVariants } from '../../../../shared/interfaces/i-variants';
import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';
import { OrderViewModelService } from '../order/order-view-model.service';
import { IOrderHistory } from '../../dto/interfaces/i-order-history';
import { EndPoint } from 'src/app/security/end-point';

@Injectable()
export class EditOrderViewModelService {
  constructor(
    private editOrderApi: EditOrderApiService,
    private vmRef: ProductReferencesViewModel,
    private vmOrders: OrderViewModelService,
  ) {}

  orderId = 0;

  shipId = 0;

  private shipIds = new Subject<number[]>();

  private orderDetails: IOrderDetails[] = [];

  private shipments: IShipment[] = [];

  private shipmentDetails: IShipmentDetail[] = [];

  shipmentProductId = 0;


  updateOrder(
    invoiceNo: string,
    refCurrencyTypeId: number,
    rate: number,
    totalAmount: number,
    recoverBalance: number,
    shipmentCost: number
  ): Observable<number> {
    const orderDetails = this.orderDetails.filter(
      (orderDetail) => orderDetail.purchasingOrderId === this.orderId
    );
    const model: MUpdateOrder = {
      orderId: this.orderId,
      invoiceNo,
      purchasingRefCurrencyTypeId: refCurrencyTypeId,
      rate,
      totalAmount,
      recoverBalance,
      shipmentCost,
      orderDetails: orderDetails.map((orderDetail) => {
        return {
          orderDetailId: orderDetail.purchasingOrderDetailId,
          unitPrice: orderDetail.unitPrice,
          recover: orderDetail.recover,
          orderQty: orderDetail.orderQty,
          remarks: orderDetail.remarks,
        };
      }),
    };
    return this.editOrderApi.updateOrder(model);
  }

  setRemarkById(id: number, remark: string): void {
    console.log(remark);

    this.orderDetails.find(
      (od) => od.purchasingOrderDetailId === id
    ).remarks = remark;
  }

  getRemarkById(id: number): string {
    return this.orderDetails.find((od) => od.purchasingOrderDetailId === id)
      .remarks;
  }

  clearShipments(): void {
    this.shipments = [];
    this.shipmentDetails = [];
  }

  setShipId(id: number): void {
    this.shipId = id;
  }

  setShipIds(ids: number[]): void {
    this.setShipId(ids[0]);
    this.shipIds.next(ids);
  }

  setOrderId(id: number): void {
    this.orderId = id;
  }

  readOrderDetail(): Observable<IEditOrder> {
    return this.editOrderApi.getOrderDetail(this.orderId);
  }

  readShippment(): Observable<IShipment[]> {
    return this.editOrderApi.getShipmentByOrderId(this.orderId);
  }
  readShipById(id: number): Observable<IShipment[]> {
    return this.editOrderApi.getShipmentById(id, this.orderId);
  }
  readShipByForwarderNo(no: string): Observable<IShipment[]> {
    return this.editOrderApi.getShipmentByForwarderNo(no, this.orderId);
  }
  readShipByTrackingNo(no: string): Observable<IShipment[]> {
    return this.editOrderApi.getShipmentByTrackingNo(no, this.orderId);
  }

  readShippmentDetail(): Observable<IShipmentDetail[]> {
    return this.shipIds.pipe(
      switchMap((ids) => {
        return this.editOrderApi.getShipmentDetailByShipIds(ids);
      })
    );
  }

  addOrderDetail(orderDetail: IOrderDetails): void {
    this.orderDetails.push(orderDetail);
  }

  addOrderDetails(orderDetails: IOrderDetails[]): void {
    orderDetails = orderDetails.filter(
      (od) =>
        !this.orderDetails
          .map((o) => o.purchasingOrderDetailId)
          .includes(od.purchasingOrderDetailId)
    );

    // orderDetails.forEach((itx) => {
    //   itx.hasUpdate = false;
    // });

    this.orderDetails = this.orderDetails.concat(orderDetails);
  }

  addNewProduct(
    vendorId: number,
    brandId: number,
    productName: string,
    modelNameId: number,
    modelNumber: string,
    size: string,
    color: string,
    unitPrice: string,
    orderQty: string,
    recover: string,
    remarks: string
  ): Observable<any> {
    const model: MUpdateAddNewProduct = {
      orderId: this.orderId,
      vendorId,
      brandId,
      productName,
      modelNameId,
      modelNumber,
      size,
      color,
      unitPrice: parseInt(unitPrice, 10),
      orderQty: parseInt(orderQty, 10),
      recover: parseInt(recover, 10),
      remarks,
    };
    return this.editOrderApi.addProduct(model);
  }

  deleteOrderDetail(ids: number[]): Observable<number> {
    const model = { ids };
    return this.editOrderApi.deleteOrderDetails(model);
  }

  clearOrderDetailFromIds(ids: number[]): void {
    this.orderDetails = this.orderDetails.filter(
      (orderDetail) => !ids.includes(orderDetail.purchasingOrderDetailId)
    );
  }

  setShipments(ships: IShipment[]): void {
    this.shipments = ships;
  }

  setShipmentDetails(shipDetails: IShipmentDetail[]): void {
    this.shipmentDetails = shipDetails;
  }

  getShipments(): IShipment[] {
    return this.shipments;
  }

  getShipmentDetails(): IShipmentDetail[] {
    return this.shipmentDetails.filter(
      (shipDetail) => shipDetail.purchasingShipmentId === this.shipId
    );
  }

  getOrderDetail(): IOrderDetails[] {
    const prods = this.orderDetails.filter((od) => od.purchasingOrderId === this.orderId);
    return prods.sort((a, b) => a.productDescription.localeCompare(b.productDescription));
  }

  getOrderDetailOrderQty(orderDetailId: number): number {
    return this.orderDetails.find(
      (od) => od.purchasingOrderDetailId === orderDetailId
    ) !== undefined
      ? this.orderDetails.find(
          (od) => od.purchasingOrderDetailId === orderDetailId
        ).orderQty
      : 0;
  }

  getOrderDetailShipQty(orderDetailId: number): number {
    return this.orderDetails.find(
      (od) => od.purchasingOrderDetailId === orderDetailId
    ) !== undefined
      ? this.orderDetails.find(
          (od) => od.purchasingOrderDetailId === orderDetailId
        ).totalShippedQty
      : 0;
  }

  getVariant(id: number, variants: IVariants[]): string {
    return variants.find((f) => f.refVariantId === id) !== undefined
      ? variants.find((f) => (f.refVariantId = id)).variantValue
      : '';
  }

  getShipById(id: number): IShipment[] {
    return this.shipments.filter((ship) => ship.shipmentId === id);
  }

  getShipByForwarderNo(no: string): IShipment[] {
    return this.shipments.filter((ship) => ship.forwarderNo.includes(no));
  }

  getShipByTrackingNo(no: string): IShipment[] {
    return this.shipments.filter((ship) => ship.trackingNo.includes(no));
  }

  checkStatusShipmentById(id: number): boolean {
    if (
      this.shipmentDetails.find(
        (shipDetail) => shipDetail.purchasingShipmentId === id
      ) !== undefined
    ) {
      return this.shipmentDetails.find(
        (shipDetail) =>
          shipDetail.purchasingShipmentId === id &&
          shipDetail.recievedQty < shipDetail.shippedQty
      ) === undefined
        ? true
        : false;
    } else {
      return false;
    }
  }

  resetHasupdate(): void {}

  getVariantsVersion(pids: number[]): string {
    return this.vmRef.getVersion(pids).variantValue;
  }

  getVariantsColor(pids: number[]): string {
    return this.vmRef.getColor(pids).variantValue;
  }

  getVariantsSize(pids: number[]): string {
    return this.vmRef.getSize(pids).variantValue;
  }

  searchShipment(oid: number, search: string): Observable<any> {
    return this.editOrderApi.searchShipment(oid, search);
  }

  setOrderDetail(od: IOrderDetails[]): void {
    this.orderDetails = od.map(o => {
      if (o.productImage) o.productImage = EndPoint.MainUri + 'files/' + o.productImage;
      return o;
    });
  }

  updateOrderAfteSave(): Observable<IOrderHistory[]> {
    return this.vmOrders.readOrderHistory();
  }

  setOrderHistory(array: IOrderHistory[]): void {
    this.vmOrders.setOrderHistory(array);
  }
}
