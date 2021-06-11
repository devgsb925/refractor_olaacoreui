export interface IMUpdateShipmentInfo {
    shipmentId: number;
    shipmentDate: Date,
    purchasingRefCourierId: number;
    purchasingRefForwarderId: number;
    trackingNo: string;
    fWDNo: string;
    noOfBoxes: number;
    weight: number;
    volume: number;
}