import { IProductInventory } from '../dto/interface/i-product-inventory';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StockService } from '../api/Stock.service';
import { ProductReferencesViewModel } from '../../../../../view-model/product-references-view-model';
import { MAddPendinOrder } from '../dto/model/m-add-pendin-order';
import { EndPoint } from 'src/app/security/end-point';

@Injectable()
export class StockViewModelService {

  stocks: IProductInventory[] = [];
  protected dsStocks = new BehaviorSubject(this.stocks);
  Stocks$ = this.dsStocks.asObservable();

  selVendor: number;

  constructor(
    private apiStock: StockService,
    private vmProductReferences: ProductReferencesViewModel,
    private refVm: ProductReferencesViewModel
  ) {}

  setStock(stock: IProductInventory[]): void {
    this.stocks = stock.map((s) => {
      if (s.productImage != null)
        s.productImage = EndPoint.MainUri + 'files/' + s.productImage;
      return s;
    });
    this.dsStocks.next(stock);
  }

  public SetUpdateTable(stock): void {
    this.stocks
      .filter((f) => f.productId === stock.productId)
      .forEach((itx) => {
        itx.hasPendingOrder = true;
      });

    this.dsStocks.next(this.stocks);
  }

  getItemCount(): number {
    return this.stocks.length;
  }



  getBrandName(id): string {
    return this.vmProductReferences.refBrandsList.find(
      (f) => f.refBrandId === id
    ).name;
  }

  updateProductStock(model): Observable<number> {
    return this.apiStock.updateProductStock(model);
  }

  addpendingOrder(model: MAddPendinOrder): Observable<any> {
    return this.apiStock.addpendingOrder(model);
  }

  BrandById(bid: number): string {
    return this.refVm.getBrandNameById(bid);
  }
}
