export interface IShipment {
  shipmentId: number;
  trackingNo: string;
  forwarderNo: string;
  noOfBoxes: number;
  weight: string;
  volume: string;
  refCourier: string;
  refForwarder: string;
  shipmentDate: Date;
  receptionDate: Date;
}
