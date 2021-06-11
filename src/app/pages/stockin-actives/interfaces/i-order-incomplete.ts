export interface IOrderIncomplete {
    purchasingOrderId: number;
    pOOrderStatus: number;
    shipmentCount: number;
    receptionStatus: number;
    forwarderNo: string;
    trackingNo: string;
}