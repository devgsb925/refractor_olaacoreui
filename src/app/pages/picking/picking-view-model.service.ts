import { ICartitem } from './interfaces/i-cartitem';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPicking } from './interfaces/i-picking';
import { IWithDraw } from './interfaces/i-withdraw';
import { UPicking } from './interfaces/u-picking';
import { UWithdraw } from './interfaces/u-withdraw';
import { PickingApiService } from './picking-api.service';
import * as signalR from '@aspnet/signalr';
import { EndPoint } from 'src/app/security/end-point';
import { debounceTime, pluck, switchMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class PickingViewModelService {
  constructor(private pickingService: PickingApiService) {}
  private withdrawList: IWithDraw[] = [];

  private pickingList: IPicking[] = [];

  private hubConnection: signalR.HubConnection;

  public playAudioRequestSub = new Subject<boolean>();
  public playAudioCancelSub = new Subject<boolean>();

  readWithDrawals(): Observable<IWithDraw[] | HttpErrorResponse> {
    return this.pickingService.getWithdraw();
  }

  readPickings(): Observable<IPicking[] | HttpErrorResponse> {
    return this.pickingService.getPicking();
  }

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()

      .withUrl(EndPoint.MainUri + 'warehouse')
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection Successed');
        this.addTranferPickingDataListenter();
      })
      .catch((err) => console.log('Error while starting connection: ' + err));
  }

  getCartItems(): { agentId: number; cartId: number; agentName: string }[] {
    const cartItems: ICartitem[] = this.withdrawList
      .map((w) => {
        return {
          agentId: w.agentId,
          cartId: w.agentCartId,
          agentName: w.agentName,
        };
      })
      .filter(
        (v, i, s) =>
          s.findIndex(
            (t) => t.agentId === v.agentId && t.cartId === v.cartId
          ) === i
      );
    return cartItems;
  }

  getTime(agentId: number, cartId: number): string {
    if (this.pickingList.length > 0) {
      const picking = this.pickingList.filter(
        (pick) => pick.agentCartId === cartId && pick.agentId === agentId
      );

      return picking.length > 0
        ? picking[picking.length - 1].pickingDate.split('T')[1].split('.')[0]
        : '';
    } else {
      return '';
    }
  }

  getCartItemCount(agentId: number, cartId: number): number {
    return this.withdrawList.filter(
      (withdrawal) =>
        withdrawal.agentCartId === cartId && withdrawal.agentId === agentId
    ).length;
  }

  getPickCount(agentId: number, cartId: number): number {
    const pickings = this.pickingList.filter(
      (pick) =>
        pick.agentCartId === cartId &&
        pick.agentId === agentId &&
        pick.pickingType === 0 &&
        pick.pickingStatus === 1
    );
    return pickings.length;
  }

  getPickLeft(agentId: number, cartId: number): number {
    const pickings = this.pickingList.filter(
      (pick) =>
        pick.agentCartId === cartId &&
        pick.agentId === agentId &&
        pick.pickingType === 1 &&
        pick.pickingStatus === 1
    );
    return pickings.length;
  }

  hasPick(agentId: number, cartId: number): boolean {
    return (
      this.pickingList.find(
        (pick) =>
          pick.agentCartId === cartId &&
          pick.agentId === agentId &&
          pick.pickingType === 0 &&
          pick.pickingStatus === 0
      ) !== undefined
    );
  }

  hasLeft(agentId: number, cartId: number): boolean {
    return (
      this.pickingList.find(
        (pick) =>
          pick.agentCartId === cartId &&
          pick.agentId === agentId &&
          pick.pickingType === 1 &&
          pick.pickingStatus === 0
      ) !== undefined
    );
  }

  hasCancel(agentId: number, cartId: number): boolean {
    return (
      this.pickingList.find(
        (pick) =>
          pick.agentCartId === cartId &&
          pick.agentId === agentId &&
          pick.pickingType === 2 &&
          pick.pickingStatus === 0
      ) !== undefined
    );
  }

  getPickQtyByWithdrawalId(id: number): number {
    const totalQty = this.pickingList
      .filter(
        (pl) =>
          pl.warehouseWithdrawalId === id &&
          pl.pickingStatus === 0 &&
          pl.pickingType < 3
      )
      .reduce(
        (s: number, c) => (c.pickingType === 0 ? (s += c.qty) : (s -= c.qty)),
        0
      );
    return totalQty;
  }

  private addTranferPickingDataListenter(): void {
    this.hubConnection.on('recieve-picking', (data: IPicking[]) => {
      this.playAudioRequestSub.next(true);
      this.addNewPicking(data);
    });

    this.hubConnection.on('recieve-withdrawal', (data: IWithDraw[]) => {
      this.addNewWithdraw(data);
    });

    this.hubConnection.on('recieve-update-picking', (data: UPicking[]) => {
      this.updateNewPicking(data);
    });

    this.hubConnection.on('recieve-update-withdrawal', (data: UWithdraw) => {
      this.updateNewWithdraw(data);
    });

    this.hubConnection.on(
      'recieve-remove-picking-withdrawal',
      (data: number) => {
        this.removeWithdrawal(data);
        this.removePicking(data);
      }
    );

    this.hubConnection.on('recieve-remove-picking', (data: number) => {
      this.removePicking(data);
    });
    this.hubConnection.on('recieve-cancel-withdrawal', (data: number) => {
      this.playAudioCancelSub.next(true);
      this.setCancelWithdrawal(data);
    });

    this.hubConnection.on('recieve-cancel-cart', (data: number[]) => {
      this.playAudioCancelSub.next(true);
      data.forEach(d => {
        this.withdrawList = this.withdrawList.filter(w => w.warehouseWithdrawalId !== d);
        this.pickingList = this.pickingList.filter(p => p.warehouseWithdrawalId !== d);
      });
    });
  }

  setPickingList(data: IPicking[]): void {
    this.pickingList = data;
  }

  setWithdrawList(data: IWithDraw[]): void {
    this.withdrawList = data.map((d) => {
      d.productImage = EndPoint.MainUri + 'files/' + d.productImage;
      return d;
    });
  }

  getWithdraws(agentId: number, cartId: number): IWithDraw[] {
    return this.withdrawList.filter(
      (w) => w.agentCartId === cartId && w.agentId === agentId
    );
  }

  addNewPicking(newData: IPicking[]): void {
    this.pickingList = this.pickingList.concat(newData);
  }

  updateNewPicking(newData: UPicking[]): void {
    newData.forEach((d) => {
      this.pickingList[
        this.pickingList.findIndex((p) => p.pickingId === d.pickingId)
      ].pickingStatus = d.pickingStatus;
    });
  }

  addNewWithdraw(newData: IWithDraw[]): void {
    this.withdrawList = this.withdrawList.concat(newData);
  }

  updateNewWithdraw(newData: UWithdraw): void {
    this.withdrawList[
      this.withdrawList.findIndex(
        (w) => w.warehouseWithdrawalId === newData.warehouseWithdrawalId
      )
    ].qty = newData.qty;
  }

  updateStateOfPicking(wid: number, state: number): Observable<any> {
    let newQty = 0;

    this.pickingList
      .filter((p) => p.warehouseWithdrawalId === wid && p.pickingStatus === 0 && p.pickingType < 2)
      .forEach((p) => {
        if (p.pickingType === 0) {
          newQty += p.qty;
        } else {
          newQty -= p.qty;
        }
      });
    const newPicking = this.pickingList
      .filter((p) => p.warehouseWithdrawalId === wid && p.pickingStatus === 0)
      .map((p) => p.pickingId)
      .map((pid) => {
        return { pickingId: pid, pickingStatus: state };
      });
    const pickingmodel = {
      pickings: newPicking,
    };

    newQty =
      this.withdrawList.find((w) => w.warehouseWithdrawalId === wid).qty +
      newQty;
    const withdrawModel = {
      warehouseWithdrawalId: wid,
      withdrawalStatus: state,
      qty: newQty,
    };
    return this.pickingService.updateQtyWithdraw(withdrawModel).pipe(
      debounceTime(200),
      switchMap(() => {
        return this.pickingService.updatePickingState(pickingmodel);
      })
    );
  }

  updateCancelOfPicking(wid: number, state: number): Observable<any> {
    return this.pickingService.updatePickingState({
      pickings: this.pickingList
        .filter((p) => p.warehouseWithdrawalId === wid && p.pickingStatus === 0)
        .map((p) => p.pickingId)
        .map((pid) => {
          return { pickingId: pid, pickingStatus: state };
        }),
    });
  }

  setCancelWithdrawal(withdrawalId: number): void {
    this.withdrawList[
      this.withdrawList.findIndex(
        (w) => w.warehouseWithdrawalId === withdrawalId
      )
    ].withdrawalStatus = 3;
    this.pickingList
      .filter((pick) => pick.warehouseWithdrawalId === withdrawalId)
      .forEach((pick) => {
        pick.pickingStatus = 0;
        pick.pickingType = 2;
      });
  }

  removeWithdrawal(withdrawalId: number): void {
    this.withdrawList = this.withdrawList.filter(
      (w) => w.warehouseWithdrawalId !== withdrawalId
    );
  }

  removePicking(withdrawalId: number): void {
    this.pickingList = this.pickingList.filter(
      (p) =>
        !(p.pickingStatus === 0 && p.warehouseWithdrawalId === withdrawalId)
    );
  }

  checkCancelAlready(withdrawalId: number): boolean {
    return (
      this.pickingList.find(
        (p) => p.warehouseWithdrawalId === withdrawalId && p.pickingStatus === 0
      ) !== undefined
    );
  }
}
