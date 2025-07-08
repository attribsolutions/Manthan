import { date_dmy_func, loginUserDetails } from "../../../components/Common/CommonFunction";


export const columns = [
    "Stock Date",
    "Party Name",
    "Item Name",
    "Before Adj.",
    "Prev.Qty",
    "Difference",
    "UOM",
];



export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]

export const Rows = (data) => {

    const returnArr = [];
    let TotalQuantity = 0;
    data.forEach((element, key) => {
        const tableitemRow = [
            `${element.StockDate}`,
            `${element.PartyName}`,
            `${element.ItemName}`,
            `${element.BeforeAdjustment}`,
            `${element.Quantity}`,
            `${element.Difference}`,
            `${element.UnitName}`,
        ];

        TotalQuantity = Number(TotalQuantity) + Number(element.Quantity)

        function totalrow() {
            return [
                "Total",
                "",
                "",
                "",
                `${(TotalQuantity).toFixed(2)}`,
                "",
                "",
            ];
        };
        returnArr.push(tableitemRow);
        if (key === data.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}

export const ReportHederRows = (data) => {

    var reportArray = [

    ]
    return reportArray;
}