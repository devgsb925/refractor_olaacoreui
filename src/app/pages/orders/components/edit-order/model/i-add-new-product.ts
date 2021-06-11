export interface IAddNewProduct {
    storeProductId: number;
    brandName: string;
    productName: string;
    modelName: string;
    modelNumber: string;
    size: string;
    color: string;
    unitPrice: number;
    orderQty: number;
    totalAmount: number;
    received: number;
    remaining: number;
    recover: number;
    remarks: string;
}