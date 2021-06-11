import { IRefModels } from './../../../orders/components/edit-order/model/i-ref-models';
import { DetailViewModelService } from './../detail/detail-view-model.service';
import { Shipment } from './../../../orders/components/edit-order/model/i-shipment';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductsViewModelService } from './../products-view-model.service';
import { AddProductViewModelService } from './add-product-view-model.service';
import { ProductReferencesViewModel } from './../../../../view-model/product-references-view-model';
import {
  Component,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { IVendor } from '../../../../shared/components/vendors/i-vendor';
import { IRefBrands } from 'src/app/api/products/references/interfaces/i-ref-brands';
import { IVariant } from 'src/app/api/products/references/interfaces/i-variant';
import { IRefCategory } from 'src/app/api/products/references/interfaces/i-ref-category';
import { MAddProduct } from './interfaces/m-add-product';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

export const EXTERNAL_MINIMUME_TOTAL_PRICE = 200000;

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    public productsViewModel: ProductsViewModelService,
    public addProductViewModel: AddProductViewModelService,
    public refViewModel: ProductReferencesViewModel
  ) {}

  @Output() closeEvent = new EventEmitter<boolean>();
  @Output() addSuccessfully = new EventEmitter<MAddProduct>();

  //#region variable for modal
  showVendorModal = false;
  showModelModal = false;
  showBrandModal = false;
  showColorModal = false;
  showSizeModal = false;
  showCategoryModal = false;

  searchVendorValue = '';
  searchBrandValue = '';
  searchColorValue = '';
  searchSizeValue = '';
  //#endregion

  spinBarcode = false;
  newBarcode = '';

  private newBarcodeSub = new Subject<string>();

  private subscription = new Subscription();

  productDetailForm = this.fb.group({
    // Detail
    productId: [0, Validators.required],
    sku: [''],
    modelId: [''],
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
    publishStatus: [2],

    // flags
    promotionFlagId: [0],
    shipFlagId: [0],
    lifecycleFlagId: [9],

    // Unknown 1
    link: [''],
    remark: [''],
    warrantyPeriod: [0],
    dateUpdated: [''],

    // Vendor
    vendorId: [0, Validators.required],
    vendorName: ['', Validators.required],
    vendorProductName: [''],

    // Pricing
    srp: [0, [Validators.required, Validators.min(0)]],
    rrp: [0, [Validators.required, Validators.min(0)]],
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
    const warranties = this.refViewModel
      .getVariants()
      .filter((variant) => variant.refVariantName === 'Warranty');
    let warrantyId = warranties.find(
      (war) => war.variantValue === 'No Warranty'
    ).variantId;
    if (warrantyId === undefined) {
      warrantyId = Math.min(...warranties.map((war) => war.variantId));
    }
    this.productDetailForm.controls.warrantyPeriod.setValue(warrantyId);
    this.initBarcodeSub();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onFormChange(): void {
    const name: string = this.productDetailForm.controls.modelName.value;
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

  closeFunc(): void {
    this.closeEvent.next(true);
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

  selectModel(model: IRefModels): void {
    this.productDetailForm.controls.modelId.setValue(model.refModelId);
    this.productDetailForm.controls.modelName.setValue(model.name);
    this.onFormChange();
    this.showModelModal = false;
  }

  selectVendor(vendor: IVendor): void {
    this.productDetailForm.controls.vendorId.setValue(
      vendor.purchasingVendorId
    );
    this.productDetailForm.controls.vendorName.setValue(vendor.vendorName);
    this.onFormChange();
    this.showVendorModal = false;
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

  addProductFunc(): void {
    const c = this.productDetailForm.controls;

    const model: MAddProduct = {
      productId: 0,
      // Detail
      sku: c.sku.value,
      brandId: c.brandId.value,
      modelId: c.modelId.value,
      productNo: c.productNo.value,
      productDesc: c.productDesc.value,
      productType: c.productType.value,
      keywords: c.keywords.value,

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
      stockQty: 0,
    };

    const addProductSub = this.addProductViewModel
      .addProductToServer(model)
      .subscribe((res) => {
        if (typeof res === 'number') {
          if (res > 0) {
            alert('Add Product Successful!');
            model.productId = res;
            this.addSuccessfully.next(model);
            this.closeEvent.next(true);
          } else {
            alert('Has Error in add process');
          }
        } else {
          const error: HttpErrorResponse = res;
          alert(error.error.text);
        }
      });
    this.subscription.add(addProductSub);
  }

  controls(): { [key: string]: AbstractControl } {
    return this.productDetailForm.controls;
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
          return this.addProductViewModel.checkBarcode(res);
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
