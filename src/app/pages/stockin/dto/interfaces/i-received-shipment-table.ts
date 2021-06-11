export interface IReceivedShipmentTable {
  shipmentId: number;
  recievedDate: Date;
  shipmentStatus: number;
  forwarderNo: string;
  trackingNo: string;
  boxCount: number;
  weight: number;
  volume: number;
  shipmentDate: Date;
  hasUpdate: boolean;
}
