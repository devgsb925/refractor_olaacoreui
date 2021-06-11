import { MPostAddShipmentProducts } from '../model/m-post-add-shipment-products';

export interface MPostAddShipment {
    shipmentId: number;
    shipmentDate: Date;
    refCourierId: number;  
    trackingNo: string;
    refForwarderId: number;
    forwarderNo: string;
    noOfBoxes: number;
    weight: string;
    volume: string;  
    purchasingVendorId: number;

    shipmentProducts: MPostAddShipmentProducts[];    
}