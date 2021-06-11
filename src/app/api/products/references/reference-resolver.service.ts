import { ProductsReferencesService } from './products-references.service';
import { IProductReferences } from './interfaces/i-product-references.interface';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReferenceResolverService implements Resolve<IProductReferences> {
  constructor(private apiProductsReferences: ProductsReferencesService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IProductReferences> {
    return this.apiProductsReferences.getAllProductRef();
  }
}
