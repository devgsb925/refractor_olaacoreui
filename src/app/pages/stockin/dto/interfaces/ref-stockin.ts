import { IReceivedShipmentTable } from './i-received-shipment-table';
import { IPendingShipmentTable } from './i-pending-shipment-table';
export interface RefStockin {
  pendingShipments: IPendingShipmentTable[];
  recievedShipments: IReceivedShipmentTable[];
}
