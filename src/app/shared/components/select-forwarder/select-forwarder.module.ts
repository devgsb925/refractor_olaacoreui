import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectForwarderComponent } from './select-forwarder.component';



@NgModule({
  declarations: [SelectForwarderComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [SelectForwarderComponent]
})
export class SelectForwarderModule { }
