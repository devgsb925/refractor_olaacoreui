import { Router } from '@angular/router';
import { ProductReferencesViewModel } from './../../../../view-model/product-references-view-model';

import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  constructor(
    public refViewModel: ProductReferencesViewModel,
    private router: Router
  ) {}

  //#endregion
  tabPos = 0;
  ngOnInit(): void {


  }

  closeFunc(): void {
    this.router.navigate(['store/products']);
  }











}
