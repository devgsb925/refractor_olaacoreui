

export interface IUpdateJShipment {
  shipmentId: number;
  shipmentDate: Date;
  shipmdentDateStr: string;
  refCourierId: number;
  trackingNo: string;
  refForwarderId: number;
  forwarderNo: string;
  noOfBoxes: number;
  weight: number;
  volume: number;
  purchasingVendorId: number;
  hasUpdate: boolean;
  shipmentProducts: any[];
}
