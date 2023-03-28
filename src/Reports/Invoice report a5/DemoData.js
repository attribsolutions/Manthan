
const isParentLength = 3
const isRowLength = 56

function innerdataFunc(index) {
    return {
        Item: index,
        ItemName: "Refined Grounut Oil",
        Quantity: "11.000",
        MRP: null,
        MRPValue: null,
        Rate: "3000.00",
        TaxType: "GST",
        UnitName: "Liter",
        BaseUnitQuantity: "14005.000",
        GST: 106,
        GSTPercentage: "5.00",
        MarginValue: null,
        BasicAmount: "33000.00",
        GSTAmount: "1650.00",
        CGST: "825.00",
        SGST: "825.00",
        IGST: "0.00",
        CGSTPercentage: "2.50",
        SGSTPercentage: "2.50",
        IGSTPercentage: "0.00",
        Amount: "34650.00",
        BatchCode: "A10",
        BatchDate: "2023-02-25"
    }
}

function outerdatfunc(index) {
    const parentData = {
        id: 70,
        InvoiceDate: "2023-02-27",
        InvoiceNumber: 3,
        FullInvoiceNumber: "IN 3",
        GrandTotal: "35573.00",
        RoundOffAmount: "0.00",
        Customer: 24,
        CustomerName: "Chitale Bandu Mithaiwale (Bajirao road)",
        CustomerGSTIN: "27AAAAA0000A1Z5",
        Party: 4,
        PartyName: "Shade No-44",
        PartyGSTIN: "22AAAAA0000A1Z5",
        InvoiceItems: []
    }
    for (let index2 = 0; index2 < isRowLength; index2++) {
        parentData.id = 100 + index;
        parentData.InvoiceItems.push(innerdataFunc(index2))
    }
    return parentData
}
export const dataGenrator = () => {

    const dataArr = []
    for (let index = 0; index < isParentLength; index++) {
        dataArr.push(outerdatfunc(index))

    }
    return dataArr
}


