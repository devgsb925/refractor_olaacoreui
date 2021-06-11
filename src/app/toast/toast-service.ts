import { Injectable } from '@angular/core';
import { BehaviorSubject, pipe, of, interval, Subscription } from 'rxjs';
import { takeWhile, timeout } from 'rxjs/operators';

@Injectable()
export class ToastService {

  notificationSubscription;  

  protected toast = {
    showToaster: false,
    quotePos: 0,
    msg: 'please wait...',    
    quotes: [
      { value: 'Sometimes later becomes never. Do it now.' },
      { value: 'Great things never come from comfort zones.' },
      { value: 'Dream it. Wish it. Do it.' },
      { value: 'Success doesn’t just find you. You have to go out and get it.' },
      { value: 'The harder you work for something, the greater you’ll feel when you achieve it.' },
      { value: 'Dream bigger. Do bigger.' },
      { value: 'Don’t stop when you’re tired. Stop when you’re done.' },
      { value: 'Wake up with determination. Go to bed with satisfaction.' },
      { value: 'Do something today that your future self will thank you for.' },
      { value: 'Little things make big days.' },
      { value: 'It’s going to be hard, but hard does not mean impossible.' },
      { value: 'Don’t wait for opportunity. Create it.' },
      { value: 'Sometimes we’re tested not to show our weaknesses, but to discover our strengths.' },
      { value: 'The key to success is to focus on goals, not obstacles.' },
      { value: 'Dream it. Believe it. Build it.' }
    ]
  };
  
  protected notification = {
    showNotification: false,
    msg: ''    
  }

  protected dsToast = new BehaviorSubject(this.toast);
  toast$ = this.dsToast.asObservable();

  protected dsNotification = new BehaviorSubject(this.notification);
  notification$ = this.dsNotification.asObservable();

  doToast() {
    
    this.toast.quotePos = Math.floor(Math.random() * 14);
    this.toast.showToaster = true;
    this.dsToast.next(this.toast);

  }

  closeToast() {
    
    this.toast.msg = 'please wait...';
    this.toast.showToaster = false;
    this.dsToast.next(this.toast);
    
  }

  setMsg(msg: any) {
    this.toast.msg = msg;
    this.dsToast.next(this.toast);
  }

  doNotification() {
        
    this.notification.showNotification = true;
    this.dsNotification.next(this.notification);

    this.notificationSubscription = interval(3000).pipe(takeWhile(() => this.notification.showNotification)).subscribe(val => this.closeNotification());
  }

  closeNotification() {
    
    this.notification.msg = '';
    this.notification.showNotification = false;
    this.dsNotification.next(this.notification);          
  }

  setNotificationMsg(msg: any) {
    this.notification.msg = msg;
    this.dsNotification.next(this.notification);
  }

}