export class IUpdateOrder {
    public orderId: number;
    public pOInvoiceNo: string;
    public purchasingExchangeRateId: number;
    public totalAmount: number;
    public totalPaidAmount: number;
    public totalBalancesAmount: number;

}


export class IReadUpdateOrder {

    constructor(

        public OrderId: number,//noupdate
        public VendorId: number,//noupdate
        public VendorName: string,//noupdate
        public InvoiceNo: string, //update
        public PurchasingExchangeRateId: number,//update
        public RateToKip: number,//update
        public RateToKipString: string,//update
        public ShippingCount: number,//update
        public TotalAmount: number,//update
        public TotalPaidAmount: number,//update should  be on selected currency
        public TotalBalance: number,//update

    ) { }
}


