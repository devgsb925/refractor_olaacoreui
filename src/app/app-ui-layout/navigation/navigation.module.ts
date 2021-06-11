import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavComponent } from './top-nav.component';
import { SideNavComponent } from './side-nav.component';
import { RouterModule } from '@angular/router';
import { OrderPipesModule } from './pipes/order-pipes.module';

@NgModule({
  declarations: [TopNavComponent, SideNavComponent],
  imports: [CommonModule, RouterModule, OrderPipesModule],
  exports: [TopNavComponent, SideNavComponent],
})
export class NavigationModule {}
