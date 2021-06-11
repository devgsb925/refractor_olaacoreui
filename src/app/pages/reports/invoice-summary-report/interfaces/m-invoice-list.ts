export interface MInvoiceList {
  fromDt: Date;
  toDt: Date;
  operatorIds: number[];
  sellTypeId: number;
  sellMethodId: number;
}
