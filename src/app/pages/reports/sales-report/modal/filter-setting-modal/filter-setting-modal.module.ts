import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterSettingModalComponent} from './filter-setting-modal.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [FilterSettingModalComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports : [FilterSettingModalComponent]
})
export class FilterSettingModalModule { }
