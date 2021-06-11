export interface MAddToStock {
  addToStockList: {
    orderDetailsId: number;
    purchasingShipmentDetailId: number;
    recievedQty: number;
  }[];
}
