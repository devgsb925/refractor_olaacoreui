import { FormsModule } from '@angular/forms';
import { CategoriesViewModelService } from './categories-view-model.service';
import { CategoriesApiService } from './categories-api.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [CategoriesComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    DragDropModule,
    FormsModule
  ]
})
export class CategoriesModule { }
