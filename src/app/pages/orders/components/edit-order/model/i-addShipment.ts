export interface IAddShipment {
    orderId: number;
    shipmentDate: Date;
    refCourierId: number;
    trackingNo: string;
    noOfBoxes: number;
    refForwarderId: number;
    forwarderNo: string;
    weight: number;
    volume: number;

}