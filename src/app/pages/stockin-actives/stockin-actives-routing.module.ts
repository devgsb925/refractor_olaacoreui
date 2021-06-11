import { NgModule } from '@angular/core';
import { StockinActivesComponent } from './stockin-actives.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  component: StockinActivesComponent
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockinActivesRoutingModule { }
