import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  @Input() ItemsCount = 0;
  @Input() PageSize = 0;
  @Input() PagePos = 0;
  @Output() PositionEventEmitter = new EventEmitter<number>();

  changePosition(pos: number): void {

    this.PagePos = pos;
    this.PositionEventEmitter.next(pos);
  }

  getPageList(): Observable<any[]> {

    return of(Array(Math.ceil(this.ItemsCount / this.PageSize)));

  }

  next(): void {

    this.PagePos += 1;
    this.PositionEventEmitter.next(this.PagePos);

  }

  prev(): void {

    this.PagePos -= 1;
    this.PositionEventEmitter.next(this.PagePos);

  }
}
