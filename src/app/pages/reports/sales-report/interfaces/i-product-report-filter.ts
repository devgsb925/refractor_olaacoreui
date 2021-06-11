export interface IProductReportFilter {
  transationType:string;
  prodDate:string;
  categories:string;
  brand:string;

  fromDt: string;
  toDt: string;
  kw: string;

  show:boolean;
}
