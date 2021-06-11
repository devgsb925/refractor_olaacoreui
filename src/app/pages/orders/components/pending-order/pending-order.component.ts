import { IVendorTable } from './dto/interface/i-vendor-table';
import { IProdVariants } from './../stock/dto/interface/i-prod-variants';
import { ToastService } from 'src/app/toast/toast-service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MSubmitPendingOrder } from '../pending-order/dto/model/m-submit-pending-order';
import { IPendingOrder } from './dto/interface/i-pending-order';
import { MDeletePendingOrder } from './dto/model/m-delete-pending-order';
import { MSeaerchPendingOrder } from './dto/model/m-seaerch-pending-order';
import { PendingOrderService } from './view-model/pending-order.service';

@Component({
  selector: 'app-pending-order',
  templateUrl: './pending-order.component.html',
  styleUrls: ['./pending-order.component.scss'],
})
export class PendingOrderComponent implements OnInit, OnDestroy {
  searchValue = '';
  searchOption = 'venderId';
  selTable = 0;
  orderSearchOption = 'brandName';
  orderSearchValue = '';

  select = false;

  private subscription: Subscription[] = [];

  constructor(
    public vmOrpending: PendingOrderService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    const vendorSub = this.vmOrpending.getVendor().subscribe(
      (res) => {
        this.vmOrpending.setVendor(res);
        this.vmOrpending.setOrder([]);
        this.vmOrpending.setMasterVendorList(res);
      },
      (err) => console.log(err),
      () => {
        this.subscription.push(vendorSub);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  selectOrderDetailByVendorid(vendor: IVendorTable): void {
    this.toast.doToast();
    this.vmOrpending.selTableVendorId = vendor.purchasingVendorId;
    const orderDetailSub = this.vmOrpending
      .selectOrderDetailByVendorid(vendor.purchasingVendorId)
      .subscribe(
        (res) => {
          this.vmOrpending.setOrder(res);
          this.vmOrpending.setMasterOrderPending(res);
        },
        (err) => console.log(err),
        () => {
          this.subscription.push(orderDetailSub);
          this.toast.closeToast();
        }
      );
  }

  searchVendor(): void {
    if (this.searchValue === '') {
      const vendorSub = this.vmOrpending.getVendor().subscribe(
        (res) => {
          this.vmOrpending.setVendor(res);
        },
        (err) => console.log(err),
        () => {
          this.subscription.push(vendorSub);
        }
      );
    } else {
      const searchSub = this.vmOrpending
        .searchVendor(this.searchOption, this.searchValue)
        .subscribe(
          (res) => {
            this.vmOrpending.setVendor(res);
          },
          (err) => console.log(err),
          () => {
            this.subscription.push(searchSub);
          }
        );
    }
  }

  searchOrder(): void {
    const searModel: MSeaerchPendingOrder = {
      value: this.orderSearchOption,
      search: this.orderSearchValue,
      vid: this.vmOrpending.selTableVendorId,
    };

    if (this.orderSearchValue === '') {
      const orderDetailSub = this.vmOrpending
        .selectOrderDetailByVendorid(this.vmOrpending.selTableVendorId)
        .subscribe(
          (res) => {
            this.vmOrpending.setOrder(res);
          },
          (err) => console.log(err),
          () => {
            this.subscription.push(orderDetailSub);
          }
        );
    } else {
      const searchOrderSub = this.vmOrpending.searchOrder(searModel).subscribe(
        (res) => {
          this.vmOrpending.setOrder(res);
        },
        (err) => console.log(err),
        () => {
          this.subscription.push(searchOrderSub);
        }
      );
    }
  }

  removeSubmit(): void {
    if (window.confirm('Do you want to delete?')) {
      this.toast.doToast();
      const mapId = this.vmOrpending.pedingOrder
        .filter((f) => f.hasSelect === true)
        .map((m) => m.pendingOrderId);
      const deleteModel: MDeletePendingOrder = {
        poIds: mapId,
      };

      const deletePendingsub = this.vmOrpending
        .removePendingOrder(deleteModel)
        .subscribe(
          (res) => {
            if (res > 0) {
              const filterItem = this.vmOrpending.pedingOrder.filter(
                (f) => f.hasSelect === true
              );
              filterItem.forEach((itx) => {
                this.updateAfterDeletePendingOrder(itx.pendingOrderId);
              });

              if (this.vmOrpending.masterPendingstock.length === 0) {
                const findItem = this.vmOrpending.vendorList.find(
                  (f) =>
                    f.purchasingVendorId === this.vmOrpending.selTableVendorId
                );
                const findIndex = this.vmOrpending.vendorList.indexOf(findItem);
                this.vmOrpending.vendorList.splice(findIndex, 1);
                this.vmOrpending.setVendor(this.vmOrpending.vendorList);
              }

              this.select = false;
            }
          },
          (err) => console.log(err),
          () => {
            this.subscription.push(deletePendingsub);

            this.toast.closeToast();
          }
        );
    }
  }

  updateAfterDeletePendingOrder(id: number): void {
    const filter = this.vmOrpending.pedingOrder.filter(
      (f) => f.pendingOrderId !== id
    );
    this.vmOrpending.setOrder(filter);

    const filterMaster = this.vmOrpending.masterPendingstock.filter(
      (fill) => fill.pendingOrderId !== id
    );
    this.vmOrpending.setMasterOrderPending(filterMaster);
  }

  saveSubmit(): void {
    this.toast.doToast();
    const filteritems = this.vmOrpending.pedingOrder.filter((f) => f.hasUpdate === true);
    const map = filteritems.map((m: IPendingOrder) => {
      return {
        pendingOrderId: m.pendingOrderId,
        requestedQty: m.requestedQty,
        remarks: m.remarks,
      };
    });

    const updateModel = {
      pendings: map,
    };

    const editsub = this.vmOrpending
      .updatePendingOrderList(updateModel)
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => console.log(err),
        () => {
          this.vmOrpending.pedingOrder.forEach((itx) => {
            itx.hasUpdate = false;
          });
          this.toast.closeToast();
          this.subscription.push(editsub);
        }
      );
  }

  buttonSubmit(): void {
    this.toast.doToast();
    const filterItems = this.vmOrpending.pedingOrder.filter((f) => f.hasSelect);

    const map = filterItems.map((m: IPendingOrder) => {
      const submitModel: MSubmitPendingOrder = {
        pendingOrderId: m.pendingOrderId,
        vendorProductId: m.vendorProductId,
        requestedQty: m.requestedQty,
        vendorId: m.vendorId,
      };
      return submitModel;
    });

    const uploadModel = {
      Pendings: map,
    };
    const submitSub = this.vmOrpending
      .submitPendingOrder(uploadModel)
      .subscribe(
        (res) => {
          if (res > 0) {
            filterItems.forEach((itx) => {
              this.updateorderPendingMaster(itx.pendingOrderId);
            });

            this.vmOrpending.pedingOrder = this.vmOrpending.pedingOrder.filter((op) => op.hasSelect !== true);
            this.vmOrpending.setOrder(this.vmOrpending.pedingOrder);

            if (this.vmOrpending.masterPendingstock.length === 0) {
              this.vmOrpending.vendorList = this.vmOrpending.vendorList.filter(
                (o) => o.purchasingVendorId !== filterItems[0].vendorId
              );
              this.vmOrpending.setVendor(this.vmOrpending.vendorList);
            }

            this.select = false;
          }
        },
        (err) => console.log(err),
        () => {

          this.subscription.push(submitSub);
          this.toast.closeToast();
        }
      );
  }

  updateorderPendingMaster(id: number): void {
    this.vmOrpending.masterPendingstock = this.vmOrpending.masterPendingstock.filter(
      (f) => f.pendingOrderId !== id
    );
  }

  checkAllFunction(): void {
    this.vmOrpending.pedingOrder.forEach(f => f.hasSelect = this.select);
    this.vmOrpending.dsPedingOrder.next(this.vmOrpending.pedingOrder);
  }

  pOrderSelect(porder: IPendingOrder): void {

    const update = this.vmOrpending.pedingOrder.find(f => f.pendingOrderId == porder.pendingOrderId);
    update.hasSelect = porder.hasSelect;
    this.vmOrpending.dsPedingOrder.next(this.vmOrpending.pedingOrder);

    const checkAll = this.vmOrpending.pedingOrder.filter(f => f.hasSelect === false).length;

    if (checkAll > 0) {
      this.select = false;
    } else {
      this.select = true;
    }

  }

  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }

  getVariant(variants: IProdVariants[], varianttype: number): string {
    return variants.find((f) => f.refVariantId === varianttype) !== undefined
      ? variants.find((f) => f.refVariantId === varianttype).variantValue
      : '-';
  }

  searchVendorList(): void {
    if (this.searchValue !== '') {
      const searVenSub = this.vmOrpending
        .searchVendorList(this.searchValue)
        .subscribe(
          (res) => {
            this.vmOrpending.setVendor(res);
          },
          (err) => {
            this.subscription.push(searVenSub);
          }
        );
    } else {
      this.vmOrpending.setVendor(this.vmOrpending.masterVendorList);
    }
  }

  searchVendorProductList(): void {
    if (this.orderSearchValue !== '') {
      const searPodSub = this.vmOrpending
        .searchVendorProductList(this.orderSearchValue)
        .subscribe(
          (res) => {
            this.vmOrpending.setOrder(res);
          },
          (err) => console.log(err),
          () => {
            this.subscription.push(searPodSub);
          }
        );
    } else {
      this.vmOrpending.setOrder(this.vmOrpending.masterPendingstock);
    }
  }
}
