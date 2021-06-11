import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterSettingModalComponent} from './filter-setting-modal.component';


@NgModule({
  declarations: [FilterSettingModalComponent],
  imports: [
    CommonModule
  ],
  exports : [FilterSettingModalComponent]
})
export class FilterSettingModalModule { }
