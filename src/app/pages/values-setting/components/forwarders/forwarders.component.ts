import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductsReferencesService } from 'src/app/api/products/references/products-references.service';
import { IRefForwarders } from 'src/app/pages/shipment/dto/interfaces/i-ref-forwarder';

@Component({
  selector: 'app-forwarders',
  templateUrl: './forwarders.component.html',
  styleUrls: ['./forwarders.component.scss'],
})
export class ForwardersComponent implements OnInit, OnDestroy {
  constructor(private api: ProductsReferencesService) {}

  forwarderId = 0;
  forwarderName = '';
  forwarderAddress = '';

  searchValue = '';
  forwarderList: IRefForwarders[] = [];
  showList: IRefForwarders[] = [];

  private inprocess = false;

  private subscription = new Subscription();

  ngOnInit(): void {
    const forwarderSub = this.api.readForwarders().subscribe({
      next: (res) => {
        this.forwarderList = res;
        this.showList = res;
      },
      error: (err) => {
        alert(err.error);
        console.log(err);
      },
    });
    this.subscription.add(forwarderSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  searchFunc(): void {
    this.showList = this.forwarderList.filter(
      (forwarder) =>
        forwarder.companyName
          .toLowerCase()
          .includes(this.searchValue.toLowerCase()) ||
        forwarder.purchasingRefForwarderId
          .toString()
          .slice(0, this.searchValue.length) == this.searchValue
    );
  }

  selectFunc(item: IRefForwarders): void {
    this.forwarderId = item.purchasingRefForwarderId;
    this.forwarderName = item.companyName;
    this.forwarderAddress = item.address;
  }
  cancelFunc(): void {
    this.forwarderId = 0;
    this.forwarderName = '';
    this.forwarderAddress = '';
  }

  addFunc(): void {
    if (!this.inprocess) {
      if (!this.checkExistFunc()) {
        this.inprocess = true;
        const addSub = this.api
          .quickCreateForwarder(this.forwarderName, this.forwarderAddress)
          .subscribe({
            next: (res) => {
              if (res > 0) {
                const dateCreate = new Date().toISOString();
                this.forwarderList.push({
                  purchasingRefForwarderId: res,
                  companyName: this.forwarderName,
                  address: this.forwarderAddress,
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
          .updateForwarder(
            this.forwarderId,
            this.forwarderName,
            this.forwarderAddress
          )
          .subscribe({
            next: (res) => {
              if (res > 0) {
                const updateIndex = this.forwarderList.findIndex(
                  (forwarder) =>
                    forwarder.purchasingRefForwarderId == this.forwarderId
                );
                this.forwarderList[
                  updateIndex
                ].companyName = this.forwarderName;
                this.forwarderList[updateIndex].address = this.forwarderAddress;
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
      this.forwarderList.find(
        (forwarder) =>
          forwarder.companyName.toLowerCase() ==
          this.forwarderName.toLowerCase()
      ) != undefined
    );
  }
}
