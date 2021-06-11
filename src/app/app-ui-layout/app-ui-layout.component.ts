import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationViewModel } from './navigation/view-model/navigation-view-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-app-ui-layout',
  templateUrl: './app-ui-layout.component.html',
  styleUrls: ['./app-ui-layout.component.scss'],
})
export class AppUiLayoutComponent implements OnInit {

  dataSub: Subscription;

  constructor(
    public vmNavigation: NavigationViewModel,
    private route: ActivatedRoute
  ) { }

  inprocess = true;

  ngOnInit(): void {

  }

}
