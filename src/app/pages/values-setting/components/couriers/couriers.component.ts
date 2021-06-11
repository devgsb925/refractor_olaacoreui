import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ProductsReferencesService } from 'src/app/api/products/references/products-references.service';
import { IRefCouriers } from 'src/app/pages/shipment/dto/interfaces/i-ref-couriers';

@Component({
  selector: 'app-couriers',
  templateUrl: './couriers.component.html',
  styleUrls: ['./couriers.component.scss'],
})
export class CouriersComponent implements OnInit, OnDestroy {
  constructor(private api: ProductsReferencesService) {}

  courierId = 0;
  courierName = '';
  courierAddress = '';
  showList: IRefCouriers[] = [];

  private inprocess = false;
  searchValue = '';
  courierList: IRefCouriers[] = [];

  private subscription = new Subscription();

  ngOnInit(): void {
    const courierSub = this.api.readCouriers().subscribe({
      next: (res) => {
        this.courierList = res;
        this.showList = res;
      },
      error: (err) => {
        alert(err.error);
        console.log(err);
      },
    });
    this.subscription.add(courierSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  searchFunc(): void {
    this.showList = this.courierList.filter(
      (courier) =>
        courier.companyName
          .toLowerCase()
          .includes(this.searchValue.toLowerCase()) ||
        courier.purchasingRefCourierId
          .toString()
          .slice(0, this.searchValue.length) == this.searchValue
    );
  }

  selectFunc(item: IRefCouriers): void {
    this.courierId = item.purchasingRefCourierId;
    this.courierName = item.companyName;
    this.courierAddress = item.address;
  }
  cancelFunc(): void {
    this.courierId = 0;
    this.courierName = '';
    this.courierAddress = '';
  }

  addFunc(): void {
    if (!this.inprocess) {
      if (!this.checkExistFunc()) {
        this.inprocess = true;
        const addSub = this.api
          .quickCreateCourier(this.courierName, this.courierAddress)
          .subscribe({
            next: (res) => {
              if (res > 0) {
                const dateCreate = new Date().toISOString();
                this.courierList.push({
                  purchasingRefCourierId: res,
                  companyName: this.courierName,
                  address: this.courierAddress,
                  dateCreate: dateCreate,
                });
              }
            },
            error: (err) => {
              alert(err.error);
              console.log(err);
            },
            complete: () => {
              this.inprocess = false;
              this.cancelFunc();
            },
          });
        this.subscription.add(addSub);
      } else {
        alert('This company name is exist already!!');
      }
    }
  }

  updateFunc(): void {
    if (!this.inprocess) {
      if (!this.checkExistFunc()) {
        this.inprocess = true;
        const updateSub = this.api
          .updateCourier(this.courierId, this.courierName, this.courierAddress)
          .subscribe({
            next: (res) => {
              if (res > 0) {
                const updateIndex = this.courierList.findIndex(
                  (courier) => courier.purchasingRefCourierId == this.courierId
                );
                this.courierList[updateIndex].companyName = this.courierName;
                this.courierList[updateIndex].address = this.courierAddress;
              }
            },
            error: (err) => {
              alert(err.error);
              console.log(err);
            },
            complete: () => {
              this.inprocess = false;
              this.cancelFunc();
            },
          });
        this.subscription.add(updateSub);
      } else {
        alert('This company name is exist already!!');
      }
    }
  }

  checkExistFunc(): boolean {
    return (
      this.courierList.find(
        (courier) =>
          courier.companyName.toLowerCase() == this.courierName.toLowerCase()
      ) != undefined
    );
  }
}
