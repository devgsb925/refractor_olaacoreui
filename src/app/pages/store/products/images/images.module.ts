import { ImagesViewModelService } from './images-view-model.service';
import { ImagesApiService } from './images-api.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagesRoutingModule } from './images-routing.module';
import { ImagesComponent } from './images.component';


@NgModule({
  declarations: [ImagesComponent],
  imports: [
    CommonModule,
    ImagesRoutingModule
  ],
  providers: [
    ImagesViewModelService,
    ImagesApiService
  ]
})
export class ImagesModule { }
