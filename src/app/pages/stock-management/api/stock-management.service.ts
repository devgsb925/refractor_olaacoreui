import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EndPoint } from 'src/app/security/end-point';
import { IDistribution } from '../components/distribution-logs/i-distribution';
import { IStockManagementProducts } from '../interfaces/i-stock-management-products';
import { MDistributeProduct } from '../interfaces/m-distribute-product';

@Injectable()
export class StockManagementService {

  private inventoryLogsUrl =
    EndPoint.MainUri + 'v1/api/warehouse/stock-management/inventory-logs';

  private getStockManagementUrl =
    EndPoint.MainUri + 'v1/api/warehouse/stock-management';

  private addOrUpdateStockManagementUrl =
    EndPoint.MainUri + 'v1/api/warehouse/stock-management/add-or-update';

  private reCheckUrl =
    EndPoint.MainUri + 'v1/api/warehouse/stock-management/re-check';

  private addDistributeProductUrl =
    EndPoint.MainUri + 'v1/api/warehouse/stock-management/distribute-product';

  private getProductUidsUrl =
    EndPoint.MainUri + 'v1/api/warehouse/stock-management/get-product-uids';

  private getDistributionUrl = EndPoint.MainUri + 'v1/api/warehouse/stock-management/distribution-logs';

  constructor(private http: HttpClient) { }

  inventoryLogs(): Observable<any> {

    return this.http.get(this.inventoryLogsUrl)
      .pipe(catchError(() => of('server error'))) as Observable<
      IStockManagementProducts[]
    >;
  }

  addDistributeProduct(model: MDistributeProduct): Observable<any> {

    return this.http.post(this.addDistributeProductUrl, model)
      .pipe(catchError(() => of('server error'))) as Observable<any>;
  }

  getProductUids(pid: number): Observable<any> {

    let params = new HttpParams()
    params = params.append('pid', pid.toString());

    return this.http.get(this.getProductUidsUrl, {
        params: params,
      })
      .pipe(catchError(() => of('server error'))) as Observable<
      IStockManagementProducts[]
    >;
  }

  reCheck(smId: number): Observable<any> {

    const dataModel = {
      smId: smId
    };

    return this.http.put(this.reCheckUrl, dataModel)
    .pipe(catchError(() => of('server error'))) as Observable<any>;


  }

  getStockManagement(catId?: number, brandId?: number, keyword?: string, dateOrder?: boolean, checkStatus?: number, invStatus?: number): Observable<IStockManagementProducts[]> {

    let params = new HttpParams()
    if(catId !== undefined && catId !== null){
      params = params.append('catId', catId.toString());
    }

    if(brandId !== undefined && brandId !== null){
      params = params.append('brandId', brandId.toString());
    }

    if(keyword !== undefined && keyword !== null){
      params = params.append('keyword', keyword);
    }

    if(dateOrder !== undefined && dateOrder !== null){
      params = params.append('dateOrder', dateOrder.toString());
    }

    if(checkStatus !== undefined && checkStatus !== null){
      params = params.append('checkStatus', checkStatus.toString());
    }

    if(invStatus !== undefined && invStatus !== null){
      params = params.append('invStatus', invStatus.toString());
    }



    return this.http.get(this.getStockManagementUrl, {
        params: params,
      })
      .pipe(catchError(() => of('server error'))) as Observable<
      IStockManagementProducts[]
    >;
  }

  addOrUpdateStockManagement(dataList: IStockManagementProducts[], opt: number): Observable<any> {

    const dataModel = {
      Models: dataList,
      opt: opt
    };

    return this.http.post(this.addOrUpdateStockManagementUrl, dataModel)
    .pipe(catchError(() => of('server error'))) as Observable<any>;

  }

  getDistribution(): Observable<IDistribution[]> {
    return this.http.get(this.getDistributionUrl)
      .pipe(catchError(() => of('server error'))) as Observable<IDistribution[]>;
  }


}
