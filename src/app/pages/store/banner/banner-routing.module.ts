import { MobileComponent } from './components/mobile/mobile.component';
import { DesktopComponent } from './components/desktop/desktop.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      role: 'store-banners',
    },
    redirectTo: 'desktop',

  },
  {
    path: 'desktop',
    data: {
      role: 'store-banners',
    },
    component: DesktopComponent
  },
  {
    path: 'mobile',
    data: {
      role: 'store-banners',
    },
    component: MobileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerRoutingModule { }
