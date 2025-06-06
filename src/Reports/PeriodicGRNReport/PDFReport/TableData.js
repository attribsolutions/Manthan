import { numberWithCommas } from "../../Report_common_function";
import { date_dmy_func, loginUserDetails } from "../../../components/Common/CommonFunction";

export const columns = [
    "GRN Date",
    "GRNNo",
    "PO",
    "Supplier",
    "Challan NO",
    "ItemName",
    "Quantity",
    "Rate",
    "Unit",
];

export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]

export const Rows = (data) => {
    debugger;
    const returnArr = [];
    let totalQuantity = 0;

    data.forEach((element) => {
        const quantity = Number(element.Quantity) || 0;
        totalQuantity += quantity;

        const tableitemRow = [
            `${date_dmy_func(element.GRNDate)}`,
            `${element.GRNNo}`,
            `${element.PO ? element.PO : ""}`,
            `${element.Supplier}`,
            `${element.ChallanNo}`,
            `${element.ItemName}`,
            `${quantity.toFixed(2)}`,
            `${Number(element.Rate).toFixed(2)}`,
            `${element.Unit}`,
        ];
        returnArr.push(tableitemRow);
    });

    // Push total row
    const totalRow = [
        "", "", "", "", "", "Total",
        `${totalQuantity.toFixed(2)}`, "", ""
    ];
    returnArr.push(totalRow);

    return returnArr;
};


export const ReportHederRows = (data) => {
    var reportArray = [
        [`From Date:  ${date_dmy_func(data.FromDate)}`, `To Date:     ${date_dmy_func(data.ToDate)}`, `Address:  ${loginUserDetails().PartyAddress}`],
        // [],
    ]
    return reportArray;
}