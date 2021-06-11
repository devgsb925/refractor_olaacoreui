import { Component, OnInit } from '@angular/core';
import { timeStamp } from 'console';
import { Subscription } from 'rxjs';
import { IRefModels } from 'src/app/api/products/references/interfaces/i-ref-model';
import { ProductsReferencesService } from 'src/app/api/products/references/products-references.service';
import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';

@Component({
  selector: 'app-product-names',
  templateUrl: './product-names.component.html',
  styleUrls: ['./product-names.component.scss'],
})
export class ProductNamesComponent implements OnInit {
  constructor(private vmRef: ProductReferencesViewModel, private api: ProductsReferencesService) {}

  productNameId = 0;
  productNameValue = '';
  searchValue = '';

  productNameList: IRefModels[] = [];

  private inprocess = false;
  private subscription = new Subscription();

  ngOnInit(): void {
    this.vmRef.refModelsList.forEach((name) => {
      this.productNameList.push(name);
    });
  }

  selectFunc(item: IRefModels): void{
    this.productNameId = item.refModelId;
    this.productNameValue = item.name;
  }

  searchFunc(): void {
    this.productNameList = this.vmRef.refModelsList.filter(
      (prodName) =>
        prodName.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        prodName.refModelId.toString().slice(0, this.searchValue.length) ==
          this.searchValue
    );
  }


  addFunc(): void{
    if (!this.inprocess) {
      if (!this.checkExistFunc()) {
        this.inprocess = true;
        const addSub = this.vmRef.addModelToApi(this.productNameValue).subscribe({
          next: res => {
            if (res > 0 && typeof res == 'number') {
              const model = { refModelId: res, name: this.productNameValue }
              this.productNameList.push(model);
              this.vmRef.addNewModelToList(model);
            }
          },
          error: err => {
            alert(err.error);
            console.log(err);
          },
          complete: () => {
            this.inprocess = false;
            this.cancelFunc();
          }
        })
        this.subscription.add(addSub);
      } else {
        alert('This Product name is exist already!!');
      }
    }
  }

  updateFunc(): void{
    if (!this.inprocess) {
      if (!this.checkExistFunc()) {
        this.inprocess = true;
        const modelUpdate = { id: this.productNameId, name: this.productNameValue };
        const udpateSub = this.api.updateModelToServer(modelUpdate).subscribe({
          next: res => {
            if (res > 0) {
              const updateIndex = this.productNameList.findIndex(prodName => prodName.refModelId == this.productNameId);
              this.productNameList[updateIndex].name = this.productNameValue;


              const updateIndex2 = this.vmRef.refModelsList.findIndex(mod => mod.refModelId == this.productNameId);
              this.vmRef.refModelsList[updateIndex2].name = this.productNameValue;
            }
          },
          error: err => {
            alert(err.error);
            console.log(err);

          },
          complete: () => {
            this.inprocess = false;
            this.cancelFunc();
          }
        })
        this.subscription.add(udpateSub);
      } else {
        alert('This product name is exist already!!');
      }
    }
  }

  cancelFunc(): void{
    this.productNameId = 0;
    this.productNameValue = '';
  }

  checkExistFunc(): boolean{
    return this.vmRef.refModelsList.find(prodName => prodName.name.toLowerCase() == this.productNameValue.toLowerCase()) != undefined;
  }
}
