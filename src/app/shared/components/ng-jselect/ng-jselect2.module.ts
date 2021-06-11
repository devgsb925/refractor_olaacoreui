import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgJSelect2Component } from './ng-jselect2.component';
import { NgJselectModalComponent } from './modal/ng-jselect-modal.component';

@NgModule({
  declarations: [NgJSelect2Component, NgJselectModalComponent],
  imports: [CommonModule, FormsModule],
  exports: [NgJSelect2Component],
})
export class NgJselect2Module {}
