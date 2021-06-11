
export interface IAddShipment {
  shipmentId: number;
  shipmentDate: Date;
  refCourierId: number;
  trackingNo: string;
  refForwarderId: number;
  forwarderNo: string;
  noOfBoxes: number;
  weight: number;
  volume: number;
  purchasingVendorId: number;
  shipmentProducts: any[];
}
