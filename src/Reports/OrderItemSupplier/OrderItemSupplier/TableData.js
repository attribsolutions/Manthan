import { date_dmy_func, loginUserDetails } from "../../../components/Common/CommonFunction";

export const columns = [
    "Supplier Name",
    "Item Name",
    "Qty (No)",
    "Qty (Kg)",
    "Qty (Box)",
];


export const TableSection_1 = [
    "TableSection_1",
]


export const Rows = (data) => {
    let Row = []
    data.forEach(item => {
        const tableitemRow = [
            `${item.SupplierName}`,
            `${item.SKUName}`,
            `${Number(item.QtyInNo).toFixed(2)}`,
            `${Number(item.QtyInKg).toFixed(2)}`,
            `${Number(item.QtyInBox).toFixed(2)}`,
        ];

        Row.push(tableitemRow);
    })
    return Row
    // let supplierName = "";

    // data.forEach((item, index) => {
    //     
    //     if (index === 0 || item.SupplierName !== supplierName) {
    //         const rowSpanCount = data.filter(d => d.SupplierName === item.SupplierName).length;
    //         Row.push([
    //             { content: item.SupplierName || "", rowSpan: rowSpanCount },
    //             item.SKUName,
    //             Number(item.QtyInNo).toFixed(2),
    //             Number(item.QtyInKg).toFixed(2),
    //             Number(item.QtyInBox).toFixed(2), ,
    //         ]);
    //     } else {
    //         Row.push([

    //             item.SKUName,
    //             Number(item.QtyInNo).toFixed(2),
    //             Number(item.QtyInKg).toFixed(2),
    //             Number(item.QtyInBox).toFixed(2),
    //         ]);
    //     }
    //     supplierName = item.SupplierName;
    // });
    // return Row
}

export const DetailsSection_Row_1 = (data) => {
    const { PartyName, PartyAddress } = loginUserDetails()
    var DetailsSection_Row_1 = [
        [`                          ${date_dmy_func(data.Period.FromDate)} to ${date_dmy_func(data.Period.ToDate)} `],
        [`                ${PartyName}`],
        [`                                ${PartyAddress}`],

    ]
    return DetailsSection_Row_1;
}
















