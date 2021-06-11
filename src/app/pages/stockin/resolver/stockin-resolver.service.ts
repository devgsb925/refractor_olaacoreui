import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StockinService } from '../api/stockin.service';

@Injectable()
export class StockinResolverService implements Resolve<any> {
  constructor(private api: StockinService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.api.loadAll();
  }
}
