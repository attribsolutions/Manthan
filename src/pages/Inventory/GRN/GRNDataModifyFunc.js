export function transformGRNtoInvoiceFormat(originalData) {
    debugger
    const grn = originalData.Data[0]; // Assuming only one GRN object

    const order = grn.GRNReferences?.[0]?.Order || {};
    const grnItem = grn.GRNItems?.[0] || {};
    const orderItem = order.OrderItem?.[0] || {};
    const billingAddress = order.BillingAddress || {};

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

            Customer: order.Supplier?.id || null,
            CustomerName: order.Supplier?.Name || "",
            CustomerGSTIN: order.Supplier?.GSTIN || "",
            CustomerMobileNo: "",

            Party: order.Customer?.id || null,
            PartyName: order.Customer?.Name || "",
            PartyGSTIN: order.Customer?.GSTIN || "",
            PartyMobileNo: "",
            PartyFSSAINo: billingAddress.FSSAINo || "",
            CustomerFSSAINo: "",
            PartyState: "",
            CustomerState: "",
            PartyAddress: billingAddress.Address || "",
            CustomerAddress: billingAddress.Address || "",

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
