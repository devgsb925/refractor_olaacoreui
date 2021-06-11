import { EndPoint } from 'src/app/security/end-point';
import { MAddModel } from './../api/products/references/interfaces/m-add-model';
import { IRefModels } from './../pages/orders/components/edit-order/model/i-ref-models';
import { MAddVariant } from './../api/products/references/interfaces/m-add-variant';
import { HttpErrorResponse } from '@angular/common/http';
import { IVariant } from './../api/products/references/interfaces/i-variant';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductsReferencesService } from 'src/app/api/products/references/products-references.service';
import { IRefBrands } from '../api/products/references/interfaces/i-ref-brands';
import { IRefCategory } from '../api/products/references/interfaces/i-ref-category';
import { IRefFlags } from '../api/products/references/interfaces/i-ref-flags';
import { IRefProductName } from '../api/products/references/interfaces/i-ref-product-name';

import { IRefExchangeRate } from '../api/products/references/interfaces/i-ref-exchange-rate';
import { IRefCurrencyTypes } from '../api/products/references/interfaces/i-ref-refCurrencyTypes';
import { IRefCouriers } from '../pages/shipment/dto/interfaces/i-ref-couriers';
import { IRefForwarders } from '../pages/shipment/dto/interfaces/i-ref-forwarder';

@Injectable({ providedIn: 'root' })
export class ProductReferencesViewModel {
  private exchangeRates: IRefExchangeRate[] = [];

  refModelsList: IRefModels[] = [];
  refBrandsList: IRefBrands[] = [];

  private variants: IVariant[] = [];
  private dsVariants = new BehaviorSubject(this.variants);
  Variants$ = this.dsVariants.asObservable();

  private refCategoriesList: IRefCategory[] = [];
  private dsrefCategoriesList = new BehaviorSubject(this.refCategoriesList);
  RefCategories$ = this.dsrefCategoriesList.asObservable();

  private refFlagsList: IRefFlags[] = [];
  private dsRefFlagsList = new BehaviorSubject(this.refFlagsList);
  RefFlagslist$ = this.dsRefFlagsList.asObservable();

  refProductNameList: IRefProductName[] = [];
  private dsRefProductNameList = new BehaviorSubject(this.refProductNameList);
  RefProductNameList$ = this.dsRefProductNameList.asObservable();

  refCurrencyTypes: IRefCurrencyTypes[] = [];
  private dsRefCurrencyTypes = new BehaviorSubject(this.refCurrencyTypes);
  RefCurrencyTypes$ = this.dsRefCurrencyTypes.asObservable();

  constructor(private referenceApi: ProductsReferencesService) {}

  //#region ExchangeRate
  setRefExchangeRate(exRates: IRefExchangeRate[]): void {
    this.exchangeRates = exRates;
  }
  getExchangeRates(): IRefExchangeRate[] {
    return this.exchangeRates;
  }

  getExchangeRateValue(name: string): number {
    return this.exchangeRates.find((ex) => ex.currencyName.includes(name)).rate;
  }
  //#endregion

  //#region Brand

  addModelToApi(name: string): Observable<number | HttpErrorResponse> {
    const model: MAddModel = { name };
    return this.referenceApi.addModelToServer(model);
  }

  addNewModelToList(model: IRefModels): void {
    this.refModelsList = [model].concat(this.refModelsList);
  }

