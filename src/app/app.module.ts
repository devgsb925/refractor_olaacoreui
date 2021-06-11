import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './security/token-interceptor.service';

import { ToastService } from './toast/toast-service';
import { ToastModule } from './toast/toast.module';
import { RouterModule } from '@angular/router';

import { NavigationModule } from './app-ui-layout/navigation/navigation.module';
import { ProductsReferencesService } from './api/products/references/products-references.service';
import { NgxPrinterService } from 'ngx-printer';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgJselect2Module } from './shared/components/ng-jselect/ng-jselect2.module';
import { PaginationModule } from './shared/components/pagination/pagination.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastModule,
    HttpClientModule,
    RouterModule,
    NavigationModule,
    NgxBarcodeModule,
    NgJselect2Module,
    // PaginationModule
  ],
  providers: [
    ToastService,
    ProductsReferencesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    NgxPrinterService,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
