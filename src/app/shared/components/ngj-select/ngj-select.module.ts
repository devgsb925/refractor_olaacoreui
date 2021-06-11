import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgjSelectComponent } from './ngj-select.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [NgjSelectComponent],
  imports: [CommonModule, FormsModule],
  exports: [NgjSelectComponent],
})
export class NgjSelectModule {}
