import { AppUiLayoutComponent } from './app-ui-layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppUiLayoutRoutingModule } from './app-ui-layout-routing.module';
import { NavigationModule } from './navigation/navigation.module';
import { PaginationModule } from '../shared/components/pagination/pagination.module';

@NgModule({
  declarations: [AppUiLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(AppUiLayoutRoutingModule),
    NavigationModule,

    // PaginationModule
  ],
  exports: [],
  providers: []
})
export class AppUiLayoutModule { }
