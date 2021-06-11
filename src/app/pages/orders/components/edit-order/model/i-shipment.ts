export class Shipment {

    constructor(
        public PurchasingOrderShipmentId: number,

        public ReceptionDate: Date,
        public PurchasingRefCourierId: number,
        public PurchasingRefForwarderId: number,
        public PurchasingOrderId: number,
        public ShipmentCount: number,
        public TrackingNo: string,
        public FWDNo: string,
        public NoOfBoxes: number,
        public ShipmentCost: number,
        public ShipmentStatus: number,

    ) { }
}