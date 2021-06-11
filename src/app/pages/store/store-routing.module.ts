import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { Routes, Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BannerComponent } from './banner/banner.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
  },
  {
    path: 'products',
    data: {
      role: 'products',
    },
    component: ProductsComponent,
    loadChildren: () =>
      import('./products/products.module').then((m) => m.ProductsModule),
  },
  {
    path: 'categories',
    data: {
      role: 'store-categories',
    },
    component: CategoriesComponent,
    loadChildren: () =>
      import('./categories/categories.module').then((m) => m.CategoriesModule),
  },
  {
    path: 'banners',
    data: {
      role: 'store-banners',
    },
    component: BannerComponent,
    loadChildren: () =>
      import('./banner/banner.module').then((m) => m.BannerModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreRoutingModule {}
