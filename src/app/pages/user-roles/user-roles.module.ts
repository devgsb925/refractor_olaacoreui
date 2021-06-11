import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRolesComponent } from './user-roles.component';
import { UserRolesApiService } from './api/user-roles-api.service';
import { UserRolesViewModel } from './view-model/user-roles-view-model';
import { UserRolesRoutingModule } from './user-roles-routing.module';
import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';
import { AddUserRoleModalComponent } from './components/add-user-role-modal/add-user-role-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditUserRoleComponent } from './components/edit-user-role/edit-user-role.component';
import { HttpClientModule } from '@angular/common/http';
import { SortingModule } from 'src/app/shared/pipe/sorting.module';




@NgModule({
  declarations: [UserRolesComponent, AddUserRoleModalComponent, EditUserRoleComponent],
  imports: [
    CommonModule,
    UserRolesRoutingModule,
    PaginationModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SortingModule
  ],
  providers: [
    UserRolesApiService,
    UserRolesViewModel,
  ]
})
export class UserRolesModule { }
