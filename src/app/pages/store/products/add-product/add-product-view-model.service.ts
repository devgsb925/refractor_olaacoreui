import { Observable } from 'rxjs';
import { MAddProduct } from './interfaces/m-add-product';
import { MProduct } from './../interfaces/m-product';
import { Injectable } from '@angular/core';
import { AddProductApiService } from './add-product-api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AddProductViewModelService {
  constructor(private addProductApi: AddProductApiService) {}

  addProductToServer(model: MAddProduct): Observable<number> {
    return this.addProductApi.addNewProduct(model);
  }

  checkBarcode(barcode: string): Observable<number | HttpErrorResponse> {
    return this.addProductApi.getCheckBarcode(barcode);
  }
}
