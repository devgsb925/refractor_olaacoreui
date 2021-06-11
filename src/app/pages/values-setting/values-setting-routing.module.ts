import { ValuesSettingComponent } from './values-setting.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ValuesSettingComponent,
    data: {
      role: 'purchasing'
    },

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValuesSettingRoutingModule { }
