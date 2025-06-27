import { date_dmy_func, loginUserDetails } from "../../../components/Common/CommonFunction";


export const columns = [
    "Stock Date",
    "Party Name",
    "Item Name",
    "Before Adjustment",
    "Difference",
    "Quantity",
    "Unit Name",
];



export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]

export const Rows = (data) => {
    debugger
    const returnArr = [];
    let TotalQuantity = 0;
    data.forEach((element, key) => {
        const tableitemRow = [
            `${date_dmy_func(element.StockDate)}`,
            `${element.PartyName}`,
            `${element.ItemName}`,
            `${element.BeforeAdjustment}`,
            `${element.Difference}`,
            `${element.Quantity}`,
            `${element.UnitName}`,
        ];

        TotalQuantity = Number(TotalQuantity) + Number(element.Quantity)

        function totalrow() {
            return [
                "Total",
                "",
                "",
                "",
                "",
                `${(TotalQuantity).toFixed(2)}`,
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

    const UserDetails = loginUserDetails()
    var reportArray = [

    ]
    return reportArray;
}