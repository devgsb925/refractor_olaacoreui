import { IRefModels } from './../../orders/components/edit-order/model/i-ref-models';
import { MAddProduct } from './add-product/interfaces/m-add-product';
import { IRefCategory } from './../../../api/products/references/interfaces/i-ref-category';
import { IRefFlags } from './../../../api/products/references/interfaces/i-ref-flags';
import { IVendor } from '../../../shared/components/vendors/i-vendor';
import { IVariant } from './../../../api/products/references/interfaces/i-variant';
import { IProduct } from './interfaces/i-product';
import { ProductReferencesViewModel } from './../../../view-model/product-references-view-model';
import { map, share, switchMap } from 'rxjs/operators';
import { Observable, Subject, Subscription } from 'rxjs';
import { ProductsViewModelService } from './products-view-model.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { IRefBrands } from 'src/app/api/products/references/interfaces/i-ref-brands';
import { ProductsApiService } from './products-api.service';
import { ApiVendorService } from './../../../shared/components/vendors/api-vendor.service';

import { VmVendorService } from './../../../shared/components/vendors/vm-vendor.service';
import { MProduct } from './interfaces/m-product';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  constructor(
    public vm: ProductsViewModelService,
    private api: ProductsApiService,
    private apiVendor: ApiVendorService,
    public vmVendor: VmVendorService,
    public refVm: ProductReferencesViewModel
  ) {}

  showSelectCategory = false;
  showSelectModel = false;

  showAddProduct = false;

  showFieldType = false;
  showFieldKeyword = false;
  showFieldVendorProductName = false;

  searchValue = '';
  searchValueSub = new Subject<string>();
  //#endregion Variable for Search and Sorting

  //#region Variable for Pagination
  pageSize = 15;
  pos = 0;
  //#endregion Variable for Pagination

  showSelectBrand = false;
  showSelectSize = false;
  showSelectColor = false;
  showSelectVendor = false;

  cat1IdSelect = 0;
  cat2IdSelect = 0;
  cat3IdSelect = 0;
  //#endregion Variable for add product


  private subscription = new Subscription();
  //#region Ng
  ngOnInit(): void {
    const hideListStr = localStorage.getItem('hide-list');
    if (hideListStr == null) {
      localStorage.setItem(
        'hide-list',
        JSON.stringify({
          showFieldType: this.showFieldType,
          showFieldKeyword: this.showFieldKeyword,
          showFieldVendorProductName: this.showFieldVendorProductName,
        })
      );
    } else {
      const hideObj = JSON.parse(hideListStr);
      this.showFieldKeyword = hideObj.showFieldKeyword;
      this.showFieldType = hideObj.showFieldType;
      this.showFieldVendorProductName = hideObj.showFieldVendorProductName;
    }

    if (this.vmVendor.getLength() === 0) {
      const vendorSub = this.apiVendor.getList('', 0, 500).subscribe({
        next: (res) => this.vmVendor.setVendors(res),
        error: this.alertError,
        complete: () => {
          this.initProducts();
          this.searchValueSub.next('');
        },
      });
      this.subscription.add(vendorSub);
    } else {
      this.initProducts();
      this.searchValueSub.next('');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getProducts(): Observable<IProduct[]> {
    return this.vm.products$.pipe(
      map((products) =>
        products.slice(
          this.pos * this.pageSize,
          (this.pos + 1) * this.pageSize
        )
      )
    );
  }

  checkUpdateActive(id: number): boolean {
    const product = this.vm.getProductSelected();
    return product !== undefined
      ? product.productId === id
        ? true
        : false
      : false;
  }

  clearSelectBrand(): void {
    this.vm.setBrand(1, 'No Brand');
    this.onFormChange();
  }

  clearSelectColor(): void {
    this.vm.setColor(0, 'none');
    this.onFormChange();
  }

  clearSelectSize(): void {
    this.vm.setSize(0, 'none');
    this.onFormChange();
  }

  //#region Init
  initProducts(): void {
    const searchSub = this.searchValueSub
      .pipe(
        switchMap((value) => {
          return this.api.getList(value, 0, 100);
        }),
        share()
      )
      .subscribe((res) => {
        if (res.length > 0) {
          const products: IProduct[] = res.map((r) => {
            const size: IVariant = this.refVm.getSize(r.variantIds);
            const color: IVariant = this.refVm.getColor(r.variantIds);
            const version: IVariant = this.refVm.getVersion(r.variantIds);
            const warranty: IVariant = this.refVm.getWarranty(r.variantIds);
            const shipFlag: IRefFlags = this.refVm.getShippingFlag(r.flagIds);

            const promotionFlag: IRefFlags = this.refVm.getPromotionFlag(
              r.flagIds
            );
            const lifecycleFlag: IRefFlags = this.refVm.getLifecycleFlag(
              r.flagIds
            );
            const category1: IRefCategory = this.refVm.getCategoryByIndex(
              r.categoryIds,
              1
            );
            const category2: IRefCategory = this.refVm.getCategoryByIndex(
              r.categoryIds,
              2
            );
            const category3: IRefCategory = this.refVm.getCategoryByIndex(
              r.categoryIds,
              3
            );
            return {
              ...r,
              brandName: this.refVm.getBrandNameById(r.brandId),
              modelName: this.refVm.getModelById(r.modelId),
              versionId: version?.variantId,
              versionName: version?.variantValue,
              sizeId: size?.variantId,
              sizeName: size?.variantValue,
              colorId: color?.variantId,
              colorName: color?.variantValue,
              promotionFlagId: promotionFlag?.refFlagId,
              promotionFlagName: promotionFlag?.name,
              shippingFlagId: shipFlag?.refFlagId,
              shippingFlagName: shipFlag?.name,
              lifecycleFlagId: lifecycleFlag?.refFlagId,
              lifecycleFlagName: lifecycleFlag?.name,
              warrantyId: warranty?.variantId,
              warrantyName: warranty?.variantValue,
              category1Id: category1?.refCategoryId,
              category1Name: category1?.name,
              category2Id: category2?.refCategoryId,
              category2Name: category2?.name,
              category3Id: category3?.refCategoryId,
              category3Name: category3?.name,
            };
          });
          this.vm.setProducts(products);
        } else {
          alert('No Content');
        }
      });
    this.subscription.add(searchSub);
  }
  //#endregion Init

  //#region method for search and sorting
  onSearchValueChange(): void {
    this.pos = 0;
    this.searchValueSub.next(this.searchValue);
  }



  updateProductFunc(): void {
    if (this.vm.getProductSelected().vendorId > 0) {
      const p = this.vm.getProductSelected();
      const model: MProduct = {
        productId: p.productId,
        sku: p.sku,
        modelId: p.modelId,
        modelName: p.modelName,
        productNo: p.productNo,
        productDesc: p.productDesc,
        vendorId: p.vendorId,
        vendorProductName: p.vendorProductName,
        brandId: p.brandId,
        brandName: p.brandName,
        productType: p.productType,
        keywords: p.keywords,
        orderIndex: p.orderIndex,
        remark: p.remark,
        flagIds: [
          p.shippingFlagId,
          p.promotionFlagId,
          p.lifecycleFlagId,
        ].filter((id) => id > 0),
        categoryIds: [p.category1Id, p.category2Id, p.category3Id].filter(
          (id) => id > 0
        ),
        variantIds: [p.sizeId, p.colorId, p.versionId, p.warrantyId].filter(
          (id) => id > 0
        ),
        publishStatus: p.publishStatus,

        srp: p.srp,
        stockQty: p.stockQty,
        reorderQty: p.reorderQty,
      };
      const updateProductSub = this.api.updateProduct(model).subscribe({
        next: (res) => {
          if (res == 0) return;
          this.vm.updateProductList(this.updateProductName(p));
          alert('Update product Success');
        },
        error: this.alertError,
        complete: () => this.vm.clearProductSelected(),
      });
      this.subscription.add(updateProductSub);
    } else if (this.vm.getProductSelected().vendorId == 0) {
      alert('Error !! Should be Select vendor be for Update');
    }
  }

  updateProductName(product: IProduct): IProduct {
    product.shippingFlagName = this.refVm.getShippingFlag([
      product.shippingFlagId,
    ]).name;
    product.versionName = this.refVm.getVersion([
      product.versionId,
    ]).variantValue;
    product.promotionFlagName = this.refVm.getPromotionFlag([
      product.promotionFlagId,
    ]).name;
    product.lifecycleFlagName = this.refVm.getLifecycleFlag([
      product.lifecycleFlagId,
    ]).name;
    return product;
  }

  deleteProductFunc(productId: number): void {
    if (window.confirm('Are your sure to delete this product?')) {
      const deleteProductSub = this.api
        .deleteProduct(productId)
        .subscribe((res) => {
          if (res !== undefined && res !== null && res > 0) {
            this.vm.deleteProduct(productId);
          }
          if (res === 0 || typeof res !== 'number') {
            alert('This product have transaction you can not delete!!');
          }
        });
      this.subscription.add(deleteProductSub);
    }
  }

  onSelectProduct(product: IProduct): void {
    const prod = this.vm.getProductSelected();
    if (prod !== undefined) {
      if (prod.productId !== 0 && prod.productId !== product.productId) {
        if (window.confirm('Are you want to change select product?')) {
          this.vm.setProductSelected(product);
        }
      }
    } else {
      this.vm.setProductSelected(product);
    }
  }

  showAddProductFunc(): void {
    this.showAddProduct = true;
  }

  showSelectCategoryFunc(product: IProduct): void {
    this.cat1IdSelect = product.category1Id;
    this.cat2IdSelect = product.category2Id;
    this.cat3IdSelect = product.category3Id;
    this.showSelectCategory = true;
  }

  onSelectCategory(categories: IRefCategory[]): void {
    this.cat1IdSelect = 0;
    this.cat2IdSelect = 0;
    this.cat3IdSelect = 0;

    this.vm.updateCategoryProductSelected(categories);
    this.showSelectCategory = false;
  }

  getCategoryName(prod: IProduct): string {
    return prod.category3Id !== 0
      ? prod.category3Name
      : prod.category2Id !== 0
      ? prod.category2Name
      : prod.category1Id !== 0
      ? prod.category1Name
      : ' none';
  }

  onAddSuccessfully(model: MAddProduct): void {
    const size: IVariant = this.refVm.getSize(model.variantIds);
    const color: IVariant = this.refVm.getColor(model.variantIds);
    const version: IVariant = this.refVm.getVersion(model.variantIds);
    const shipFlag: IRefFlags = this.refVm.getShippingFlag(model.flagIds);
    const vendorName: string = this.vmVendor.getNameById(model.vendorId);
    const promotionFlag: IRefFlags = this.refVm.getPromotionFlag(model.flagIds);
    const lifecycleFlag: IRefFlags = this.refVm.getLifecycleFlag(model.flagIds);

    const warranty: IVariant = this.refVm.getWarranty(model.variantIds);
    const category1: IRefCategory = this.refVm.getCategoryByIndex(
      model.categoryIds,
      1
    );
    const category2: IRefCategory = this.refVm.getCategoryByIndex(
      model.categoryIds,
      2
    );
    const category3: IRefCategory = this.refVm.getCategoryByIndex(
      model.categoryIds,
      3
    );

    const newProduct: IProduct = {
      ...model,
      vendorName,
      productImage: null,
      brandName: this.refVm.getBrandNameById(model.brandId),
      modelName: this.refVm.getModelById(model.modelId),
      versionId: version.variantId,
      versionName: version.variantValue,
      sizeId: size.variantId,
      sizeName: size.variantValue,
      colorId: color.variantId,
      colorName: color.variantValue,
      promotionFlagId: promotionFlag.refFlagId,
      promotionFlagName: promotionFlag.name,
      shippingFlagId: shipFlag.refFlagId,
      shippingFlagName: shipFlag.name,
      lifecycleFlagId: lifecycleFlag.refFlagId,
      lifecycleFlagName: lifecycleFlag.name,
      warrantyId: warranty.variantId,
      warrantyName: warranty.variantValue,
      category1Id: category1.refCategoryId,
      category1Name: category1.name,
      category2Id: category2.refCategoryId,
      category2Name: category2.name,
      category3Id: category3.refCategoryId,
      category3Name: category3.name,
    };
    this.vm.addProduct(newProduct);
  }

  onSelectModel(model: IRefModels): void {
    this.vm.setModel(model.refModelId, model.name);
    this.onFormChange();
  }

  onSelectBrand(brand: IRefBrands): void {
    this.vm.setBrand(brand.refBrandId, brand.name);
    this.onFormChange();
  }

  onSelectSize(size: IVariant): void {
    this.vm.setSize(size.variantId, size.variantValue);
    this.onFormChange();
  }

  onSelectColor(color: IVariant): void {
    this.vm.setColor(color.variantId, color.variantValue);
    this.onFormChange();
  }

  onSelectVendor(vendor: IVendor): void {
    this.vm.setVendor(vendor.purchasingVendorId, vendor.vendorName);
  }

  onFormChange(): void {
    const product = this.vm.getProductSelected();
    const name = this.refVm.getModelById(product.modelId);
    const version = this.refVm.getVersion([product.versionId]).variantValue;
    const size = product.sizeName;
    const brand = product.brandName;
    const type = product.productType;
    const keywords = product.keywords;
    let newDescription = `${name} ${type} ${size} ${keywords} ${version} ${brand}`;
    newDescription = newDescription.replace('No Brand', '');
    newDescription = newDescription.replace('none', '');
    newDescription = newDescription.replace('No Model', '');
    newDescription = newDescription.replace('-', '');

    this.vm.setProductSelectedDesc(newDescription);
  }

  updateHideList(): void {
    localStorage.setItem(
      'hide-list',
      JSON.stringify({
        showFieldType: this.showFieldType,
        showFieldKeyword: this.showFieldKeyword,
        showFieldVendorProductName: this.showFieldVendorProductName,
      })
    );
  }

  private alertError = (err) => {
    let errorMesg = '';
    for (let e in err) {
      if (typeof err[e] == 'object') continue;
      if ((e == 'error' || e == 'message') && errorMesg.length == 0)
        errorMesg = err[e];
    }
    alert(errorMesg);
    console.log(err);
  };
}
