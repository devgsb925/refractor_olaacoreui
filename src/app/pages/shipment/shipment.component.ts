
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/toast/toast-service';
import { IMUpdateShipment } from './dto/model/m-update-shipment';
import { IMUpdateShipmentInfo } from './dto/model/m-update-shipment-info';
import { ShipmentApiService } from './api/shipment-api.service';
import { ShipmentViewModel } from './view-model/shipment-view-model.service';
import { IShipment } from './dto/interfaces/i-shipment';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.scss'],
})
export class ShipmentComponent implements OnInit, OnDestroy {
  searchShipment: string;

  constructor(
    private apiShipment: ShipmentApiService,
    public vmShipment: ShipmentViewModel,
    private toast: ToastService
  ) {}
  subscriptions: Subscription[] = [];
  selectStatus = -1;
  statusTab = false;
  fromDate = new Date();
  selectFrom = false;
  toDate = new Date();
  selectToDate = false;
  trSelect = 0;

  ngOnInit(): void {
    const getTop50Sub = this.apiShipment.getTop50Shipment().subscribe((res) => {
      this.vmShipment.setShipment(res);
      this.vmShipment.setMasterShipment(res);
    });

    this.subscriptions.push(getTop50Sub);

    const getRefCouriersSub = this.apiShipment
      .getRefCouriers()
      .subscribe((res) => {
        this.vmShipment.setCouriers(res);
      });
    this.subscriptions.push(getRefCouriersSub);

    const getRefForwardersSub = this.apiShipment
      .getRefForwarders()
      .subscribe((res) => {
        this.vmShipment.setForwarders(res);
      });
    this.subscriptions.push(getRefForwardersSub);


  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getItemsCount(): number {
    return this.vmShipment.shipmentList.length;
  }

  posEventEmmit($event: any): void {
    this.vmShipment.posShipment = $event;
  }

  shipmentList(): IShipment[] {
    const copyItems: IShipment[] = Object.assign(
      [],
      this.vmShipment.shipmentList
    );

    if (copyItems.length > 20) {
      return copyItems.splice(this.vmShipment.posShipment * 20, 20);
    } else {
      return copyItems;
    }
  }

  updateShipment(): void {
    this.toast.doToast();

    const model: IMUpdateShipment = {
      ships: this.vmShipment.shipmentList
        .filter((f) => f.hasUpdate === true)
        .map((m) => {
          const ship: IMUpdateShipmentInfo = {
            shipmentId: m.shipmentId,
            shipmentDate: m.shipmentDate,
            purchasingRefCourierId: m.refCourierId,
            purchasingRefForwarderId: m.refForwarderId,
            trackingNo: m.trackingNo,
            fWDNo: m.forwarderNo,
            noOfBoxes: m.noOfBoxes,
            weight: m.weight,
            volume: m.volume,
          };
          return ship;
        }),
    };

    this.apiShipment.updateShipment(model).subscribe(
      (res) => {
        if (res < 1) {
          alert('no changes had been done. check internet connection.');
        } else {
          this.vmShipment.shipmentList
            .filter((f) => f.hasUpdate)
            .forEach((fe) => (fe.isEdit = false));
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

  postDeleteShipment(did: number): void {
    const findItem = this.vmShipment.shipmentList.find(
      (f) => f.shipmentId === did
    );
    if (findItem.shipmentStatus === 0) {
      if (confirm('Are you sure to delete shipment with shipment id: ' + did)) {
        this.apiShipment.deleteshipment(did).subscribe((res) => {
          if (res > 0) {
            this.vmShipment.shipmentList = this.vmShipment.shipmentList.filter(
              (f) => f.shipmentId !== did
            );
          }
        });
      }
    } else {
      alert('Can Not Delete Shipment Have Received');
    }
  }

  editShipment(shipment: IShipment): void {
    this.toast.doToast();

    this.vmShipment.selectedShipmentId = shipment.shipmentId;

    this.vmShipment.updateShipmentModel.forwarderNo = shipment.forwarderNo;
    this.vmShipment.updateShipmentModel.shipmentDate = shipment.shipmentDate;
    this.vmShipment.updateShipmentModel.shipmentId = shipment.shipmentId;
    this.vmShipment.updateShipmentModel.refCourierId = shipment.refCourierId;
    this.vmShipment.updateShipmentModel.refForwarderId =
      shipment.refForwarderId;
    this.vmShipment.updateShipmentModel.noOfBoxes = shipment.noOfBoxes;
    this.vmShipment.updateShipmentModel.weight = shipment.weight;
    this.vmShipment.updateShipmentModel.volume = shipment.volume;
    this.vmShipment.updateShipmentModel.trackingNo = shipment.trackingNo;
    this.vmShipment.updateShipmentModel.shipmdentDateStr = this.vmShipment.convertDate();
    this.trSelect = shipment.shipmentId;

    this.apiShipment
      .getShipmentDetailByShipmentId(shipment.shipmentId)
      .subscribe(
        (res) => {
          this.vmShipment.setShipmentDetails(res);

          this.vmShipment.updateShipmentModel.purchasingVendorId =
            res[0].vendorId;
          this.vmShipment.editModal = true;
        },
        (err) => {
          console.log(err);
        },
        () => {
          this.toast.closeToast();
        }
      );
  }


  searchShipemt(): void {
    if (this.searchShipment !== '') {
      const searchSub = this.apiShipment
        .searchShipment(this.searchShipment)
        .subscribe(
          (res) => {
            this.vmShipment.setShipment(res);
          },
          (err) => console.log(err),
          () => {
            this.subscriptions.push(searchSub);
          }
        );
    } else {
      const searchSub = this.apiShipment.getTop50Shipment().subscribe(
        (res) => {
          this.vmShipment.setShipment(res);
        },
        (err) => console.log(err),
        () => {
          this.subscriptions.push(searchSub);
        }
      );
    }
  }

  openStatusModal(): void{
    this.statusTab = !this.statusTab;
    this.sortByStatus();
  }

  changeFormDate(): void{
    this.selectFrom = true;
    this.sortingByDate();
  }

  changeTodate(): void{
    this.selectToDate = true;
    this.sortingByDate();
  }

  sortingByDate(){
      if(this.selectFrom === true && this.selectToDate === true){
       const sortDateSub = this.vmShipment.sortingByDate(this.fromDate, this.toDate).subscribe((res) => {
            this.vmShipment.setShipment(res);
            this.vmShipment.setMasterShipment(res);
        },(err)=> console.log(err),
        () => {
          this.subscriptions.push(sortDateSub);
        }
        )
      }
  }

  sortByStatus(){
    const newList = this.vmShipment.masterShipment.filter(f => f.shipmentStatus === this.selectStatus);
    (this.selectStatus === -1)?this.vmShipment.setShipment(this.vmShipment.masterShipment):(newList.length > 0)?this.vmShipment.setShipment(newList):this.vmShipment.setShipment([]);
  }


}
