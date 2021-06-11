import { IVendor } from './i-vendor';

export interface IShipment {
  forwarderNo: string;
  noOfBoxes: number;
  receptionDate: Date;
  refCourierId: number;
  refForwarderId: number;
  shipmentDate: Date;
  shipmentId: number;
  trackingNo: string;
  volume: number;
  weight: number;
  shipmentStatus: number;
  hasUpdate: boolean;
  searchForwarder: string;
  searchCourier: string;
  isEdit: boolean;
  vendorList: IVendor[];
}
