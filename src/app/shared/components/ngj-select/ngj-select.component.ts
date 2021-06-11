import { Component, EventEmitter, Output, OnChanges, SimpleChanges, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INgjSelectModel } from './model/i-ngj-select-model';

@Component({
  selector: 'app-ngj-select',
  templateUrl: './ngj-select.component.html',
  styleUrls: ['./ngj-select.component.scss']
})
export class NgjSelectComponent implements OnChanges {

  search = '';

  @Output() selectedItemOutput = new EventEmitter<any>();
  @Output() searchOutput = new EventEmitter<string>();

  @Input() placeHolder = '';
  @Input() results: any[] = [];
  @Input() selectedItem: INgjSelectModel = {
    Id: 0,
    Name: ''
  };

  @Input() name = '';

  protected dsSelected_item = new BehaviorSubject(this.selectedItem);
  Selected_item$ = this.dsSelected_item.asObservable();

  protected dsResults = new BehaviorSubject(this.results);
  Results$ = this.dsResults.asObservable();

  showSearch = false;

  constructor(
  ) { }

  ngOnChanges(): void {
    this.dsResults.next(this.results);
    this.dsSelected_item.next(this.selectedItem);
  }

  onSearch(): void {
    if (this.search.length > 0) {
      this.searchOutput.next(this.search);
    }
  }

  onSelectResult(result: any): void {

    this.name = result.Name;
    this.selectedItem = result;
    this.dsSelected_item.next(this.selectedItem);

    this.selectedItemOutput.next(result);
    this.showSearch = false;

    // clear search
    this.results = [];
    this.dsResults.next(this.results);
  }

  onCancel(): void {
    this.selectedItem = { Id: 0, Name: 'none' };
    this.dsSelected_item.next(this.selectedItem);
    this.selectedItemOutput.next(this.selectedItem);
    this.name = '';
    this.searchOutput.next('');
    this.showSearch = false;
  }


}
