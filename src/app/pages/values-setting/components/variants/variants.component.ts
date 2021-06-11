import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IVariant } from 'src/app/api/products/references/interfaces/i-variant';
import { ProductsReferencesService } from 'src/app/api/products/references/products-references.service';
import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';

@Component({
  selector: 'app-variants',
  templateUrl: './variants.component.html',
  styleUrls: ['./variants.component.scss'],
})
export class VariantsComponent implements OnInit {
  constructor(
    private vmRef: ProductReferencesViewModel,
    private api: ProductsReferencesService
  ) {}

  variantId = 0;
  variantValue = '';
  @Input() refVariantId = 0;
  @Input() refVariantName = '';

  searchValue = '';

  variantList: IVariant[] = [];

  private inprocess = false;
  private subscription = new Subscription();

  ngOnInit(): void {
    this.variantList = this.vmRef
      .getVariants()
      .filter((variant) => variant.refVariantName == this.refVariantName);
  }

  selectFunc(item: IVariant): void{
    this.variantId = item.variantId;
    this.variantValue = item.variantValue;
  }

  searchFunc(): void {
    this.variantList = this.vmRef
      .getVariants()
      .filter(
        (variant) =>
          variant.refVariantName == this.refVariantName &&
          (variant.variantId.toString().slice(0, this.searchValue.length) ==
            this.searchValue ||
            variant.variantValue
              .toLowerCase()
              .includes(this.searchValue.toLowerCase()))
      );
  }

  cancelFunc(): void {
    this.variantId = 0;
    this.variantValue = '';
  }

  addFunc(): void {
    if (!this.inprocess) {
      if (!this.checkExistFunc()) {
        this.inprocess = true;
        const addSub = this.vmRef
          .addVariantToApi(this.variantValue, this.refVariantName)
          .subscribe({
            next: (res) => {
              if (res > 0 && typeof res == 'number') {
                this.vmRef.addNewVariantToList({
                  variantId: res,
                  variantValue: this.variantValue,
                  refVariantName: this.refVariantName,
                });
                this.searchFunc();
              }
            },
            error: (err) => {
              alert(err.error);
              console.log(err);
            },
            complete: () => {
              this.inprocess = false;
              this.cancelFunc();
            },
          });

        this.subscription.add(addSub);
      } else {
        alert('This Variant is exist already!!');
      }
    }
  }

  updateFunc(): void {
    if (!this.inprocess) {
      if (!this.checkExistFunc()) {
        this.inprocess = true;
        const updateSub = this.api
          .updateVariantToServer({
            id: this.variantId,
            name: this.variantValue,
          })
          .subscribe({
            next: (res) => {
              if (res > 0) {
                const updateIndex = this.variantList.findIndex(
                  (variant) => variant.variantId == this.variantId
                );
                this.variantList[updateIndex].variantValue = this.variantValue;

              }
            },
            error: (err) => {
              alert(err.error);
              console.log(err);
            },
            complete: () => {
              this.inprocess = false;
              this.cancelFunc();
            },
          });
        this.subscription.add(updateSub);
      } else {
        alert('This Variant is exist already!!');
      }
    }
  }

  checkExistFunc(): boolean {
    return (
      this.vmRef
        .getVariants()
        .find(
          (variant) =>
            variant.variantValue.toLowerCase() ==
            this.variantValue.toLowerCase()
        ) != undefined
    );
  }
}
