import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';
import { SortingModule } from 'src/app/shared/pipe/sorting.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ReportsComponent, ],
  imports: [CommonModule, ReportsRoutingModule, PaginationModule,SortingModule,FormsModule,ReactiveFormsModule],

})
export class ReportsModule {}
