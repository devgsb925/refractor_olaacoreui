import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../view-model/permission.service';

@Component({
  selector: 'app-add-user-permisssion',
  templateUrl: './add-user-permisssion.component.html',
  styleUrls: ['./add-user-permisssion.component.scss']
})
export class AddUserPermisssionComponent implements OnInit {

  constructor(
    public vmPermission : PermissionService,
  ) { }

  ngOnInit(): void {
  }

  changePageFunc(id: number):void{
    this.vmPermission.activePage = id;
  }

}
