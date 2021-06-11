import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IWithDraw } from './interfaces/i-withdraw';
import { PickingViewModelService } from './picking-view-model.service';

@Component({
  selector: 'app-picking',
  templateUrl: './picking.component.html',
  styleUrls: ['./picking.component.scss'],
})
export class PickingComponent implements OnInit, OnDestroy {
  activeTabIndex = 0;
  activeModal = false;

  agentIdSelect = 0;
  cartIdSelect = 0;
  @ViewChild('audioRequest') audioRequest: ElementRef;
  @ViewChild('audioCancel') audioCancel: ElementRef;

  constructor(public vmPicking: PickingViewModelService) {}

  private subscription = new Subscription();

  ngOnInit(): void {
    this.onAudioPlay();

    const withdrawalSub = this.vmPicking.readWithDrawals().subscribe((res) => {
      if (!(res instanceof HttpErrorResponse)) {
        this.vmPicking.setWithdrawList(res);
      } else {
        if (res !== null) {
          const errorRes = res as HttpErrorResponse;
          alert(errorRes.error.text);
        } else {
          alert(
            'API in Get withdrawal has error!! Please try again next time...'
          );
        }
      }
    });

    this.subscription.add(withdrawalSub);

    const pickingSub = this.vmPicking.readPickings().subscribe((res) => {
      if (!(res instanceof HttpErrorResponse)) {
        this.vmPicking.setPickingList(res);
      } else {
        if (res !== null) {
          const errorRes = res as HttpErrorResponse;
          alert(errorRes.error.text);
        } else {
          alert('API in Get picking has error!! Please try again next time...');
        }
      }
    });

    this.subscription.add(pickingSub);
    this.vmPicking.startConnection();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getWithDrawalFunc(): IWithDraw[] {
    return this.vmPicking.getWithdraws(this.agentIdSelect, this.cartIdSelect);
  }

  pendingFunc(wid: number): void {
    const pendSub = this.vmPicking
      .updateStateOfPicking(wid, 1)
      .subscribe((res) => {
        if (res > 0) {
          console.log('pending complete');
        }
      });
    this.subscription.add(pendSub);
  }
  cancelFunc(wid: number): void {
    const pendSub = this.vmPicking
      .updateCancelOfPicking(wid, 1)
      .subscribe((res) => {
        if (res > 0) {
          this.vmPicking.removeWithdrawal(wid);
          this.vmPicking.removePicking(wid);
        }
      });
    this.subscription.add(pendSub);
  }

  showModalFunc(agentId, cartId): void {
    this.agentIdSelect = agentId;
    this.cartIdSelect = cartId;
    this.activeModal = true;
  }

  onAudioPlay(): void {
    const audioSub1 = this.vmPicking.playAudioRequestSub.subscribe(() => {
      this.audioRequest.nativeElement.play();
    });
    this.subscription.add(audioSub1);
    const audioSub2 = this.vmPicking.playAudioCancelSub.subscribe(() => {
      this.audioCancel.nativeElement.play();
    });
    this.subscription.add(audioSub2);
  }
}
