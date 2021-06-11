import { SortingModule } from './../../../shared/pipe/sorting.module';
import { ProgressModule } from './../../../shared/components/progress/progress.module';
import { FormsModule } from '@angular/forms';
import { DndModule } from './../../../shared/directives/dnd/dnd.module';
import { BannerRoutingModule } from './banner-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner.component';
import { DesktopComponent } from './components/desktop/desktop.component';
import { MobileComponent } from './components/mobile/mobile.component';
import { SetLinkModalComponent } from './components/desktop/components/set-link-modal/set-link-modal.component';

@NgModule({
  declarations: [
    BannerComponent,
    DesktopComponent,
    MobileComponent,
    SetLinkModalComponent,
  ],
  imports: [
    CommonModule,
    BannerRoutingModule,
    DndModule,
    FormsModule,
    ProgressModule,
    SortingModule
  ],
})
export class BannerModule {}
