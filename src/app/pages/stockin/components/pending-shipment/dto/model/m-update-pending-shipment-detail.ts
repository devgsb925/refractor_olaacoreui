import { MProductList } from './m-product-list';

export interface MUpdatePendingShipmentDetail {
  shipmentId: number;
  receivedDate?: Date;
  _pendingShipments: MProductList[];
}
