import { IRefModels } from './../../../../../orders/components/edit-order/model/i-ref-models';
import { DetailViewModelService } from './../../detail-view-model.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { IRefBrands } from 'src/app/api/products/references/interfaces/i-ref-brands';
import { IVariant } from 'src/app/api/products/references/interfaces/i-variant';
import { IRefCategory } from 'src/app/api/products/references/interfaces/i-ref-category';
import { Subscription, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsViewModelService } from '../../../products-view-model.service';
import { EndPoint } from 'src/app/security/end-point';
import { MUpdateProduct } from '../../interfaces/m-update-product';
import { IRefFlags } from 'src/app/api/products/references/interfaces/i-ref-flags';
import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';
import { IVendor } from '../../../../../../shared/components/vendors/i-vendor';
import { IProduct } from '../../../interfaces/i-product';
import { debounceTime, switchMap } from 'rxjs/operators';
import { VmVendorService } from 'src/app/shared/components/vendors/vm-vendor.service';
import { timeStamp } from 'console';

export const EXTERNAL_MINIMUME_TOTAL_PRICE = 200000;

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private routerSnapshot: ActivatedRoute,
    private fb: FormBuilder,
    public productViewModel: ProductsViewModelService,
    public refViewModel: ProductReferencesViewModel,
    private detailViewModel: DetailViewModelService,
    public vmVendor: VmVendorService
  ) {}

  //#region variable for modal
  showVendorModal = false;
  showModelModal = false;
  showBrandModal = false;
  showColorModal = false;
  showSizeModal = false;
  showCategoryModal = false;

  imgUrl = '';
  uid = 0;
  newBarcode = '';

  private exchangeRate = 0;
  private productId = 0;
  private newBarcodeSub = new Subject<string>();

  spinBarcode = false;

  private subscription = new Subscription();

  productDetailForm = this.fb.group({
    // Detail
    productId: [0, Validators.required],
    sku: [''],
    modelId: [0],
    modelName: ['', Validators.required],
    productNo: [''],
    brandId: [1, Validators.required],
    brandName: ['No Brand', Validators.required],
    productDesc: ['', Validators.required],
    productType: [''],
    keywords: [''],

    // Variants
    versionId: [0],
    sizeId: [0],
    sizeName: [''],
    colorId: [0],
    colorName: [''],
    cat1Id: [0],
    cat1Name: [''],
    cat2Id: [0],
    cat2Name: [''],
    cat3Id: [0],
    cat3Name: [''],
    orderIndex: [0, Validators.required],
    publishStatus: [1],

    // flags
    promotionFlagId: [0],
    shipFlagId: [0],
    lifecycleFlagId: [9],

    // Unknown 1
    link: [''],
    remark: [''],
    warrantyPeriod: [12],
    dateUpdated: [''],

    // Vendor
    vendorId: [0, Validators.required],
    vendorName: ['', Validators.required],
    vendorProductName: [''],

    // Pricing
    srp: [0, [Validators.required, Validators.min(1)]],
    rrp: [0],
    msrpUsd: [0, Validators.required],
    competitorThb: [0, Validators.required],
    buyingPrice: [0],
    buyingCurrency: [''],
    shippingCost: [0],

    // Unknown 2
    barcode: [''],

    // Stock detail & distribution
    stockQty: [0],
    unitsInWarehouse: [0],
    unitsOnDisplay: [0],
    unitsOnDemo: [0],
    unitsOnQc: [0],
    reorderQty: [0],
    unitsOnTheWay: [0],
    unitsOnDesposit: [0],
    warehouseLocation: [''],
    uom: [0],
    unitsWeight: [0],
    volumn: [0],
    boxSize: [0],
    sellingShipping: [0],
  });

  ngOnInit(): void {
    this.productId = parseInt(
      this.routerSnapshot.snapshot.paramMap.get('id'),
      10
    );

    const getProductDetailSub = this.detailViewModel
      .readProductDetailFromApiById(this.productId)
      .subscribe((res) => {
        if (
          !(res instanceof HttpErrorResponse) &&
          res !== null &&
          res !== undefined
        ) {
          const c = this.productDetailForm.controls;

          //#region Product Detail
          c.productId.setValue(res.productId);
          c.sku.setValue(res.sku);

          if (res.url !== null) {
            this.imgUrl = EndPoint.MainUri + 'files/' + res.url;
          }
          c.modelId.setValue(res.refModelId);

          c.modelName.setValue(this.refViewModel.getModelById(res.refModelId));
          c.productNo.setValue(res.productNo);
          c.brandId.setValue(res.refBrandId);
          c.brandName.setValue(
            this.refViewModel.getBrandNameById(res.refBrandId)
          );
          c.productDesc.setValue(res.productDesc);
          c.productType.setValue(res.productType);
          c.keywords.setValue(res.keywords);
          //#endregion Product Detail

          //#region Variants
          const version: IVariant = this.refViewModel.getVersion(
            res.refVariantIds
          );
          c.versionId.setValue(version.variantId);

          const size: IVariant = this.refViewModel.getSize(res.refVariantIds);
          c.sizeId.setValue(size.variantId);
          c.sizeName.setValue(size.variantValue);

          const color: IVariant = this.refViewModel.getColor(res.refVariantIds);
          c.colorId.setValue(color.variantId);
          c.colorName.setValue(color.variantValue);

          // get Cat 1
          const cat1 = this.refViewModel.getCategoryByIndex(res.refCateIds, 1);
          c.cat1Id.setValue(cat1.refCategoryId);
          c.cat1Name.setValue(cat1.name);

          // get Cat 2
          const cat2 = this.refViewModel.getCategoryByIndex(res.refCateIds, 2);
          c.cat2Id.setValue(cat2.refCategoryId);
          c.cat2Name.setValue(cat2.name);

          // get cat 3
          const cat3 = this.refViewModel.getCategoryByIndex(res.refCateIds, 3);
          c.cat3Id.setValue(cat3.refCategoryId);
          c.cat3Name.setValue(cat3.name);

          // get order index
          c.orderIndex.setValue(res.orderIndex);

          c.publishStatus.setValue(res.productStatus);

          //#endregion Variants

          //#region Flags
          const promotion = this.refViewModel.getPromotionFlag(res.refFlagIds);
          c.promotionFlagId.setValue(promotion.refFlagId);

          const ship = this.refViewModel.getShippingFlag(res.refFlagIds);
          c.shipFlagId.setValue(ship.refFlagId);

          const lifecycle = this.refViewModel.getLifecycleFlag(res.refFlagIds);
          c.lifecycleFlagId.setValue(lifecycle.refFlagId);
          //#endregion Flags

          //#region Unknown 1
          c.link.setValue(res.link);

          c.remark.setValue(res.remark);
          const warranty = this.refViewModel.getWarranty(res.refVariantIds);
          console.log(warranty);

          c.warrantyPeriod.setValue(warranty.variantId);
          if (res.dateUpdated !== null) {
            const updateDate = new Date(res.dateUpdated);
            c.dateUpdated.setValue(
              updateDate.getDate() +
                '-' +
                updateDate.toLocaleString('default', { month: 'short' }) +
                '-' +
                updateDate.getFullYear()
            );
          }
          //#endregion Unknown 1

          //#region Vendor

          c.vendorId.setValue(res.vendorId);
          c.vendorName.setValue(res.vendorName);
          c.vendorProductName.setValue(res.vendorProductName);

          //#endregion Vendor Name

          //#region Pricing
          c.rrp.setValue(res.rrp);
          c.srp.setValue(res.srp);
          c.msrpUsd.setValue(res.msrpUSD);
          c.competitorThb.setValue(res.competitorTHB);
          c.buyingPrice.setValue(res.buyingPrice);
          if (res.buyingRefCurrencyId !== 0) {
            // c.buyingCurrency.setValue(this.refViewModel.getRefCurrencyTypeById(res.buyingRefCurrencyId).currencyName + ' ' + res.rate);
            c.buyingCurrency.setValue(
              this.refViewModel.getRefCurrencyTypeById(res.buyingRefCurrencyId)
                .currencyName
            );
          } else {
            c.buyingCurrency.setValue('none');
          }
          c.shippingCost.setValue(res.shippingCost);
          //#endregion Pricing

          //#region Unknown 2
          c.barcode.setValue(res.barcode);
          this.uid = res.uidTypeId;
          //#endregion Unknown 2

          //#region Stock details & Distribution

          c.stockQty.setValue(res.stockQty);

          c.unitsInWarehouse.setValue(res.unitsInWarehouse);

          c.unitsOnDisplay.setValue(res.unitsOnDisplay);
          c.unitsOnDemo.setValue(res.unitsOnDemo);
          c.unitsOnQc.setValue(res.unitsOnQc);
          c.reorderQty.setValue(res.reorderQty);

          c.unitsOnTheWay.setValue(res.unitOnTheWay);
          c.unitsOnDesposit.setValue(res.unitsOnDesposit);
          c.warehouseLocation.setValue(res.warehouseLoc);

          c.uom.setValue(res.uom);
          c.unitsWeight.setValue(res.unitsWeight);

          c.volumn.setValue(res.volume);
          c.boxSize.setValue(res.boxSize);

          c.sellingShipping.setValue(res.sellingShipping);
          //#endregion Stock details & Distribution

          this.exchangeRate = res.rate;
        } else {
          const errorRes = res as HttpErrorResponse;
          alert(errorRes.error.text);
        }
      });
    this.subscription.add(getProductDetailSub);

    this.initBarcodeSub();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  clearSelectModel(): void {
    const controls = this.controls();
    controls.modelId.setValue(0);
    controls.modelName.setValue('none');
    this.onFormChange();
  }

  clearSelectBrand(): void {
    const controls = this.controls();
    controls.brandId.setValue(1);
    controls.brandName.setValue('No Brand');
    this.onFormChange();
  }

  clearSelectSize(): void {
    const controls = this.controls();
    controls.sizeId.setValue(0);
    controls.sizeName.setValue('none');
    this.onFormChange();
  }

  checkValidators(formControlName: string): boolean {
    return (
      this.productDetailForm.controls[formControlName].invalid &&
      (this.productDetailForm.controls[formControlName].dirty ||
        this.productDetailForm.controls[formControlName].touched)
    );
  }

  checkError(formControlName: string): boolean {
    return this.productDetailForm.controls[formControlName].errors.required;
  }

  clearSelectColor(): void {
    const controls = this.controls();
    controls.colorId.setValue(0);
    controls.colorName.setValue('none');
  }

  clearSelectCategory(): void {
    const controls = this.controls();
    controls.cat1Id.setValue(0);
    controls.cat1Name.setValue('none');
    controls.cat2Id.setValue(0);
    controls.cat2Name.setValue('');
    controls.cat3Id.setValue(0);
    controls.cat3Name.setValue('');
  }

  closeFunc(): void {
    this.router.navigate(['store/products']);
  }

  controls(): { [key: string]: AbstractControl } {
    return this.productDetailForm.controls;
  }

  getCategoryName(): string {
    const cat1Name = this.productDetailForm.controls.cat1Name.value;
    const cat2Name = this.productDetailForm.controls.cat2Name.value;
    const cat3Name = this.productDetailForm.controls.cat3Name.value;

    return cat3Name !== '' && cat3Name !== 'none'
      ? cat3Name
      : cat2Name !== '' && cat2Name !== 'none'
      ? cat2Name
      : cat1Name !== '' && cat1Name !== 'none'
      ? cat1Name
      : 'none';
  }
  getWarranty(): IVariant[] {
    return this.refViewModel
      .getVariants()
      .filter((variant) => variant.refVariantName === 'Warranty')
      .sort((a, b) => a.variantId - b.variantId);
  }

  getUnitCost(): number {
    const buyingPrice = this.controls().buyingPrice.value;
    const shipCost = this.controls().shippingCost.value;
    return buyingPrice * this.exchangeRate + shipCost;
  }

  getMargin(): number {
    if (this.getUnitCost() > 0) {
      const srp = this.controls().srp.value;
      return srp - this.getUnitCost();
    } else {
      return 0;
    }
  }

  getMarginPercent(): number {
    if (
      this.getUnitCost() !== 0 &&
      this.getMargin() !== 0 &&
      this.getMargin() * 100 > this.getUnitCost()
    ) {
      return (this.getMargin() * 100) / this.getUnitCost();
    } else {
      return 0;
    }
  }

  getRatio(): number {
    const srp = this.controls().srp.value;
    if (srp > 0) {
      return EXTERNAL_MINIMUME_TOTAL_PRICE / srp;
    } else {
      return 0;
    }
  }

  getMarginRatio(): number {
    return this.getMargin() * this.getRatio();
  }

  getRetailThb(): number {
    const srp = this.controls().srp.value;
    const rate = this.refViewModel.getExchangeRateValue('BAHT');
    if (srp > 0 && rate !== undefined) {
      return Math.ceil(srp / rate);
    } else {
      return 0;
    }
  }

  getRetailUsd(): number {
    const srp = this.controls().srp.value;
    const rate = this.refViewModel.getExchangeRateValue('USD');
    if (srp > 0 && rate !== undefined) {
      return Math.ceil(srp / rate);
    } else {
      return 0;
    }
  }

  onFormChange(): void {
    const name = this.productDetailForm.controls.modelName.value;
    const version = this.refViewModel.getVersion([
      this.productDetailForm.controls.versionId.value,
    ]).variantValue;
    const size = this.productDetailForm.controls.sizeName.value;
    const color = this.productDetailForm.controls.colorName.value;
    const brand = this.productDetailForm.controls.brandName.value;
    const type = this.productDetailForm.controls.productType.value;
    const keywords = this.productDetailForm.controls.keywords.value;
    this.productDetailForm.controls.productDesc.setValue(
      (name.toLowerCase() !== 'none' ? name : '') +
        (type !== '' ? ' ' + type : '') +
        (keywords !== '' ? ' ' + keywords : '') +
        (version !== '' && version !== 'none' ? ' ' + version : '') +
        (size !== '' && size !== 'none' ? ' ' + size : '') +
        (brand !== '' && brand !== 'No Brand' ? ' ' + brand : '') +
        (color !== '' && color !== 'none' ? ' ' + color : '')
    );
  }

  selectVendor(vendor: IVendor): void {
    this.productDetailForm.controls.vendorId.setValue(
      vendor.purchasingVendorId
    );
    this.productDetailForm.controls.vendorName.setValue(vendor.vendorName);
    this.onFormChange();
    this.showVendorModal = false;
  }

  selectModel(model: IRefModels): void {
    this.productDetailForm.controls.modelId.setValue(model.refModelId);
    this.productDetailForm.controls.modelName.setValue(model.name);
    this.onFormChange();
    this.showModelModal = false;
  }

  selectBrand(brand: IRefBrands): void {
    this.productDetailForm.controls.brandId.setValue(brand.refBrandId);
    this.productDetailForm.controls.brandName.setValue(brand.name);
    this.onFormChange();
    this.showBrandModal = false;
  }

  selectColor(color: IVariant): void {
    this.productDetailForm.controls.colorId.setValue(color.variantId);
    this.productDetailForm.controls.colorName.setValue(color.variantValue);
    this.onFormChange();
    this.showColorModal = false;
  }

  selectSize(size: IVariant): void {
    this.productDetailForm.controls.sizeId.setValue(size.variantId);
    this.productDetailForm.controls.sizeName.setValue(size.variantValue);
    this.onFormChange();
    this.showSizeModal = false;
  }

  selectCategory(categories: IRefCategory[]): void {
    const controls = this.controls();
    controls.cat1Id.setValue(
      categories[0] !== undefined ? categories[0].refCategoryId : 0
    );
    controls.cat1Name.setValue(
      categories[0] !== undefined ? categories[0].name : 'none'
    );
    controls.cat2Id.setValue(
      categories[1] !== undefined ? categories[1].refCategoryId : 0
    );
    controls.cat2Name.setValue(
      categories[1] !== undefined ? categories[1].name : 'none'
    );
    controls.cat3Id.setValue(
      categories[2] !== undefined ? categories[2].refCategoryId : 0
    );
    controls.cat3Name.setValue(
      categories[2] !== undefined ? categories[2].name : 'none'
    );
    this.showCategoryModal = false;
  }

  updateFunc(): void {
    const c = this.productDetailForm.controls;
    const model: MUpdateProduct = {
      // Detail
      productId: c.productId.value,
      sku: c.sku.value,
      brandId: c.brandId.value,
      brandName: c.brandName.value,
      modelId: c.modelId.value,
      modelName: c.modelName.value,
      productNo: c.productNo.value,
      productDesc: c.productDesc.value,
      productType: c.productType.value,
      keywords: c.keywords.value,
      unitCost: this.getUnitCost(),

      // Variant
      variantIds: [
        c.versionId.value,
        c.sizeId.value,
        c.colorId.value,
        c.warrantyPeriod.value,
      ].filter((id) => id > 0),
      categoryIds: [c.cat1Id.value, c.cat2Id.value, c.cat3Id.value].filter(
        (id) => id > 0
      ),
      orderIndex: c.orderIndex.value,
      publishStatus: c.publishStatus.value,

      // Flag
      flagIds: [
        c.promotionFlagId.value,
        c.shipFlagId.value,
        c.lifecycleFlagId.value,
      ].filter((id) => id > 0),

      // Unknown 1
      link: c.link.value,
      remark: c.remark.value,

      // Vendor
      vendorId: c.vendorId.value,
      vendorProductName: c.vendorProductName.value,

      //  Pricing
      srp: c.srp.value,
      rrp: c.rrp.value,
      msrpUSD: c.msrpUsd.value,
      competitorTHB: c.competitorThb.value,
      shippingCost: c.shippingCost.value,

      // Unknown 2
      barcode: c.barcode.value,

      // Stock details & distribution
      reorderQty: c.reorderQty.value,
      warehouseLoc: c.warehouseLocation.value,
      uom: c.uom.value,
      unitsWeight: c.unitsWeight.value,
      volume: c.volumn.value,
      boxSize: c.boxSize.value,
      sellingShipping: c.sellingShipping.value,

      stockQty: c.stockQty.value,
    };

    const updateSub = this.detailViewModel
      .updateProductDetail(model)
      .subscribe((res) => {
        if (!(res instanceof HttpErrorResponse)) {
          if (res > 0) {
            const size: IVariant = this.refViewModel.getSize(model.variantIds);
            const color: IVariant = this.refViewModel.getColor(
              model.variantIds
            );
            const version: IVariant = this.refViewModel.getVersion(
              model.variantIds
            );

            const warranty: IVariant = this.refViewModel.getWarranty(
              model.variantIds
            );
            const shipFlag: IRefFlags = this.refViewModel.getShippingFlag(
              model.flagIds
            );

            const promotionFlag: IRefFlags = this.refViewModel.getPromotionFlag(
              model.flagIds
            );
            const lifecycleFlag: IRefFlags = this.refViewModel.getLifecycleFlag(
              model.flagIds
            );

            const category1: IRefCategory = this.refViewModel.getCategoryByIndex(
              model.categoryIds,
              1
            );
            const category2: IRefCategory = this.refViewModel.getCategoryByIndex(
              model.categoryIds,
              2
            );
            const category3: IRefCategory = this.refViewModel.getCategoryByIndex(
              model.categoryIds,
              3
            );
            const newUpdate: IProduct = {
              ...model,
              productImage: this.imgUrl,
              brandName: this.refViewModel.getBrandNameById(model.brandId),
              modelName: this.refViewModel.getModelById(model.modelId),
              vendorName: this.vmVendor.getNameById(model.vendorId),
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
            this.productViewModel.updateProductList(
              this.updateProductName(newUpdate)
            );
            alert('Update Successfully!!');
            this.closeFunc();
          } else {
            alert('Update Error. Check your changes and try again.');
          }
        } else {
          const errorRes = res as HttpErrorResponse;
          alert(errorRes.error.text);
        }
      });
    this.subscription.add(updateSub);
  }

  updateProductName(product: IProduct): IProduct {
    product.shippingFlagName = this.refViewModel.getShippingFlag([
      product.shippingFlagId,
    ]).name;
    product.versionName = this.refViewModel.getVersion([
      product.versionId,
    ]).variantValue;
    product.promotionFlagName = this.refViewModel.getPromotionFlag([
      product.promotionFlagId,
    ]).name;
    product.lifecycleFlagName = this.refViewModel.getLifecycleFlag([
      product.lifecycleFlagId,
    ]).name;
    return product;
  }

  randomBarcode(): void {
    this.spinBarcode = true;
    const ranValue = Math.floor(Math.random() * 999999999999);

    let str = `${ranValue}`;
    while (str.length < 12) {
      str = `0${str}`;
    }

    this.newBarcodeSub.next(str);
  }

  initBarcodeSub(): void {
    const barcodeSub = this.newBarcodeSub
      .pipe(
        switchMap((res) => {
          this.newBarcode = res;
          return this.detailViewModel.checkBarcode(res);
        }),
        debounceTime(500)
      )
      .subscribe((res) => {
        if (typeof res === 'number') {
          if (res === 1) {
            this.randomBarcode();
          } else {
            const control = this.controls();
            control.barcode.setValue(this.newBarcode);
            this.spinBarcode = false;
          }
        } else {
          alert('API Has Error!! Please try again next time');
        }
      });
    this.subscription.add(barcodeSub);
  }
}
