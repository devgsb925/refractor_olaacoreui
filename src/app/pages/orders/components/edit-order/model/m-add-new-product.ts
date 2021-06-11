export interface MAddNewProduct {
    storeProductId: number;
    refBrandId: number;
    refModelId: number;
    modelNumber: string;
    size: string;
    color: string;
    unitPrice: number
    orderQty: number;
    productName: string;
    orderId: number;
}