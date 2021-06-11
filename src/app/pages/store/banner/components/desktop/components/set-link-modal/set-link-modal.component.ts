import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-set-link-modal',
  templateUrl: './set-link-modal.component.html',
  styleUrls: ['./set-link-modal.component.scss']
})
export class SetLinkModalComponent implements OnInit {

  constructor() { }

  @Input() link = '';

  @Output() saveEvent = new EventEmitter<string>();
  @Output() closeEvent = new EventEmitter<boolean>();
  ngOnInit(): void {
  }

  saveFunc(): void{
    this.saveEvent.emit(this.link);
  }

  closeFunc(): void{
    this.closeEvent.emit(false);
  }
}
