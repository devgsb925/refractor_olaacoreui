export interface IPendingShipmentTable {
  shipmentId: number;
  forwarderNo: string;
  trackingNo: string;
  boxCount: number;
  weight: number;
  volume: number;
  shipmentDate: string;
  recievedDate: string;
  hasUpdate: boolean;
  shipmentStatus: number;
}
