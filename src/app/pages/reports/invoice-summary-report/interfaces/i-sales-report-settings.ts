
export interface ISalesReportSettings {
  fromDt: Date;
  fromDtStr: string;
  toDt: Date;
  toDtStr: string;
  sellTypeId: number;
  sellMethodId: number;
  operatorIds: number[];
}
