import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ToastService } from 'src/app/toast/toast-service';
import { StockManagementService } from '../../api/stock-management.service';
import { IDistribution } from './i-distribution';

@Component({
  selector: 'app-distribution-logs',
  templateUrl: './distribution-logs.component.html',
  styleUrls: ['./distribution-logs.component.scss']
})
export class DistributionLogsComponent implements OnInit, OnDestroy{

  subscriptions: Subscription[] = [];
  distributionList: IDistribution[] = [];
  masterDistributionList: IDistribution[] = [];
  position = 0;
  activeTr = 0;
  searchValue: any;

  constructor(
    public apiStock : StockManagementService,
    private toast: ToastService,
  ) { }


  ngOnInit(): void {
    this.toast.doToast();
    const subDis =  this.getDistribution().subscribe(res => {
      this.distributionList = res;
      this.masterDistributionList = res;
      },(err)=> console.log(err),
      () => {
        this.toast.closeToast();
        this.subscriptions.push(subDis);
      }
      )
  }

  getDistribution(): Observable<IDistribution[]>{
    return this.apiStock.getDistribution();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getDistributionCount(): number {
    return this.distributionList.length;
  }

  getPagePosition($event): void {
    this.position = $event;
  }

  getDistributionDatatable(): Observable<IDistribution[]> {
    let distribution: IDistribution[] = [];

    const copyItems = Object.assign([], this.distributionList);
    if (copyItems.length > 100) {
      distribution = copyItems.splice(this.position * 100, 100);
    } else {
      distribution = copyItems;
    }
    return of(distribution);
  }

  chackToolTip(char: number, max: number): boolean {
    if (char > max) {
      return true;
    } else {
      return false;
    }
  }

  getUidType(Typeid: number): string{

    if(Typeid === 1){
      return 'IMIE';
    }

    if(Typeid === 2){
      return 'MAC';
    }

    if(Typeid === 3){
      return 'S/C';
    }

    return ;
  }

  searchDistributionFunc(): void{

    if(this.searchValue !== ""){
      const searchList = this.masterDistributionList.filter(f => { f.productId == this.searchValue ||
        f.sku.toLowerCase().includes(this.searchValue) ||
         f.description.toLowerCase().includes(this.searchValue) ||
         f.uids.map(m => m).filter(f => f.uidValue.toLowerCase().includes(this.searchValue))
      })
      this.distributionList = searchList;
    }else{
      this.distributionList = this.masterDistributionList;
    }

  }


}
