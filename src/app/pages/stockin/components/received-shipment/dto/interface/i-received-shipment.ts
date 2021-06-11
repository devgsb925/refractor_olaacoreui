import { IProductReceivedShipment } from './i-product-received-shipment';
export interface IReceivedShipment {
  shipmentId: number;
  recievedDate: Date;
  status: number;
  forwarderNo: string;
  trackingNo: string;
  boxCount: number;
  weight: number;
  volume: number;
  shipmentDtate: Date;
  hasUpdate: boolean;
  shipmentProducts: IProductReceivedShipment[];
}
