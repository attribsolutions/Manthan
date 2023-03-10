
// export const Data = [
//     {
//         id: 70,
//         InvoiceDate: "2023-02-27",
//         InvoiceNumber: 3,
//         FullInvoiceNumber: "IN 3",
//         GrandTotal: "35573.00",
//         RoundOffAmount: "0.00",
//         Customer: 24,
//         CustomerName: "Chitale Bandu Mithaiwale (Bajirao road)",
//         CustomerGSTIN: "27AAAAA0000A1Z5",
//         Party: 4,
//         PartyName: "Shade No-44",
//         PartyGSTIN: "22AAAAA0000A1Z5",
//         InvoiceItems: [
//             {
//                 Item: 106,
//                 ItemName: "Refined Grounut Oil",
//                 Quantity: "11.000",
//                 MRP: null,
//                 MRPValue: null,
//                 Rate: "3000.00",
//                 TaxType: "GST",
//                 UnitName: "Liter",
//                 BaseUnitQuantity: "14005.000",
//                 GST: 106,
//                 GSTPercentage: "5.00",
//                 MarginValue: null,
//                 BasicAmount: "33000.00",
//                 GSTAmount: "1650.00",
//                 CGST: "825.00",
//                 SGST: "825.00",
//                 IGST: "0.00",
//                 CGSTPercentage: "2.50",
//                 SGSTPercentage: "2.50",
//                 IGSTPercentage: "0.00",
//                 Amount: "34650.00",
//                 BatchCode: "A10",
//                 BatchDate: "2023-02-25"
//             },
//             {
//                 Item: 108,
//                 ItemName: "Maida",
//                 Quantity: "1.000",
//                 MRP: null,
//                 MRPValue: null,
//                 Rate: "40.00",
//                 TaxType: "GST",
//                 UnitName: "Kg",
//                 BaseUnitQuantity: "948.000",
//                 GST: 108,
//                 GSTPercentage: "5.00",
//                 MarginValue: null,
//                 BasicAmount: "40.00",
//                 GSTAmount: "2.00",
//                 CGST: "1.00",
//                 SGST: "1.00",
//                 IGST: "0.00",
//                 CGSTPercentage: "2.50",
//                 SGSTPercentage: "2.50",
//                 IGSTPercentage: "0.00",
//                 Amount: "42.00",
//                 BatchCode: "0",
//                 BatchDate: "2023-02-25"
//             },
//             {
//                 Item: 111,
//                 ItemName: "Salt",
//                 Quantity: "11.000",
//                 MRP: null,
//                 MRPValue: null,
//                 Rate: "20.00",
//                 TaxType: "GST",
//                 UnitName: "Kg",
//                 BaseUnitQuantity: "963.000",
//                 GST: 111,
//                 GSTPercentage: "5.00",
//                 MarginValue: null,
//                 BasicAmount: "220.00",
//                 GSTAmount: "11.00",
//                 CGST: "5.50",
//                 SGST: "5.50",
//                 IGST: "0.00",
//                 CGSTPercentage: "2.50",
//                 SGSTPercentage: "2.50",
//                 IGSTPercentage: "0.00",
//                 Amount: "231.00",
//                 BatchCode: "0",
//                 BatchDate: "2023-02-25"
//             },
//             {
//                 Item: 112,
//                 ItemName: "Jire Powder",
//                 Quantity: "1.000",
//                 MRP: null,
//                 MRPValue: null,
//                 Rate: "400.00",
//                 TaxType: "GST",
//                 UnitName: "Kg",
//                 BaseUnitQuantity: "998.000",
//                 GST: 112,
//                 GSTPercentage: "5.00",
//                 MarginValue: null,
//                 BasicAmount: "400.00",
//                 GSTAmount: "20.00",
//                 CGST: "10.00",
//                 SGST: "10.00",
//                 IGST: "0.00",
//                 CGSTPercentage: "2.50",
//                 SGSTPercentage: "2.50",
//                 IGSTPercentage: "0.00",
//                 Amount: "420.00",
//                 BatchCode: "0",
//                 BatchDate: "2023-02-25"
//             },
//             {
//                 Item: 115,
//                 ItemName: "Coriander Leaves",
//                 Quantity: "1.000",
//                 MRP: null,
//                 MRPValue: null,
//                 Rate: "10.00",
//                 TaxType: "GST",
//                 UnitName: "Kg",
//                 BaseUnitQuantity: "3.000",
//                 GST: 115,
//                 GSTPercentage: "0.00",
//                 MarginValue: null,
//                 BasicAmount: "10.00",
//                 GSTAmount: "0.00",
//                 CGST: "0.00",
//                 SGST: "0.00",
//                 IGST: "0.00",
//                 CGSTPercentage: "0.00",
//                 SGSTPercentage: "0.00",
//                 IGSTPercentage: "0.00",
//                 Amount: "10.00",
//                 BatchCode: "a0",
//                 BatchDate: "2023-02-25"
//             },
//             {
//                 Item: 116,
//                 ItemName: "Green Chilli",
//                 Quantity: "11.000",
//                 MRP: null,
//                 MRPValue: null,
//                 Rate: "20.00",
//                 TaxType: "GST",
//                 UnitName: "Kg",
//                 BaseUnitQuantity: "963.000",
//                 GST: 116,
//                 GSTPercentage: "0.00",
//                 MarginValue: null,
//                 BasicAmount: "220.00",
//                 GSTAmount: "0.00",
//                 CGST: "0.00",
//                 SGST: "0.00",
//                 IGST: "0.00",
//                 CGSTPercentage: "0.00",
//                 SGSTPercentage: "0.00",
//                 IGSTPercentage: "0.00",
//                 Amount: "220.00",
//                 BatchCode: "0",
//                 BatchDate: "2023-02-25"
//             }
//         ]
//     },

// ]
const isParentLength = 3
const isRowLength = 15

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
