import { NgModule } from '@angular/core';
import { PermissionComponent } from './permission.component';
import { Routes, RouterModule } from '@angular/router';

const routes : Routes = [{
  path : '',
  component: PermissionComponent
}]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PermissionRoutingModule { }
