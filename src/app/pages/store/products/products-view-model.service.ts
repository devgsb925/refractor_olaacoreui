import { IRefCategory } from './../../../api/products/references/interfaces/i-ref-category';
import { IProductSource } from './interfaces/i-product-source';
import { IProduct } from './interfaces/i-product';
import { MProduct } from './interfaces/m-product';
import { IVendor } from '../../../shared/components/vendors/i-vendor';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductsApiService } from './products-api.service';
import { Injectable } from '@angular/core';
import { EndPoint } from 'src/app/security/end-point';

@Injectable()
export class ProductsViewModelService {
  constructor() {}

  private productSelected: IProduct;
  private products: IProduct[] = [];
  private dsProducts = new BehaviorSubject(this.products);
  products$ = this.dsProducts.asObservable();

  //#region Products
  addProduct(prod: IProduct): void {
    this.products.unshift(prod);
    this.dsProducts.next(this.products);
  }
  clearProducts(): void {
    this.products = [];
    this.dsProducts.next(this.products);
  }

  setProducts(prods: IProduct[]): void {
    this.products = prods.map((prod) => {
      if (prod.productImage != null) prod.productImage = EndPoint.MainUri + 'files/' + prod.productImage;
      return prod;
    });
    this.dsProducts.next(this.products);
  }

  getProductsLength = () => this.dsProducts.value.length;

  //#endregion

  //#region Product Selected

  addProductSelectedToList(): void {
    this.addProduct(this.productSelected);
  }
  clearProductSelected(): void {
    this.productSelected = undefined;
  }

  setProductSelected(product: IProduct): void {
    this.productSelected = { ...product };
  }

  getProductSelected(): IProduct {
    return this.productSelected;
  }

  clearSelectedCategory(): void {
    this.productSelected.category1Id = 0;
    this.productSelected.category1Name = 'none';

    this.productSelected.category2Id = 0;
    this.productSelected.category2Name = '';

    this.productSelected.category3Id = 0;
    this.productSelected.category3Name = '';
  }


  setProductSelectedDesc(desc: string): void {
    this.productSelected.productDesc = desc;
  }

  setModel(id: number, name: string): void {
    this.productSelected.modelId = id;
    this.productSelected.modelName = name;
  }

  setBrand(id: number, name: string): void {
    this.productSelected.brandId = id;
    this.productSelected.brandName = name;
  }

  setSize(id: number, name: string): void {
    this.productSelected.sizeId = id;
    this.productSelected.sizeName = name;
  }

  setColor(id: number, name: string): void {
    this.productSelected.colorId = id;
    this.productSelected.colorName = name;
  }

  setCategory1(id: number, name: string): void {
    this.productSelected.category1Id = id;
    this.productSelected.category1Name = name;
  }

  setCategory2(id: number, name: string): void {
    this.productSelected.category2Id = id;
    this.productSelected.category2Name = name;
  }

  setCategory3(id: number, name: string): void {
    this.productSelected.category3Id = id;
    this.productSelected.category3Name = name;
  }
  //#endregion

  getProduct(id: number): IProduct {
    return this.products.find((p) => p.productId === id);
  }

  updateProductList(product: IProduct): void {
    this.products[
      this.products.findIndex((p) => p.productId === product.productId)
    ] = product;
  }

  deleteProduct(productId: number): void {
    this.products = this.products.filter((p) => p.productId !== productId);
  }

  // deleteProductFromServer(productId: number): Observable<number> {
  //   return this.productApi.deleteProduct(productId);
  // }

  // readVendor(): Observable<IVendor[]> {
  //   return this.productApi.getVendors();
  // }

  setVendor(id: number, name: string): void {
    this.productSelected.vendorId = id;
    this.productSelected.vendorName = name;
  }

  updateCategoryProductSelected(categories: IRefCategory[]): void {
    this.productSelected.category1Id =
      categories[0] !== undefined ? categories[0].refCategoryId : 0;
    this.productSelected.category1Name =
      categories[0] !== undefined ? categories[0].name : 'none';
    this.productSelected.category2Id =
      categories[1] !== undefined ? categories[1].refCategoryId : 0;
    this.productSelected.category2Name =
      categories[1] !== undefined ? categories[1].name : 'none';
    this.productSelected.category3Id =
      categories[2] !== undefined ? categories[2].refCategoryId : 0;
    this.productSelected.category3Name =
      categories[2] !== undefined ? categories[2].name : 'none';
  }
}
