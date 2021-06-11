import { ISelectForwarder } from './../../../../shared/components/select-forwarder/interfaces/i-select-forwarder';
import { ISelectCourier } from './../../../../shared/components/select-courier/interfaces/i-select-courier';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ShipmentViewModel } from '../../view-model/shipment-view-model.service';
import { ToastService } from 'src/app/toast/toast-service';
import { IProductVariants } from 'src/app/pages/vendors/dto/interfaces/i-product-variants';
import { IShipmentDetail } from '../../dto/interfaces/i-shipment-detail';
import { ShipmentApiService } from '../../api/shipment-api.service';
import { IMUpdateShipmentDetails } from '../../dto/model/m-update-shipment-details';
import { IMUpdateShipmentDetailsList } from '../../dto/model/m-update-shipment-details-list';
import { IMDeleteShipmentDetails } from '../../dto/model/m-delete-shipment-details';
import { MAddToStock } from '../../dto/model/m-add-to-stock';
import { Subscription } from 'rxjs';
import { IUpdateJShipment } from '../../dto/model/m-update-jshipment';
import { SortingPipe } from 'src/app/shared/pipe/sorting.pipe';

@Component({
  selector: 'app-shipment-detail',
  templateUrl: './shipment-detail.component.html',
  styleUrls: ['./shipment-detail.component.scss'],
})
export class ShipmentDetailComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  toStock = false;
  constructor(
    public vmShipment: ShipmentViewModel,
    private toast: ToastService,
    private apiShipment: ShipmentApiService,
    private sorting:  SortingPipe,
  ) {}

  //#region NoNo
  showSelectCourier = false;
  showSelectForwarder = false;
  courierName: string;
  forwarderName: string;
  //#endregion NoNo

  currentStringDate;
  recievedQty;
  editDate = false;
  updateDateChange = new Date();

  selTr = 0;

  ngOnInit(): void {
    let x = new Date(this.vmShipment.updateShipmentModel.shipmentDate);

    this.currentStringDate = new Date(x.getTime() + 1000 * 60 * 60 * 24)
      .toISOString()
      .substring(0, 10);

    this.updateRemainQty();
    this.courierName = this.vmShipment.getCourierName(this.vmShipment.updateShipmentModel.refCourierId);
    this.forwarderName = this.vmShipment.getForwarderName(this.vmShipment.updateShipmentModel.refForwarderId);

    console.log(this.vmShipment.shipmentDetails);

  }


  checkAddToStock(shippid: number):boolean{
    const newPod = this.vmShipment.shipmentDetails.find(f => f.orderDetailsId === shippid);
    if(newPod.shippedQty === newPod.recievedQty){
      return false;
    }else{
      return true;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  onDateChange(): void {
    this.vmShipment.updateShipmentModel.shipmentDate = new Date(
      this.updateDateChange
    );
  }

  getItemsCount(): number {
    return this.vmShipment.shipmentDetails.length;
  }

  posEventEmmit($event: any): void {
    this.vmShipment.posShipmentDetail = $event;
  }

  shipmentDetailList(): IShipmentDetail[] {
    let copyItems: IShipmentDetail[] = Object.assign(
      [],
      this.vmShipment.shipmentDetails
    );

    if (copyItems.length > 11) {
      return copyItems.splice(this.vmShipment.posShipmentDetail * 11, 11);
    } else {
      return copyItems;
    }
  }

  onAddShipmentDetails(): void {
    this.toast.doToast();

    this.apiShipment
      .getShippingVendorProducts(this.vmShipment.shipmentDetails[0].vendorId)
      .subscribe(
        (res) => {
          this.vmShipment.setVendorProducts(res);
        },
        (err) => {
          console.log(err);
        },
        () => {
          this.vmShipment.addShipmentDetailModal = true;
          this.toast.closeToast();
        }
      );
  }

  closeEditModal(): void {
    this.vmShipment.shipmentDetails = [];
    this.vmShipment.SELECT_ALL = false;
    this.vmShipment.editModal = false;
  }

  onDeleteShipmentDetails(): void {
    this.toast.doToast();
    const map = this.vmShipment.shipmentDetails
      .filter((f) => f.select === true && f.recievedQty === 0)
      .map((m) => {
        return {
          orderId: m.orderId,
          shipmentDetailId: m.purchasingShipmentDetailId,
          shipmentId: m.purchasingShipmentId,
          orderDetailId: m.orderDetailsId,
        };
      });

    const model: IMDeleteShipmentDetails = {
      shipmentDetailIds: map,
    };

    this.apiShipment.deleteShipmentDetails(model).subscribe((res) => {

        const dataList = this.vmShipment.shipmentDetails.filter(
          (f) => f.select === false
        );
        this.vmShipment.setShipmentDetails(dataList);
        if (dataList.length === 0) {
          this.vmShipment.SELECT_ALL = false;
          this.vmShipment.editModal = false;
          this.updateShipmenttaTableAfterDeleteAll(
            this.vmShipment.selectedShipmentId
          );
        }
    },(err) => console.log(err),
    () => {
      this.toast.closeToast();
    }
    );
  }

  updateShipmenttaTableAfterDeleteAll(shipmentid: number): void {
    const datalist = this.vmShipment.shipmentList.filter(
      (f) => f.shipmentId !== shipmentid
    );

    this.vmShipment.setShipment(datalist);
  }

  updateAfterChengeDetail(model : IUpdateJShipment){
    const findItem =  this.vmShipment.shipmentList.find(f => f.shipmentId === model.shipmentId);
    const delItem = this.vmShipment.shipmentList.indexOf(findItem);
    this.vmShipment.shipmentList.splice(delItem, 1);
    findItem.forwarderNo = model.forwarderNo;
    findItem.hasUpdate = false;
    findItem.isEdit = false;
    findItem.noOfBoxes = model.noOfBoxes;
    findItem.refCourierId = model.refCourierId;
    findItem.refForwarderId = model.refForwarderId;
    findItem.shipmentDate = model.shipmentDate;
    findItem.weight = model.weight;
    findItem.volume = model.volume;
    this.vmShipment.shipmentList.push(findItem);
    this.vmShipment.shipmentList =this.sorting.transform(this.vmShipment.shipmentList, 'shipmentId');
  }

  onSubmitUpdateShipmentDetails(): void {
    if (this.vmShipment.updateShipmentModel.hasUpdate) {
      this.toast.doToast();
      this.apiShipment
        .updateJShipment(this.vmShipment.updateShipmentModel)
        .subscribe(
          (res) => {
            if (res > 0) {
              alert(
                'Update Done'
              );
                this.updateAfterChengeDetail(this.vmShipment.updateShipmentModel)
            }
          },
          (err) => {
            console.log(err);
          },
          () => {
            this.toast.closeToast();
          }
        );
    }

    if (
      this.vmShipment.shipmentDetails.filter((f) => f.hasUpdate === true)
        .length > 0
    ) {
      this.toast.doToast();

      const model: IMUpdateShipmentDetailsList = {
        shipmentDetails: this.vmShipment.shipmentDetails
          .filter((f) => f.hasUpdate)
          .map((m) => {
            const mapModel: IMUpdateShipmentDetails = {
              shipmentDetailId: m.purchasingShipmentDetailId,
              shippedQty: m.shippedQty,
              remarks: m.remarks,
              totalRecievedQty: m.recievedQty,
            };
            return mapModel;
          }),
      };

      this.apiShipment.updateShipmentDetails(model).subscribe(
        (res: IShipmentDetail[]) => {
          if (res.length === 0) {
            alert(
              'No changes had been made. Check internet connection and try again.'
            );
          } else {
            const ids = model.shipmentDetails.map((m) => m.shipmentDetailId);
            const untouchList = this.vmShipment.shipmentDetails.filter(
              (f) => !ids.includes(f.purchasingShipmentDetailId)
            );

            this.vmShipment.shipmentDetails = this.vmShipment.shipmentDetails;
            this.apiShipment.getTop50Shipment().subscribe((res) => {
              this.vmShipment.setShipment(res);
            });
          }
        },
        (err) => {
          console.log(err);
        },
        () => {
          this.toast.closeToast();
          this.vmShipment.shipmentDetails.forEach((itx) => {
            itx.hasUpdate = false;
          });
        }
      );
    }
  }

  onSelectAllChanged(): void {
    this.vmShipment.shipmentDetails
      .filter((f) => f.addToStock !== true)
      .forEach((f) => (f.select = this.vmShipment.SELECT_ALL));
  }

  onSelectChange(state: boolean): void {
    if (state == false) {
      this.vmShipment.SELECT_ALL = false;
    }

    if (
      this.vmShipment.shipmentDetails.length ==
      this.vmShipment.shipmentDetails.filter((f) => f.select).length
    ) {
      this.vmShipment.SELECT_ALL = true;
    }
  }

  getVariant(variants: IProductVariants[], refvarid: number): string {
    if (variants.length === 0) {
      return '';
    }
    const variant = variants.find((f) => f.refVariantId == refvarid);

    if (variant == undefined) {
      return '';
    }

    return variant.variantValue;
  }

  updateRemarks(vp: IShipmentDetail): void {
    vp.hasUpdate = true;
  }

  validateShippedQty(vp: IShipmentDetail): void {


    if (vp.shippedQty > vp.remainingQty) {
      alert('shipped qty is more than remaining qty.' + vp.remainingQty);
      vp.shippedQty = 0;
    }
    vp.hasUpdate = true;
  }

  updateRemainQty() {
    this.vmShipment.shipmentDetails.forEach((f) => {
      f.remainingQty = f.shippedQty + f.remainingQty;
    });
  }

  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }

  addToStockSubmit(): void {

    this.onSubmitUpdateShipmentDetails();

    const shipments = this.vmShipment.shipmentDetails
    .filter((f) => f.select === true && f.recievedQty > 0 && f.recievedQty === f.shippedQty);

    if (shipments.length > 0) {

      this.toast.doToast();
      const map = shipments.map((m) => {
          return {
            orderDetailsId: m.orderDetailsId,
            purchasingShipmentDetailId: m.purchasingShipmentDetailId,
            recievedQty: m.recievedQty,
          };
        });

      const addToStockModal: MAddToStock = {
        addToStockList: map,
      };

      const addToStockSub = this.apiShipment
        .addToStock(addToStockModal)
        .subscribe(
          (res) => {
            if (res > 0) {
              alert('Compete');
              addToStockModal.addToStockList.forEach((itx) => {
                this.updateTableAfterUpdate(itx.purchasingShipmentDetailId);
              });
            } else {
              alert('Can Not Add To Stock');
            }
          },
          (err) => console.log(err),
          () => {
            this.subscriptions.push(addToStockSub);
            this.toast.closeToast();
          }
        );
    } else {
      const updateSelected = this.vmShipment.shipmentDetails.forEach(s=> {
        if(s.select === true && s.recievedQty === 0){
          s.select = false;
        }
      });
    }
  }

  updateTableAfterUpdate(sdid: number): void {
    const changData = this.vmShipment.shipmentDetails.find(
      (f) => f.purchasingShipmentDetailId === sdid
    );
    changData.addToStock = true;
    changData.select = false;
    this.vmShipment.SELECT_ALL = false;
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

  //#region  NoNo Function
  onSelectCourier(courier: ISelectCourier): void {
    this.vmShipment.updateShipmentModel.refCourierId = courier.courierId;
    this.courierName = courier.courierName;
  }

  onSelectForwarder(forwarder: ISelectForwarder): void{
    this.vmShipment.updateShipmentModel.refForwarderId = forwarder.forwarderId;
    this.forwarderName = forwarder.forwarderName;
  }

  clearSelectCourier(): void{
    this.vmShipment.updateShipmentModel.refCourierId = 0;
    this.courierName = '';
  }

  clearSelectForwarder(): void{
    this.vmShipment.updateShipmentModel.refForwarderId = 0;
    this.forwarderName = '';
  }


  onHasNewCourier(courier: ISelectCourier): void{
    this.vmShipment.addNewCourier(courier);
  }
  onHasNewForwarder(forwarder: ISelectForwarder): void{
    this.vmShipment.addNewForwarder(forwarder);
  }
  //#endregion NoNo Function
}
