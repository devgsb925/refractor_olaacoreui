import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "orderBySort"
})
export class OrderPipes  implements PipeTransform {
  transform(array: any, field: string, order: number): any[] {
    
    if (!Array.isArray(array)) {
      return;
    }
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    if(order > 0){
      return array.reverse();
    }
    return array;
  }
}