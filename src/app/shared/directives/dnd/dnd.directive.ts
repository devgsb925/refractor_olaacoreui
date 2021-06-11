import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {

  constructor() { }

  @Output() fileDropped = new EventEmitter<any>();


  @HostListener('dragover', ['$event']) onDragOver(evt: any): void{
    evt.preventDefault();
    evt.stopPropagation();
  }


  @HostListener('dragleave', ['$event']) onDragLeave(evt: any): void{
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('drop', ['$event']) onDrop(evt: any): void{
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    if (files.length > 0){
      this.fileDropped.emit(files);
    }
  }

}
