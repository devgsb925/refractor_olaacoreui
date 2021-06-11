import { MProductList } from './m-product-list';

export interface MUpdateReceivedShipment {
  shipmentId: number;
  _recievedShipments: MProductList[];
}
