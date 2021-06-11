import { IShipmentProduct } from './i-shipment-product';
export interface IShipmentDetail {
  shipmentId: number;
  forwarderNo: string;
  trackingNo: string;
  boxCount: number;
  weight: number;
  volume: number;
  shipmentDtate: Date;
  recievedDate: Date;
  hasUpdate: boolean;
  shipmentProducts: IShipmentProduct[];
}