  addBrandToApi(name: string, file: File): Observable<number> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append(
      'orderIndex',
      (Math.max(...this.refBrandsList.map((b) => b.orderIndex)) + 1).toString()
    );
    if (file !== null) {
      formData.append('files[]', file);
    }
    return this.referenceApi.addBrandToServer(formData);
  }

  addNewBrandToList(brand: IRefBrands): void {
    this.refBrandsList = [brand].concat(this.refBrandsList);
  }

  checkExistModel(value: string): boolean {
    return this.refModelsList.find(
      (model) => model.name.toLowerCase() === value.toLowerCase()
    ) !== undefined
      ? true
      : false;
  }

  checkExistBrand(value: string): boolean {
    return this.refBrandsList.find(
      (brand) => brand.name.toLowerCase() === value.toLowerCase()
    ) !== undefined
      ? true
      : false;
  }

  setRefModels(modelList: IRefModels[]): void {
    this.refModelsList = modelList;
  }

  setRefBrands(brandlist: IRefBrands[]): void {
    this.refBrandsList = brandlist.map((brand) => {
      brand.url =
        brand.url !== null && brand.url !== ''
          ? EndPoint.MainUri + 'files/' + brand.url
          : '';
      return brand;
    });
  }

  getModels(): IRefModels[] {
    return this.refModelsList;
  }

  getModelById(id: number): string {
    const model = this.refModelsList.find((m) => m.refModelId === id);
    return model !== undefined ? model.name : '';
  }

  getBrands(): IRefBrands[] {
    return this.refBrandsList;
  }

  getBrandNameById(id: number): string {
    const brand = this.refBrandsList.find((b) => b.refBrandId === id);
    return brand !== undefined ? brand.name : '';
  }

  getBrandsByName(name: string): IRefBrands {
    return this.refBrandsList.find((itx) => itx.name === name);
  }
  //#endregion

  //#region Category

  addCategories(category: IRefCategory): void {
    category.icon =
      category.icon !== '' && category.icon !== null
        ? EndPoint.MainUri + 'files/' + category.icon
        : '';
    this.refCategoriesList = this.refCategoriesList.concat(category);
    this.dsrefCategoriesList.next(this.refCategoriesList);
  }

  checkCategoryExist(name: string): boolean {
    return (
      this.refCategoriesList.find(
        (cat) => cat.name.toLowerCase() === name.toLowerCase()
      ) !== undefined
    );
  }

  removeCategoriesByIds(ids: number[]): void {
    this.refCategoriesList = this.refCategoriesList.filter(
      (cat) => !ids.includes(cat.refCategoryId) && !ids.includes(cat.parentId)
    );
    this.dsrefCategoriesList.next(this.refCategoriesList);
  }

  updateCategoryName(id: number, name: string, icon: string): void {
    if (
      this.refCategoriesList.find((cat) => cat.refCategoryId === id) !==
      undefined
    ) {
      const index = this.refCategoriesList.findIndex(
        (cat) => cat.refCategoryId === id
      );
      this.refCategoriesList[index].name = name;
      this.refCategoriesList[index].icon = EndPoint.MainUri + 'files/' + icon;
    }
    this.dsrefCategoriesList.next(this.refCategoriesList);
  }

  // updateCategoryOrderIndex(
  //   data: { RefCategoryId: number; OrderIndex: number }[]
  // ): void {
  //   data.forEach((d) => {
  //     this.refCategoriesList[
  //       this.refCategoriesList.findIndex(
  //         (r) => r.refCategoryId === d.RefCategoryId
  //       )
  //     ].orderIndex = d.OrderIndex;
  //   });
  // }

  setRefCategories(catgories: IRefCategory[]): void {
    this.refCategoriesList = catgories.map(c => {
      c.icon = c.icon !== '' && c.icon !== null ? EndPoint.MainUri + 'files/' + c.icon : '';
      return c;
    });
    this.dsrefCategoriesList.next(this.refCategoriesList);
  }

  getCategories(): IRefCategory[] {
    return this.refCategoriesList.sort(this.compareCategory);
  }

  getCategoryById(id: number): IRefCategory {
    return this.refCategoriesList.find((c) => c.refCategoryId === id);
  }
  getCategoriesById(id: number): IRefCategory[] {
    return this.refCategoriesList
      .filter((c) => c.parentId === id)
      .sort(this.compareCategory);
  }

  getCategoryNameById(id: number): string {
    const category = this.refCategoriesList.find((c) => c.refCategoryId === id);
    return category !== undefined ? category.name : '';
  }

  getCategoryByIndex(ids: number[], index: number): IRefCategory {
    let category: IRefCategory;
    switch (index) {
      case 1:
        category = this.refCategoriesList.find(
          (c) => c.parentId === 1 && ids.includes(c.refCategoryId)
        );
        break;
      case 2:
        category = this.refCategoriesList.find(
          (c) =>
            this.refCategoriesList
              .filter((c1) => c1.parentId === 1)
              .map((c1) => c1.refCategoryId)
              .includes(c.parentId) && ids.includes(c.refCategoryId)
        );
        break;
      case 3:
        category = this.refCategoriesList.find(
          (c) =>
            this.refCategoriesList
              .filter((c1) => c1.parentId > 1)
              .map((c1) => c1.refCategoryId)
              .includes(c.parentId) && ids.includes(c.refCategoryId)
        );
        break;
    }
    return category !== undefined
      ? category
      : {
          refCategoryId: 0,
          name: 'none',
          icon: 'none',
          orderIndex: 0,
          parentId: 0,
          bannerUrl: '',
          link: ''
        };
  }
  //#endregion

  //#region Product Name

  setRefProductName(refProductName: IRefProductName[]): void {
    this.refProductNameList = refProductName;
    this.dsRefProductNameList.next(this.refProductNameList);
  }
  getProductName(): IRefProductName[] {
    return this.refProductNameList;
  }

  getProductNameById(id: number): string {
    const ProductName = this.refProductNameList.find(
      (m) => m.refProducNameId === id
    );
    return ProductName !== undefined ? ProductName.name : '';
  }

  getProductNameByName(name: string): IRefProductName {
    return this.refProductNameList.find((f) => f.name === name);
  }
  //#endregion

  //#region Flag
  setRefFlags(refFlags: IRefFlags[]): void {
    this.refFlagsList = refFlags;
    this.dsRefFlagsList.next(this.refFlagsList);
  }

  getFlagNameById(id: number): string {
    const flag = this.refFlagsList.find((f) => f.refFlagId === id);
    return flag !== undefined ? flag.name : '';
  }

  getShippingFlag(ids: number[]): IRefFlags {
    const shippingFlag = this.refFlagsList.find(
      (f) => ids.find((id) => [7, 8].includes(id)) === f.refFlagId
    );
    return shippingFlag !== undefined
      ? shippingFlag
      : { refFlagId: 0, name: 'No Shipping', icon: '', orderIndex: 0 };
  }

  getPromotionFlag(ids: number[]): IRefFlags {
    const promotionFlag = this.refFlagsList.find(
      (f) => ids.find((id) => [1, 2, 3, 4].includes(id)) === f.refFlagId
    );
    return promotionFlag !== undefined
      ? promotionFlag
      : { refFlagId: 0, name: 'none', icon: '', orderIndex: 0 };
  }

  getLifecycleFlag(ids: number[]): IRefFlags {
    const lifecycleFlag = this.refFlagsList.find(
      (f) => ids.find((id) => [9, 10, 11].includes(id)) === f.refFlagId
    );
    return lifecycleFlag !== undefined
      ? lifecycleFlag
      : { refFlagId: 0, name: 'none', icon: '', orderIndex: 0 };
  }

  //#endregion

  //#region CurrencyType
  setRefCurrencyTypes(refCurrencyTypes: IRefCurrencyTypes[]): void {
    this.refCurrencyTypes = [];
    this.refCurrencyTypes = refCurrencyTypes;
    this.dsRefCurrencyTypes.next(this.refCurrencyTypes);
  }

  getRefCurrencyTypes(): IRefCurrencyTypes[] {
    return this.refCurrencyTypes;
  }

  getRefCurrencyTypeById(id: number): IRefCurrencyTypes {
    return this.refCurrencyTypes.find(
      (cur) => cur.purchasingRefCurrencyTypeId === id
    );
  }

  //#endregion

  //#region Variant
  addVariantToApi(
    variantValue: string,
    refVariantsName: string
  ): Observable<number | HttpErrorResponse> {
    const model: MAddVariant = { variantValue, refVariantsName };
    return this.referenceApi.addVariantToServer(model);
  }

  addNewVariantToList(variant: IVariant): void {
    this.variants = [variant].concat(this.variants);
  }

  checkExistVariant(value: string): boolean {
    return this.variants.find(
      (variant) => variant.variantValue.toLowerCase() === value.toLowerCase()
    ) !== undefined
      ? true
      : false;
  }

  setVariants(variants: IVariant[]): void {
    this.variants = variants;
  }
  getVariants(): IVariant[] {
    return this.variants;
  }

  getSize(ids: number[]): IVariant {
    const size = this.variants.find(
      (v) => v.refVariantName === 'Size' && ids.includes(v.variantId)
    );
    return size !== undefined
      ? size
      : { variantId: 0, variantValue: 'none', refVariantName: 'Size' };
  }

  getSizes(): IVariant[] {
    return this.variants.filter((v) => v.refVariantName === 'Size');
  }

  getColor(ids: number[]): IVariant {
    const color = this.variants.find(
      (v) => v.refVariantName === 'Color' && ids.includes(v.variantId)
    );
    return color !== undefined
      ? color
      : { variantId: 0, variantValue: 'none', refVariantName: 'Color' };
  }

  getColors(): IVariant[] {
    return this.variants.filter((v) => v.refVariantName === 'Color');
  }

  getVersion(ids: number[]): IVariant {
    const version = this.variants.find(
      (v) => v.refVariantName === 'Version' && ids.includes(v.variantId)
    );
    return version !== undefined
      ? version
      : { variantId: 0, variantValue: 'none', refVariantName: 'Version' };
  }

  getVersions(): IVariant[] {
    return this.variants.filter((v) => v.refVariantName === 'Version');
  }

  getWarranty(ids: number[]): IVariant {
    const warranty = this.variants.find(
      (v) => v.refVariantName === 'Warranty' && ids.includes(v.variantId)
    );

    if (warranty !== undefined) {
      return warranty;
    } else if (
      this.variants.find(
        (variant) => variant.variantValue === 'No Warranty'
      ) !== undefined
    ) {
      return this.variants.find(
        (variant) => variant.variantValue === 'No Warranty'
      );
    } else {
      return this.variants[
        this.variants.findIndex(
          (one) =>
            one.variantId ===
            Math.min(
              ...this.variants
                .filter((three) => three.refVariantName === 'Warranty')
                .map((two) => two.variantId)
            )
        )
      ];
    }
  }

  //#endregion

  readCouriers(): Observable<IRefCouriers[]> {
    return this.referenceApi.readCouriers();
  }

  readForwarders(): Observable<IRefForwarders[]> {
    return this.referenceApi.readForwarders();
  }

  quickCreateCouriers(name: string, address: string): Observable<number> {
    return this.referenceApi.quickCreateCourier(name, address);
  }

  quickCreateForwarder(name: string): Observable<number> {
    return this.referenceApi.quickCreateForwarder(name, '');
  }

  compareCategory(a: IRefCategory, b: IRefCategory): number {
    if (a.orderIndex < b.orderIndex) {
      return -1;
    }
    if (a.orderIndex > b.orderIndex) {
      return 1;
    }
    return 0;
  }
}
