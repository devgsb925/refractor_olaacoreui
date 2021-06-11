import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionComponent } from './permission.component';
import { PermissionRoutingModule } from './permission-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from '../../shared/components/pagination/pagination.module';
import { PermissionService } from './view-model/permission.service';
import { AddUserPermisssionComponent } from './componnents/add-user-permisssion/add-user-permisssion.component';
import { EditUserPermisssionComponent } from './componnents/edit-user-permisssion/edit-user-permisssion.component';
import { PermissionApiService } from './api/permission-api.service';

@NgModule({
  declarations: [PermissionComponent, AddUserPermisssionComponent,EditUserPermisssionComponent],
  imports: [
    CommonModule,
    PermissionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule
  ],
  providers: [PermissionService,PermissionApiService]
})
export class PermissionModule { }
