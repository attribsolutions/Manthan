export function transformGRNtoInvoiceFormat(originalData) {

    const grn = originalData.Data[0]; // Assuming only one GRN object
    const order = grn.GRNReferences?.[0]?.Order || {};
    const billingAddress = order.BillingAddress || {};


    // Set Print Detail As per Reference 

    let Party = "";
    let PartyName = "";
    let PartyGSTIN = "";
    let Customer = "";
    let CustomerName = "";
    let CustomerGSTIN = "";
    let PartyAddress = "";
    let CustomerAddress = "";
    let PartyFSSAINo = "";
    let CustomerFSSAINo = "";
    let CustomerState = "";
    let PartyState = "";
    let PartyMobileNo = "";
    let CustomerMobileNo = "";


    if (grn.GRNReferences?.[0]?.Order) {   // GRN From vendor order If Not null

        Customer = order.Supplier?.id || null;
        CustomerName = order.Supplier?.Name || "";
        CustomerGSTIN = order.Supplier?.GSTIN || "";
        Party = order.Customer?.id || null;
        PartyName = order.Customer?.Name || "";
        PartyGSTIN = order.Customer?.GSTIN || "";
        PartyAddress = billingAddress.Address || "";
        CustomerAddress = billingAddress.Address || "";
        PartyFSSAINo = billingAddress.FSSAINo || "";
        CustomerFSSAINo = billingAddress.FSSAINo || "";
        CustomerState = billingAddress.CustomerState || "";
        PartyState = billingAddress.CustomerState || "";
        PartyMobileNo = billingAddress.PartyMobileNo || "";
        CustomerMobileNo = billingAddress.CustomerMobileNo || "";
    } else {

        Customer = grn.Customer || null;
        CustomerName = grn.CustomerName || "";
        CustomerGSTIN = grn.CustomerGSTIN || "";
        Party = grn.Party || null;
        PartyName = grn.PartyName || "";
        PartyGSTIN = grn.PartyGSTIN || "";
        PartyAddress = grn.PartyAddress || "";
        CustomerAddress = grn.CustomerAddress || "";
        PartyFSSAINo = grn.PartyFSSAINo || "";
        CustomerFSSAINo = grn.CustomerFSSAINo;
        CustomerState = grn.CustomerState || "";
        PartyState = grn.CustomerState || "";
        PartyMobileNo = grn.PartyMobileNo || "";
        CustomerMobileNo = grn.CustomerMobileNo || "";
    }



    const transformedData = {
        StatusCode: 200,
        Status: true,
        Data: {
            id: grn.id,
            InvoiceDate: grn.GRNDate,
            InvoiceNumber: grn.GRNNumber,
            FullInvoiceNumber: grn.FullGRNNumber,
            TCSAmount: "0.00",
            GrandTotal: grn.GrandTotal,
            RoundOffAmount: grn.RoundOffAmount,
            Customer: Customer,
            CustomerName: CustomerName,
            CustomerGSTIN: CustomerGSTIN,
            CustomerMobileNo: CustomerMobileNo,
            Party: Party,
            PartyName: PartyName,
            PartyGSTIN: PartyGSTIN,
            PartyMobileNo: PartyMobileNo,
            PartyFSSAINo: PartyFSSAINo,
            CustomerFSSAINo: CustomerFSSAINo,
            PartyState: PartyState,
            CustomerState: CustomerState,
            PartyAddress: PartyAddress,
            CustomerAddress: CustomerAddress,

            DriverName: null,
            VehicleNo: null,
            CreatedOn: grn.GRNDate,

            InvoiceItems: grn.GRNItems.map(item => ({
                Item: item.Item,
                ItemName: item.ItemName,
                Quantity: item.Quantity,
                TrayQuantity: item.BaseUnitQuantity,
                MRP: item.MRP,
                MRPValue: item.MRPValue,
                Rate: item.Rate,
                TaxType: item.TaxType,
                PrimaryUnitName: item.UnitName,
                UnitName: item.UnitName,
                BaseUnitQuantity: item.BaseUnitQuantity,
                GST: item.GST,
                GSTPercentage: item.GSTPercentage,
                MarginValue: null,
                BasicAmount: item.BasicAmount,
                GSTAmount: item.GSTAmount,
                CGST: item.CGST,
                SGST: item.SGST,
                IGST: item.IGST,
                CGSTPercentage: item.CGSTPercentage,
                SGSTPercentage: item.SGSTPercentage,
                IGSTPercentage: item.IGSTPercentage,
                Amount: item.Amount,
                BatchCode: item.BatchCode,
                BatchDate: item.BatchDate,
                ItemExpiryDate: item.ItemExpiryDate,
                HSNCode: item.HSNCode,
                DiscountType: item.DiscountType,
                Discount: item.Discount,
                DiscountAmount: item.DiscountAmount
            })),

            InvoicesReferences: [{
                Order: order.id,
                FullOrderNumber: order.FullOrderNumber,
                Description: order.Description || ""
            }],

            InvoiceUploads: [],
            BankData: [],
            ReportFormat: "GRN"
        }
    };

    return transformedData;
}



