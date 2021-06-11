import { ReferenceResolverService } from './api/products/references/reference-resolver.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CommonModule } from '@angular/common';
import { AppUiLayoutComponent } from './app-ui-layout/app-ui-layout.component';


const routes: Routes = [
  {
    path: '',
    component: AppUiLayoutComponent,
    // resolve: { references: ReferenceResolverService },
    children: [
      {
        path: '',

        loadChildren: () =>
          import('./app-ui-layout/app-ui-layout.module').then(
            (m) => m.AppUiLayoutModule
          ),
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '404',
    component: PageNotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
