import { IDeleteCategory } from './interfaces/i-delete-category';
import { take } from 'rxjs/operators';
import { EndPoint } from './../../../security/end-point';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUpdateOrderindexCategory } from './interfaces/i-update-orderindex-category';

@Injectable()
export class CategoriesApiService {

  constructor(private http: HttpClient) { }

  private urlCategories = 'api/products/categories';
  private urlAddCategory = 'api/products/categories/add';
  private urlUpdateName = 'api/products/categories/update-name';
  private urlUpdateOrderIndex = 'api/products/categories/update-orderindex';
  private urlDeleteCategory = 'api/products/categories/delete';

  private urlDeleteIcon = EndPoint.MainUri + 'api/products/categories/delete-icon';

  categories(): Observable<any>{
    return this.http.get(EndPoint.MainUri + this.urlCategories).pipe(
      take(1),
    );
  }


  addCategoryToApi(model: FormData): Observable<number>{
    return this.http.post<number>(EndPoint.MainUri + this.urlAddCategory, model).pipe(
      take(1),
    );
  }

  updateNameCategoryToApi(model): Observable<number>{
    return this.http.put<number>(EndPoint.MainUri + this.urlUpdateName, model).pipe(
      take(1)
    );
  }

  updateOrderIndexToApi(model: IUpdateOrderindexCategory): Observable<number>{
    return this.http.put<number>(EndPoint.MainUri + this.urlUpdateOrderIndex, model).pipe(
      take(1)
    );
  }

  deleteCategoryFromApi(model: IDeleteCategory): Observable<number>{
    return this.http.post<number>(EndPoint.MainUri + this.urlDeleteCategory, model).pipe(
    take(1)
    );
  }

  deleteIcon(id: number): Observable<number>{
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<number>(this.urlDeleteIcon, {params}).pipe(take(1));
  }
}
