import { IUpdateOrderindexCategory } from './interfaces/i-update-orderindex-category';
import { IUpdateNameCategory } from './interfaces/i-update-name-category';
import { IDeleteCategory } from './interfaces/i-delete-category';
import { IAddCategory } from './interfaces/i-add-category';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriesApiService } from './categories-api.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoriesViewModelService {
  constructor(private categoryApi: CategoriesApiService) {}

  addCategory(
    parentId: number,
    name: string,
    pendingFile: File
  ): Observable<number> {
    const model = new FormData();
    model.append('parentId', parentId.toString());
    model.append('name', name);
    if (pendingFile !== null) {
      model.append('files[]', pendingFile);
    }
    return this.categoryApi.addCategoryToApi(model);
  }

  deleteCategory(ids: number[]): Observable<number | HttpErrorResponse> {
    const model: IDeleteCategory = { ids };
    return this.categoryApi.deleteCategoryFromApi(model);
  }

  updateNameCategory(
    refCategoryId: number,
    name: string,
    icon: string,
    pendingFile: File
  ): Observable<number> {
    const model = new FormData();
    model.append('refCategoryId', refCategoryId.toString());
    model.append('name', name);
    model.append('icon', icon);
    if (pendingFile !== null) {
      model.append('files[]', pendingFile);
    }

    return this.categoryApi.updateNameCategoryToApi(model);
  }

  updateOrderIndexCategory(
    data: { RefCategoryId: number; OrderIndex: number }[]
  ): Observable<number> {
    const model: IUpdateOrderindexCategory = { RefCatorderIndexs: data };
    return this.categoryApi.updateOrderIndexToApi(model);
  }
}
