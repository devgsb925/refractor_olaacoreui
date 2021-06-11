import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'sorting',
})
export class SortingPipe implements PipeTransform {
  transform(array: any, field: string): any[] {
    if (!Array.isArray(array)) {
      return;
    }
    array.sort((a: any, b: any) => {
      if (a[field] > b[field]) {
        return -1;
      } else {
        return 1;
      }
    });
    return array;
  }
}